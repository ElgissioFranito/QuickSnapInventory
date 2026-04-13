# Quick Start Guide - QuickSnap Inventory

## 🚀 Get Started in 5 Minutes

### 1. Start the Development Server
```bash
cd /media/elgissio/ssd/github/QuickSnapInventory
npm start
```

You'll see:
```
› Press › to open the web UI
› Press ‹ to exit
› Press a to open Android
› Press i to open iOS
› Press j to open the debugger
› Press r to reload the app
```

### 2. Choose Your Platform

#### Android (Recommended for Testing)
```bash
a  # Then select from Expo Go or build
# OR
npm run android
```

#### iOS
```bash
i  # Then open in iOS simulator
# OR
npm run ios
```

#### Web (Limited Features)
```bash
w  # Or npm run web
# Note: Camera not supported on web
```

## 📱 Features Overview

### Home Screen
- **View Items**: See all your items with thumbnails
- **Search**: Type to find items by name
- **Sort**: Click name/date/category to sort
- **Quick Add**: Tap the blue **+** button to add new items

### Add Item
1. **Name**: Enter the item name
2. **Category**: Tap category button to select
3. **Photo**: Take a photo or choose from gallery
4. **QR Code**: Auto-generated (no action needed)
5. **Save**: Tap "Create Item"

### Scan QR Code
1. Go to **Scan** tab
2. Point camera at any QR code
3. App shows the item
4. Updates "last scanned" time

### View Item Details
- **Tap any item** to see full details
- **QR Code**: Large scannable code shown
- **Edit**: Button to modify item
- **Delete**: Button to remove item

### Manage Categories
1. Go to **Categories** tab
2. Add category name
3. Pick a color
4. Tap "Add Category"
5. Edit or delete anytime

### Customize Settings
1. Go to **Settings** tab
2. Set your username
3. Choose theme (light/dark/system)
4. Toggle high-resolution photos
5. Option to clear all data

## 🔥 Hot Features

✨ **Instant Search**: Type to filter items in real-time  
🎨 **Color Categories**: Visual organization with colors  
📸 **Auto Thumbnails**: Photos compress automatically  
🔲 **Smart QR**: Unique code per item, always unique  
🌙 **Dark Mode**: Complete dark theme support  
📊 **Scan History**: See when items were last scanned  
⚡ **Offline**: No internet required, all local  
🔐 **Privacy**: All data stays on your device  

## 🎯 Common Tasks

### Create First Item
1. Tap **+** on Home screen
2. Enter "My Backpack"
3. Select a category (create one first if needed)
4. Tap "Take Photo" and take a picture
5. Tap "Create Item"
6. Done! Item appears on home screen

### Find an Item
1. Use **Search** on Home screen
2. Type part of the name
3. Items filter in real-time
4. Tap to view details

### Quick Scan
1. Go to **Scan** tab
2. Point at any QR code
3. App shows the item
4. Can scan from another phone to find items

### Export Data
Currently, all data is stored locally in the database. Future versions will support export.

## 📋 Pro Tips

### Organization Tips
- Create categories before adding items
- Use consistent naming (e.g., "Kitchen - Utensils")
- Color-code for quick visual identification
- Keep item descriptions specific

### Photo Tips
- Good lighting for clear scans
- Uncluttered background
- Portrait orientation works best
- High-resolution toggle for large prints

### Scanning Tips
- Ensure QR code is visible
- Keep camera steady for 1-2 seconds
- Good lighting helps faster recognition
- From any distance, app auto-focuses

## 🐛 Troubleshooting

### Camera Not Working?
1. Check permissions: Settings > Permissions > Camera
2. Grant camera access
3. Restart the app
4. Try again

### Photos Not Saving?
1. Check file permissions
2. Ensure enough device storage
3. Clear cache if needed
4. Restart app

### Items Not Appearing?
1. Check search filter is clear
2. Ensure category is not deleted
3. Try refreshing (pull down)
4. Restart app

### Slow Performance?
1. Photos are auto-compressed
2. Large database can slow search
3. Clear old items if needed
4. Ensure device has free RAM

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `r` | Reload app |
| `c` | Clear console |
| `m` | Toggle menu |
| `i` | iOS simulator |
| `a` | Android emulator |
| `w` | Web browser |

## 🔗 Additional Resources

- **Architecture Doc**: See `IMPLEMENTATION.md` for detailed docs
- **Verification**: Check `VERIFICATION_CHECKLIST.md` for complete feature list
- **Tech Stack**: Expo SDK 54, React 19, React Native 0.81

## 📞 Support

For issues during development:
1. Check the console for error messages
2. Restart the development server
3. Clear Expo cache: `npm start -- --clear`
4. Delete node_modules and reinstall if needed

## 🎬 Next Steps

1. ✅ Start the app with `npm start`
2. ✅ Create a category (e.g., "Kitchen")
3. ✅ Add your first item with a photo
4. ✅ Try scanning the QR code
5. ✅ Explore all screens and features

---

**Happy Organizing!** 🎉

Your QuickSnap Inventory app is ready to help you find items fast!
