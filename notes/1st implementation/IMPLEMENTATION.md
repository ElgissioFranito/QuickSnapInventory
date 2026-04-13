# QuickSnap Inventory

A powerful offline-first inventory management application built with React Native, Expo, and TypeScript. Organize your items with photos and unique QR codes for quick scanning and retrieval.

## 🎯 Features

### Core Functionality
- **📸 Photo Capture**: Take photos or select from gallery with automatic thumbnail generation
- **🔲 QR Code Management**: Unique QR code generation and scanning for each item
- **🏷️ Category Organization**: Manage custom categories with color coding
- **🔍 Smart Search**: Full-text search across all items
- **📊 Sorting Options**: Sort by name, date, or category
- **⚡ Offline-First**: All data stored locally without internet dependency

### Technical Features
- **🗄️ High-Performance Database**: op-sqlite for fast queries on large datasets
- **🎨 Modern UI**: Dark/Light theme support with NativeWind styling
- **⚙️ Persistent Settings**: Username, theme preferences, and resolution settings
- **📱 Native Experience**: Full platform support (iOS/Android)
- **🔐 Local Storage**: No cloud dependency, full data control

## 📋 Screens

### 1. Home Screen
- Browse all inventory items
- Search and filter functionality
- Sort by name, date, or category
- View scan status for each item
- Quick access to add new items

### 2. Add/Edit Item Screen
- Capture photos from camera or gallery
- Automatic thumbnail generation
- Category selection
- Unique QR code generation
- High-resolution option toggle

### 3. Scan QR Screen
- Real-time QR code scanning
- Automatic item lookup
- Support for unknown QR codes
- Haptic feedback on successful scan

### 4. Item Detail Screen
- Full-size photo display
- Item metadata and history
- Large QR code display for external scanning
- Edit and delete options
- Last scanned timestamp

### 5. Categories Management Screen
- View all categories with color coding
- Create new categories
- Edit category names and colors
- Delete unused categories

### 6. Settings Screen
- Username configuration
- Theme selection (Light/Dark/System)
- High-resolution photo toggle
- Clear all data option
- App information

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Navigation** | @react-navigation/native-stack | Tab-based navigation |
| **State Management** | Context API | Global inventory state |
| **Database** | @op-engineering/op-sqlite | High-performance local storage |
| **UI Framework** | NativeWind (Tailwind) | Responsive styling |
| **Camera** | react-native-vision-camera | Photo capture and QR scanning |
| **Image Processing** | @bam.tech/react-native-image-resizer | Thumbnail generation |
| **QR Codes** | react-native-qrcode-svg | QR display and generation |
| **File System** | expo-file-system | Image persistence |
| **Crypto** | expo-crypto | UUID generation |
| **Storage** | @react-native-async-storage | Settings persistence |

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS) or Android Studio (for Android)

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd QuickSnapInventory
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on specific platform**
```bash
# Android
npm run android

# iOS
npm run ios

# Web (limited functionality)
npm run web
```

## 🚀 Usage

### Creating an Item
1. Tap the **+** button on the Home screen
2. Enter item name
3. Select a category
4. Take a photo or choose from gallery
5. Tap "Create Item" - QR code auto-generates

### Scanning Items
1. Go to the **Scan** tab
2. Point camera at any item's QR code
3. App automatically shows item details
4. Updates last scanned timestamp

### Managing Categories
1. Go to **Categories** tab
2. Fill in category name
3. Choose color from palette
4. Tap "Add Category"
5. Edit or delete existing categories

### Customizing Settings
1. Go to **Settings** tab
2. Set username for profile
3. Choose preferred theme
4. Toggle high-resolution photos
5. Option to clear all data

## 📁 Project Structure

```
app/
├── _layout.tsx              # Navigation and tab structure
├── index.tsx                # Home screen
├── add-item.tsx             # Add/Edit item screen
├── scan.tsx                 # QR scanner screen
├── scan-result.tsx          # Scan result handler
├── categories.tsx           # Category management
├── settings.tsx             # Settings screen
└── item/
    └── [id].tsx            # Item detail screen

context/
├── InventoryContext.tsx     # Global state management
└── types.ts                 # Type definitions

utils/
├── database.ts              # Database operations
├── imageUtils.ts            # Image processing
└── qrcode.ts                # QR code utilities
```

## 🗄️ Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at INTEGER NOT NULL
);
```

### Items Table
```sql
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  photo_uri TEXT NOT NULL,
  thumbnail_uri TEXT,
  created_at INTEGER NOT NULL,
  last_scanned_at INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Settings Table
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

## 🎨 Styling

The app uses **NativeWind** (Tailwind CSS for React Native) with custom dark/light theme colors:

- **Primary**: #3B82F6 (Blue)
- **Success**: #10B981 (Green)
- **Danger**: #EF4444 (Red)
- **Warning**: #F97316 (Orange)

## 🔄 Data Flow

1. **App Launch** → Initialize database → Load all data into Context
2. **Add Item** → Validate inputs → Process image → Save to database → Refresh Context
3. **Scan QR** → Capture → Decode → Look up in database → Update last scanned
4. **Update Item** → Modify fields → Save changes → Refresh Context
5. **Delete Item** → Remove files → Delete database record → Refresh Context

## 🚀 Performance Optimizations

- **op-sqlite**: JSI-based database for 2-10x performance
- **Thumbnail generation**: Automatic image compression
- **Memoized filtering**: Efficient search and sort operations
- **Context optimization**: Selective re-renders
- **Lazy image loading**: Thumbnail display before full images

## 📱 Platform Support

- ✅ **Android 6.0+** (Full support)
- ✅ **iOS 13.0+** (Full support)
- ⚠️ **Web** (Limited - camera/gallery unavailable)

## 🔒 Permissions Required

- **Camera**: Photo capture and QR scanning
- **Photo Library**: Selecting images from gallery
- **File System**: Image storage and retrieval

## 🐛 Known Limitations

- Web version doesn't support camera functionality
- Large photo libraries may impact thumbnail generation time
- QR codes are UUID-based (format validation required)

## 📈 Future Enhancements

- Cloud synchronization (Supabase/Firebase)
- Export/Import JSON or CSV
- Web interface
- Advanced search with tags
- Statistics dashboard
- Batch operations

## 📝 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
