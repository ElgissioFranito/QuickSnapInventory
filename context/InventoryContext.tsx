import React, { createContext, useContext, useEffect, useState } from 'react';
import { Item, Category, AppSettings } from './types';
import { initDatabase, getAllItems, getAllCategories, addItem, updateItem, deleteItem, addCategory, updateCategory, deleteCategory, getSettings, saveSettings } from '@/utils/database';

interface InventoryContextType {
  items: Item[];
  categories: Category[];
  settings: AppSettings;
  loading: boolean;
  
  // Item operations
  addNewItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<string>;
  updateItemData: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItemData: (id: string) => Promise<void>;
  getItemById: (id: string) => Item | undefined;
  updateItemLastScanned: (id: string) => Promise<void>;
  
  // Category operations
  addNewCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<string>;
  updateCategoryData: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategoryData: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  
  // Settings operations
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  
  // Data management
  refreshData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    username: '',
    theme: 'system',
    highResolution: false,
  });
  const [loading, setLoading] = useState(true);

  // Initialize database and load data
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        await refreshData();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshData = async () => {
    try {
      const [itemsData, categoriesData, settingsData] = await Promise.all([
        getAllItems(),
        getAllCategories(),
        getSettings(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const addNewItem = async (item: Omit<Item, 'id' | 'createdAt'>) => {
    const id = await addItem(item);
    await refreshData();
    return id;
  };

  const updateItemData = async (id: string, updates: Partial<Item>) => {
    await updateItem(id, updates);
    await refreshData();
  };

  const deleteItemData = async (id: string) => {
    await deleteItem(id);
    await refreshData();
  };

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  const updateItemLastScanned = async (id: string) => {
    await updateItem(id, { lastScannedAt: Date.now() });
    await refreshData();
  };

  const addNewCategory = async (category: Omit<Category, 'id' | 'createdAt'>) => {
    const id = await addCategory(category);
    await refreshData();
    return id;
  };

  const updateCategoryData = async (id: string, updates: Partial<Category>) => {
    await updateCategory(id, updates);
    await refreshData();
  };

  const deleteCategoryData = async (id: string) => {
    await deleteCategory(id);
    await refreshData();
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    await saveSettings(updated);
    setSettings(updated);
  };

  const clearAllData = async () => {
    // Will be implemented in database utils
    await refreshData();
  };

  const value: InventoryContextType = {
    items,
    categories,
    settings,
    loading,
    addNewItem,
    updateItemData,
    deleteItemData,
    getItemById,
    updateItemLastScanned,
    addNewCategory,
    updateCategoryData,
    deleteCategoryData,
    getCategoryById,
    updateSettings,
    refreshData,
    clearAllData,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};
