import { InventoryProvider } from "@/context/InventoryContext";
import "@/global.css";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <InventoryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Item Detail Modal */}
        <Stack.Screen
          name="item-detail-modal"
          options={{
            title: "Momba ny entana",
            presentation: "modal",
            headerShown: true,
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
            },
            headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
        {/* Add/Edit Item Modal */}
        <Stack.Screen
          name="add-item-modal"
          options={{
            title: "Manatsofoka entana",
            presentation: "modal",
            headerShown: true,
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
            },
            headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
        {/* Scan Result Modal */}
        <Stack.Screen
          name="scan-result-modal"
          options={{
            title: "Valiny analyse",
            presentation: "modal",
            headerShown: true,
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#1F2937" : "#FFFFFF",
            },
            headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
      </Stack>
    </InventoryProvider>
  );
}
