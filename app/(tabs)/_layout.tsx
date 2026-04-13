import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
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
          title: "Inventaire",
          tabBarLabel: "Mody",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          headerTitle: "Lisitry ny inventaire",
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarLabel: "Hanao Scan",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="qr-code-scanner" color={color} size={size} />
          ),
          headerTitle: "Manao Scan Code QR",
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Karazany",
          tabBarLabel: "Karazany",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
          headerTitle: "Ireao Karazany entana",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Safidiko",
          tabBarLabel: "Safidiko",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
          headerTitle: "Ireo safidiko",
        }}
      />
    </Tabs>
  );
}
