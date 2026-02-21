import "@/global.css";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  useColorScheme,
  Alert,
} from "react-native";
import { Text } from "react-native";
import { useInventory } from "@/context/InventoryContext";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { clearAllData } from "@/utils/database";

const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { settings, updateSettings } = useInventory();
  const [username, setUsername] = useState(settings.username);
  const [theme, setTheme] = useState(settings.theme);
  const [highRes, setHighRes] = useState(settings.highResolution);

  useFocusEffect(
    useCallback(() => {
      setUsername(settings.username);
      setTheme(settings.theme);
      setHighRes(settings.highResolution);
    }, [settings])
  );

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    await updateSettings({ username: value });
  };

  const handleThemeChange = async (value: "light" | "dark" | "system") => {
    setTheme(value);
    await updateSettings({ theme: value });
  };

  const handleHighResChange = async (value: boolean) => {
    setHighRes(value);
    await updateSettings({ highResolution: value });
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all items, categories, and reset settings. This cannot be undone.",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Clear All",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Success", "All data has been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
              console.error(error);
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
  const inputBgColor = isDark ? "#1F2937" : "#F3F4F6";
  const sectionBgColor = isDark ? "#1F2937" : "#F9FAFB";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{ paddingVertical: 12 }}
    >
      {/* Profile Section */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: secondaryTextColor,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Profile
        </Text>
        <View
          style={{
            backgroundColor: sectionBgColor,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: borderColor,
            padding: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: secondaryTextColor,
              marginBottom: 8,
            }}
          >
            Username
          </Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={secondaryTextColor}
            value={username}
            onChangeText={handleUsernameChange}
            style={{
              backgroundColor: inputBgColor,
              color: textColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          />
        </View>
      </View>

      {/* Display Settings */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: secondaryTextColor,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Display
        </Text>
        <View
          style={{
            backgroundColor: sectionBgColor,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: borderColor,
            padding: 12,
            gap: 12,
          }}
        >
          {/* Theme Selection */}
          <View>
            <Text
              style={{
                fontSize: 12,
                color: secondaryTextColor,
                marginBottom: 8,
              }}
            >
              Theme
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["light", "dark", "system"] as const).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption}
                  onPress={() => handleThemeChange(themeOption)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor:
                      theme === themeOption
                        ? "#3B82F6"
                        : isDark
                          ? "#374151"
                          : "#E5E7EB",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color:
                        theme === themeOption
                          ? "#FFFFFF"
                          : isDark
                            ? "#D1D5DB"
                            : "#374151",
                      fontWeight: theme === themeOption ? "600" : "500",
                      fontSize: 12,
                      textTransform: "capitalize",
                    }}
                  >
                    {themeOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Photo Settings */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: secondaryTextColor,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Photos
        </Text>
        <View
          style={{
            backgroundColor: sectionBgColor,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: borderColor,
            padding: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontSize: 14, fontWeight: "500", color: textColor }}>
                High Resolution
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: secondaryTextColor,
                  marginTop: 4,
                }}
              >
                Larger image files, better quality
              </Text>
            </View>
            <Switch
              value={highRes}
              onValueChange={handleHighResChange}
              trackColor={{ false: "#CCCCCC", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#EF4444",
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Danger Zone
        </Text>
        <TouchableOpacity
          onPress={handleClearData}
          style={{
            backgroundColor: "#FEE2E2",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#FCA5A5",
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="delete-forever"
            size={20}
            color="#DC2626"
            style={{ marginRight: 12 }}
          />
          <View>
            <Text
              style={{
                fontWeight: "600",
                color: "#DC2626",
              }}
            >
              Clear All Data
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#991B1B",
                marginTop: 2,
              }}
            >
              Delete all items, categories and settings
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: secondaryTextColor,
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          About
        </Text>
        <View
          style={{
            backgroundColor: sectionBgColor,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: borderColor,
            padding: 12,
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
            <Text style={{ color: secondaryTextColor }}>App Version</Text>
            <Text style={{ color: textColor, fontWeight: "600" }}>
              {APP_VERSION}
            </Text>
          </View>
          <Text
            style={{
              color: secondaryTextColor,
              fontSize: 12,
              lineHeight: 18,
            }}
          >
            QuickSnap Inventory helps you organize and find your items quickly with offline-first
            storage and QR code scanning.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
