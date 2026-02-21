import "@/global.css";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native";
import { useInventory } from "@/context/InventoryContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect } from "expo-router";
import { deleteImage } from "@/utils/imageUtils";

export default function ItemDetailScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const itemId = params.id as string;

  const { getItemById, deleteItemData, categories } = useInventory();
  const [item, setItem] = useState(() => getItemById(itemId));
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const updated = getItemById(itemId);
      setItem(updated);
    }, [itemId, getItemById])
  );

  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.name || "Uncategorized"
    );
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.color || "#9CA3AF";
  };

  const handleEdit = () => {
    router.push(`/add-item?id=${itemId}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item?.name}"?`,
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setLoading(true);
              if (item?.photoUri) {
                await deleteImage(item.photoUri);
              }
              if (item?.thumbnailUri) {
                await deleteImage(item.thumbnailUri);
              }
              await deleteItemData(itemId);
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete item");
              console.error(error);
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#374151" : "#E5E7EB";
  const sectionBgColor = isDark ? "#1F2937" : "#F9FAFB";

  if (!item) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        className="bg-white dark:bg-gray-900"
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{ paddingVertical: 12 }}
    >
      {/* Main Photo */}
      {item.photoUri && (
        <Image
          source={{ uri: item.photoUri }}
          style={{
            width: "100%",
            height: 300,
            marginBottom: 16,
          }}
        />
      )}

      {/* Item Info */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        {/* Name and Category */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: textColor,
              marginBottom: 8,
            }}
          >
            {item.name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: getCategoryColor(item.categoryId),
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: secondaryTextColor,
              }}
            >
              {getCategoryName(item.categoryId)}
            </Text>
          </View>
        </View>

        {/* Metadata */}
        <View
          style={{
            backgroundColor: sectionBgColor,
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <Text style={{ color: secondaryTextColor }}>Created</Text>
            <Text style={{ color: textColor, fontWeight: "600" }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: secondaryTextColor }}>Last Scanned</Text>
            <Text style={{ color: textColor, fontWeight: "600" }}>
              {item.lastScannedAt
                ? new Date(item.lastScannedAt).toLocaleDateString()
                : "Never"}
            </Text>
          </View>
        </View>

        {/* QR Code */}
        <View
          style={{
            backgroundColor: sectionBgColor,
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
              marginBottom: 16,
            }}
          >
            Scan this code to view item
          </Text>
          <QRCode
            value={item.qrCode}
            size={200}
            color="#000000"
            backgroundColor="#FFFFFF"
          />
          <Text
            style={{
              fontSize: 10,
              color: secondaryTextColor,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            {item.qrCode}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleEdit}
            disabled={loading}
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="edit" size={20} color="#FFFFFF" />
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "600",
                marginLeft: 8,
              }}
            >
              Edit Item
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            disabled={loading}
            style={{
              backgroundColor: "#EF4444",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="delete" size={20} color="#FFFFFF" />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "600",
                    marginLeft: 8,
                  }}
                >
                  Delete Item
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
