import "@/global.css";
import { InventoryProvider } from "@/context/InventoryContext";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <InventoryProvider>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: colorScheme === "dark" ? "#3B82F6" : "#2563EB",
          tabBarInactiveTintColor: colorScheme === "dark" ? "#6B7280" : "#9CA3AF",
          tabBarStyle: {
            backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
            borderTopColor: colorScheme === "dark" ? "#374151" : "#E5E7EB",
          },
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
          },
          headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inventory",
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
            headerTitle: "QuickSnap Inventory",
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: "Scan",
            tabBarLabel: "Scan",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="qr-code-scanner" color={color} size={size} />
            ),
            headerTitle: "Scan QR Code",
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            tabBarLabel: "Categories",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="category" color={color} size={size} />
            ),
            headerTitle: "Manage Categories",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" color={color} size={size} />
            ),
            headerTitle: "Settings",
          }}
        />
      </Tabs>
    </InventoryProvider>
  );
}
