export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  qrCode: string;
  photoUri: string;
  thumbnailUri: string;
  createdAt: number;
  lastScannedAt: number | null;
}

export interface AppSettings {
  username: string;
  theme: 'light' | 'dark' | 'system';
  highResolution: boolean;
}
