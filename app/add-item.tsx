import "@/global.css";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native";
import { useInventory } from "@/context/InventoryContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { generateUniqueQRCode } from "@/utils/qrcode";
import { createThumbnail, saveImage, deleteImage } from "@/utils/imageUtils";
import QRCode from "react-native-qrcode-svg";

export default function AddItemScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const itemId = params.id as string | undefined;

  const {
    categories,
    addNewItem,
    updateItemData,
    getItemById,
  } = useInventory();

  const existingItem = itemId ? getItemById(itemId) : null;

  const [name, setName] = useState(existingItem?.name || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    existingItem?.categoryId || (categories[0]?.id || "")
  );
  const [photoUri, setPhotoUri] = useState(existingItem?.photoUri || "");
  const [thumbnailUri, setThumbnailUri] = useState(existingItem?.thumbnailUri || "");
  const [qrCode, setQrCode] = useState(existingItem?.qrCode || "");
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (!itemId && !qrCode) {
      generateUniqueQRCode().then(setQrCode);
    }
  }, [itemId, qrCode]);

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#374151" : "#E5E7EB";
  const inputBgColor = isDark ? "#1F2937" : "#F3F4F6";

  const handleTakePhoto = async () => {
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
      return;
    }
    setShowCamera(true);
  };

  const handleSelectFromGallery = async () => {
    if (!mediaPermission?.granted) {
      await requestMediaPermission();
      return;
    }

    try {
      const result = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        first: 1,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      });

      if (result.assets.length > 0) {
        const asset = result.assets[0];
        await processPhoto(asset.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select photo");
      console.error(error);
    }
  };

  const processPhoto = async (uri: string) => {
    try {
      setLoading(true);
      const savedUri = await saveImage(uri);
      setPhotoUri(savedUri);

      const thumbnail = await createThumbnail(savedUri);
      setThumbnailUri(thumbnail);

      setShowCamera(false);
    } catch (error) {
      Alert.alert("Error", "Failed to process photo");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!photoUri) {
      Alert.alert("Error", "Please select a photo");
      return;
    }

    try {
      setLoading(true);

      if (itemId) {
        // Update existing item
        await updateItemData(itemId, {
          name,
          categoryId: selectedCategoryId,
          photoUri,
          thumbnailUri,
        } as any);
      } else {
        // Add new item
        await addNewItem({
          name,
          categoryId: selectedCategoryId,
          qrCode: qrCode || "",
          photoUri,
          thumbnailUri,
          lastScannedAt: null,
        });
      }

      Alert.alert("Success", itemId ? "Item updated" : "Item created");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save item");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (showCamera && cameraPermission?.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <CameraView
          style={{ flex: 1 }}
          onPictureSaved={(result) => {
            processPhoto(result.uri);
          }}
          facing="back"
        />
        <TouchableOpacity
          onPress={() => setShowCamera(false)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Item Name */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: secondaryTextColor,
          marginBottom: 8,
          marginTop: 12,
        }}
      >
        Item Name *
      </Text>
      <TextInput
        placeholder="Enter item name"
        placeholderTextColor={secondaryTextColor}
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: inputBgColor,
          color: textColor,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: borderColor,
          fontSize: 16,
        }}
      />

      {/* Category Selection */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: secondaryTextColor,
          marginBottom: 8,
        }}
      >
        Category *
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategoryId(category.id)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
              marginRight: 8,
              backgroundColor:
                selectedCategoryId === category.id
                  ? category.color
                  : inputBgColor,
              borderWidth: 1,
              borderColor:
                selectedCategoryId === category.id ? category.color : borderColor,
            }}
          >
            <Text
              style={{
                color:
                  selectedCategoryId === category.id
                    ? "#FFFFFF"
                    : textColor,
                fontWeight: selectedCategoryId === category.id ? "600" : "500",
              }}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Photo Selection */}
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: secondaryTextColor,
          marginBottom: 8,
        }}
      >
        Photo *
      </Text>
      {photoUri ? (
        <View style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: photoUri }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              deleteImage(photoUri);
              setPhotoUri("");
              setThumbnailUri("");
            }}
            style={{
              backgroundColor: "#EF4444",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Remove Photo
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleTakePhoto}
            style={{
              backgroundColor: inputBgColor,
              borderWidth: 2,
              borderColor: borderColor,
              borderRadius: 8,
              paddingVertical: 24,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <MaterialIcons
              name="camera-alt"
              size={32}
              color="#3B82F6"
              style={{ marginBottom: 8 }}
            />
            <Text style={{ color: textColor, fontWeight: "600" }}>
              Take Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSelectFromGallery}
            style={{
              backgroundColor: inputBgColor,
              borderWidth: 2,
              borderColor: borderColor,
              borderRadius: 8,
              paddingVertical: 24,
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="image"
              size={32}
              color="#3B82F6"
              style={{ marginBottom: 8 }}
            />
            <Text style={{ color: textColor, fontWeight: "600" }}>
              Choose from Gallery
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* QR Code Display */}
      {qrCode && (
        <View
          style={{
            backgroundColor: inputBgColor,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            marginBottom: 20,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: secondaryTextColor,
              marginBottom: 12,
            }}
          >
            QR Code
          </Text>
          <QRCode
            value={qrCode}
            size={150}
            color="#000000"
            backgroundColor="#FFFFFF"
          />
          <Text
            style={{
              fontSize: 10,
              color: secondaryTextColor,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {qrCode}
          </Text>
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#9CA3AF" : "#3B82F6",
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            {itemId ? "Update Item" : "Create Item"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          backgroundColor: isDark ? "#374151" : "#E5E7EB",
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: isDark ? "#D1D5DB" : "#374151",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Cancel
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
