import "@/global.css";
import {
  View,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Text } from "react-native";
import { useInventory } from "@/context/InventoryContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { getItemByQrCode } from "@/utils/database";

export default function ScanScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { updateItemLastScanned } = useInventory();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;

    try {
      setScanned(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Try to find item by QR code
      const item = await getItemByQrCode(data);

      if (item) {
        // Update last scanned time
        await updateItemLastScanned(item.id);
        router.push(`/item/${item.id}`);
      } else {
        // Show dialog for unknown QR code
        router.push({
          pathname: "/scan-result",
          params: { qrCode: data, unknown: "true" },
        });
      }
    } catch (error) {
      console.error("Error handling scan:", error);
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );
      setScanned(false);
    }
  };

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";

  if (!permission) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        className="bg-white dark:bg-gray-900"
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bgColor }}>
        <Text
          style={{
            color: textColor,
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 16,
            textAlign: "center",
            paddingHorizontal: 32,
          }}
        >
          Camera access required
        </Text>
        <Text
          style={{
            color: isDark ? "#9CA3AF" : "#6B7280",
            fontSize: 14,
            marginBottom: 24,
            textAlign: "center",
            paddingHorizontal: 32,
          }}
        >
          Please allow camera access to scan QR codes
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: "#3B82F6",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Scanning frame */}
        <View
          style={{
            width: 250,
            height: 250,
            borderWidth: 2,
            borderColor: "#3B82F6",
            borderRadius: 12,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
          }}
        />

        {/* Info text */}
        <Text
          style={{
            position: "absolute",
            bottom: 100,
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
            paddingHorizontal: 32,
          }}
        >
          Point camera at QR code
        </Text>
      </View>

      {/* Close Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
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

      {/* Rescan button */}
      {scanned && (
        <TouchableOpacity
          onPress={() => setScanned(false)}
          style={{
            position: "absolute",
            bottom: 32,
            alignSelf: "center",
            backgroundColor: "#3B82F6",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Scan Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
