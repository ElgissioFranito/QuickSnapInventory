import "@/global.css";
import {
  View,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useInventory } from "@/context/InventoryContext";

export default function ScanResultScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { qrCode, unknown } = params;

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#9CA3AF" : "#6B7280";

  const handleCreateNew = () => {
    router.push({
      pathname: "/add-item",
      params: { qrCode },
    });
  };

  const handleDismiss = () => {
    router.back();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
      }}
    >
      <View
        style={{
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        {unknown === "true" ? (
          <>
            <MaterialIcons
              name="qr-code-scanner"
              size={64}
              color="#F97316"
              style={{ marginBottom: 16 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: textColor,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Unknown Item
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: secondaryTextColor,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              This QR code is not in your inventory. Would you like to add it?
            </Text>
          </>
        ) : (
          <>
            <MaterialIcons
              name="check-circle"
              size={64}
              color="#10B981"
              style={{ marginBottom: 16 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: textColor,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Item Found
            </Text>
          </>
        )}
      </View>

      {unknown === "true" && (
        <TouchableOpacity
          onPress={handleCreateNew}
          style={{
            backgroundColor: "#3B82F6",
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 8,
            marginBottom: 12,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            Create New Item
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleDismiss}
        style={{
          backgroundColor: isDark ? "#374151" : "#E5E7EB",
          paddingHorizontal: 32,
          paddingVertical: 12,
          borderRadius: 8,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: isDark ? "#D1D5DB" : "#374151",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Dismiss
        </Text>
      </TouchableOpacity>
    </View>
  );
}
