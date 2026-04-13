import { useInventory } from "@/context/InventoryContext";
import "@/global.css";
import { deleteImage } from "@/utils/imageUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ItemDetailModal() {
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
      categories.find((cat) => cat.id === categoryId)?.name || "Tsisy Karazany"
    );
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.color || "#9CA3AF";
  };

  const handleEdit = () => {
    router.push({
      pathname: "/add-item-modal",
      params: { id: itemId },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Ataovy sérieux",
      `Tana fafanao ve ity "${item?.name}" ity?`,
      [
        { text: "Tsy tapakevitra indray", onPress: () => {}, style: "cancel" },
        {
          text: "Mazava oazy",
          onPress: async () => {
            try {
              setLoading(true);
              if (item?.photoUri) {
                try {
                  await deleteImage(item.photoUri);
                } catch (e) {
                  console.warn("Could not delete photo:", e);
                }
              }
              if (item?.thumbnailUri) {
                try {
                  await deleteImage(item.thumbnailUri);
                } catch (e) {
                  console.warn("Could not delete thumbnail:", e);
                }
              }
              await deleteItemData(itemId);
              router.back();
            } catch (error) {
              Alert.alert("Tsy am place-ny !", "Famafana tsy possible");
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
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bgColor }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Main Photo */}
      {item.photoUri && (
        <Image
          source={{ uri: item.photoUri }}
          style={{ width: "100%", height: 300 }}
        />
      )}

      {/* Item Info Section */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Name */}
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

        {/* Category */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
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
          <Text style={{ color: secondaryTextColor, fontSize: 14 }}>
            {getCategoryName(item.categoryId)}
          </Text>
        </View>

        {/* QR Code Section */}
        <View
          style={{
            backgroundColor: sectionBgColor,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            marginBottom: 16,
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
            value={item.qrCode}
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
            {item.qrCode}
          </Text>
        </View>

        {/* Scan Status */}
        {item.lastScannedAt && (
          <View
            style={{
              backgroundColor: sectionBgColor,
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <MaterialIcons name="check-circle" size={20} color="#10B981" />
            <Text style={{ color: textColor, marginLeft: 8, fontSize: 14 }}>
              Scan farany:{" "}
              {new Date(item.lastScannedAt).toLocaleDateString()}{" "}
              {new Date(item.lastScannedAt).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {/* Created Date */}
        <View
          style={{
            backgroundColor: sectionBgColor,
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <MaterialIcons name="calendar-today" size={20} color={secondaryTextColor} />
          <Text style={{ color: textColor, marginLeft: 8, fontSize: 14 }}>
            Namboarina : {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        onPress={handleEdit}
        disabled={loading}
        style={{
          backgroundColor: "#3B82F6",
          marginHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
          Misy ahitsy
        </Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={handleDelete}
        disabled={loading}
        style={{
          backgroundColor: "#EF4444",
          marginHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            Tsisy ilana azy
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
