import { AppSettings, Category, Item } from '@/context/types';
import { DB, open } from '@op-engineering/op-sqlite';
import * as Crypto from 'expo-crypto';

let db: DB | null = null;

export const initDatabase = async () => {
  if (db) return;

  try {
    db = await open({
      name: 'quicksnap.db',
      location: 'documents',
    });

    // Create tables
    await db.execute(
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#3B82F6',
        created_at INTEGER NOT NULL
      );`
    );

    await db.execute(
      `CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT NOT NULL,
        qr_code TEXT NOT NULL UNIQUE,
        photo_uri TEXT NOT NULL,
        thumbnail_uri TEXT,
        created_at INTEGER NOT NULL,
        last_scanned_at INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );`
    );

    await db.execute(
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );`
    );

    // Initialize default settings if not exists
    await db.execute(
      `INSERT OR IGNORE INTO settings (key, value) VALUES 
        ('username', ''),
        ('theme', 'system'),
        ('highResolution', '0');`
    );
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const getAllItems = async (): Promise<Item[]> => {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.execute(
      `SELECT 
        id, name, category_id as categoryId, qr_code as qrCode,
        photo_uri as photoUri, thumbnail_uri as thumbnailUri,
        created_at as createdAt, last_scanned_at as lastScannedAt
       FROM items ORDER BY created_at DESC;`
    );

    return (result.rows as unknown as Item[]) || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.execute(
      `SELECT 
        id, name, color, created_at as createdAt
       FROM categories ORDER BY created_at ASC;`
    );

    return (result.rows as unknown as Category[]) || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const addItem = async (item: Omit<Item, 'id' | 'createdAt'>): Promise<string> => {
  if (!db) throw new Error('Database not initialized');

  const id = await Crypto.randomUUID();
  const createdAt = Date.now();

  try {
    await db.execute(
      `INSERT INTO items 
        (id, name, category_id, qr_code, photo_uri, thumbnail_uri, created_at, last_scanned_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        item.name,
        item.categoryId,
        item.qrCode,
        item.photoUri,
        item.thumbnailUri || '',
        createdAt,
        item.lastScannedAt || null,
      ]
    );

    return id;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const updateItem = async (id: string, updates: Partial<Item>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const setClauses: string[] = [];
  const args: any[] = [];

  if (updates.name !== undefined) {
    setClauses.push('name = ?');
    args.push(updates.name);
  }
  if (updates.categoryId !== undefined) {
    setClauses.push('category_id = ?');
    args.push(updates.categoryId);
  }
  if (updates.photoUri !== undefined) {
    setClauses.push('photo_uri = ?');
    args.push(updates.photoUri);
  }
  if (updates.thumbnailUri !== undefined) {
    setClauses.push('thumbnail_uri = ?');
    args.push(updates.thumbnailUri);
  }
  if (updates.lastScannedAt !== undefined) {
    setClauses.push('last_scanned_at = ?');
    args.push(updates.lastScannedAt);
  }

  if (setClauses.length === 0) return;

  args.push(id);
  const sql = `UPDATE items SET ${setClauses.join(', ')} WHERE id = ?`;

  try {
    await db.execute(sql, args);
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

export const deleteItem = async (id: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  try {
    await db.execute('DELETE FROM items WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const addCategory = async (
  category: Omit<Category, 'id' | 'createdAt'>
): Promise<string> => {
  if (!db) throw new Error('Database not initialized');

  const id = await Crypto.randomUUID();
  const createdAt = Date.now();

  try {
    await db.execute(
      `INSERT INTO categories (id, name, color, created_at) VALUES (?, ?, ?, ?)`,
      [id, category.name, category.color, createdAt]
    );

    return id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  updates: Partial<Category>
): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const setClauses: string[] = [];
  const args: any[] = [];

  if (updates.name !== undefined) {
    setClauses.push('name = ?');
    args.push(updates.name);
  }
  if (updates.color !== undefined) {
    setClauses.push('color = ?');
    args.push(updates.color);
  }

  if (setClauses.length === 0) return;

  args.push(id);
  const sql = `UPDATE categories SET ${setClauses.join(', ')} WHERE id = ?`;

  try {
    await db.execute(sql, args);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const getSettings = async (): Promise<AppSettings | null> => {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.execute(
      `SELECT key, value FROM settings WHERE key IN ('username', 'theme', 'highResolution');`
    );

    const rows = (result.rows as unknown as any[]) || [];
    const settingsObj: any = {};

    rows.forEach((row: any) => {
      if (row.key === 'highResolution') {
        settingsObj[row.key] = row.value === '1';
      } else {
        settingsObj[row.key] = row.value;
      }
    });

    return {
      username: settingsObj.username || '',
      theme: settingsObj.theme || 'system',
      highResolution: settingsObj.highResolution || false,
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  try {
    await db.execute(
      `UPDATE settings SET value = ? WHERE key = 'username'`,
      [settings.username]
    );
    await db.execute(
      `UPDATE settings SET value = ? WHERE key = 'theme'`,
      [settings.theme]
    );
    await db.execute(
      `UPDATE settings SET value = ? WHERE key = 'highResolution'`,
      [settings.highResolution ? '1' : '0']
    );
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  try {
    await db.execute('DELETE FROM items;');
    await db.execute('DELETE FROM categories;');
    await db.execute(`UPDATE settings SET value = '' WHERE key = 'username';`);
    await db.execute(`UPDATE settings SET value = 'system' WHERE key = 'theme';`);
    await db.execute(`UPDATE settings SET value = '0' WHERE key = 'highResolution';`);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

export const getItemByQrCode = async (qrCode: string): Promise<Item | null> => {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.execute(
      `SELECT 
        id, name, category_id as categoryId, qr_code as qrCode,
        photo_uri as photoUri, thumbnail_uri as thumbnailUri,
        created_at as createdAt, last_scanned_at as lastScannedAt
       FROM items WHERE qr_code = ? LIMIT 1;`,
      [qrCode]
    );

    const rows = (result.rows as unknown as Item[]) || [];
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting item by QR code:', error);
    return null;
  }
};
