import { useInventory } from "@/context/InventoryContext";
import "@/global.css";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Appearance,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";


const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const { settings, updateSettings, clearAllData } = useInventory();
  const [username, setUsername] = useState(settings.username);
  const [preferredTheme, setPreferredTheme] = useState(settings.theme); // "light" | "dark" |
  const [theme, setTheme] = useState(settings.theme);
  const [highRes, setHighRes] = useState(settings.highResolution);

  // Déterminer le thème EFFECTIF (celui qui est vraiment appliqué)
  const effectiveTheme = 
    preferredTheme === "system" 
      ? systemColorScheme 
      : preferredTheme;

  useFocusEffect(
    useCallback(() => {
      setUsername(settings.username);
      setTheme(settings.theme);
      setHighRes(settings.highResolution);
    }, [settings])
  );

  // Appliquer immédiatement le thème quand preferredTheme change
  useEffect(() => {
    if (preferredTheme === "system") {
      Appearance.setColorScheme(null); // ← revient au système
    } else {
      Appearance.setColorScheme(preferredTheme); // "light" ou "dark"
    }
  }, [preferredTheme]);

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    await updateSettings({ username: value });
  };

const handleThemeChange = async (value: "light" | "dark" | "system") => {
    setPreferredTheme(value);
    await updateSettings({ theme: value });
    // L'update visuel est maintenant immédiat grâce à Appearance + useEffect
  };

  const handleHighResChange = async (value: boolean) => {
    setHighRes(value);
    await updateSettings({ highResolution: value });
  };

  const handleClearData = () => {
    Alert.alert(
      "Départ à zéro",
      "Izany dia hamafa tanteraka ny singa rehetra, ny sokajy ary ny famerenan'ny fanovana. Tsy azo averina izany.",
      [
        { text: "Tsy tapakevitra indray", onPress: () => { }, style: "cancel" },
        {
          text: "Mazava oazy",
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert("Vita aa", "Foafafa ny retraretra");
            } catch (error) {
              Alert.alert("Tsy am place-ny", "Zahay koa efa tsy nahefa");
              console.error(error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const isDark = effectiveTheme === "dark";
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
          Momba anao
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
            Anarana nomen'i babanao
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
{/* Display Settings – amélioré */}
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
          FOmba fisehony
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
              Loko
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
                    {themeOption === "light"
                      ? "Mazava"
                      : themeOption === "dark"
                        ? "Maizina"
                        : "Zay atanao"}
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
          Sary
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
                Ampiakarina  ny atsaran'ny sary
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: secondaryTextColor,
                  marginTop: 4,
                }}
              >
                izay ambony no tsara fa mandany mémoire
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
          Tandremo lesy zany
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
              Départ à zéro
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#991B1B",
                marginTop: 2,
              }}
            >
              Fafao ny safidiko, ny entako sy ny karazany
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
          Mombanahy
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
            <Text style={{ color: secondaryTextColor }}>Application version</Text>
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
            Ity application ity dia manampy anao handamina sy hahita haingana ny entanao hors-ligne ny
            fitehirizana ary scan QR code.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
