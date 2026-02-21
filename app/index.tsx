import "@/global.css";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native";
import { useInventory } from "@/context/InventoryContext";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { items, categories, loading } = useInventory();
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "category">("date");

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "category") {
      filtered.sort((a, b) => a.categoryId.localeCompare(b.categoryId));
    }

    return filtered;
  }, [items, searchText, sortBy]);

  const getCategoryName = (categoryId: string) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.name || "Uncategorized"
    );
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.color || "#9CA3AF";
  };

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#374151" : "#E5E7EB";
  const inputBgColor = isDark ? "#1F2937" : "#F3F4F6";

  if (loading) {
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
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Search Bar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          backgroundColor: bgColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: inputBgColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <MaterialIcons name="search" size={20} color={secondaryTextColor} />
          <TextInput
            placeholder="Search items..."
            placeholderTextColor={secondaryTextColor}
            value={searchText}
            onChangeText={setSearchText}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 8,
              fontSize: 16,
              color: textColor,
            }}
          />
        </View>

        {/* Sort Options */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
            gap: 8,
          }}
        >
          {(["name", "date", "category"] as const).map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSortBy(option)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor:
                  sortBy === option
                    ? "#3B82F6"
                    : isDark
                      ? "#374151"
                      : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  color:
                    sortBy === option
                      ? "#FFFFFF"
                      : isDark
                        ? "#D1D5DB"
                        : "#374151",
                  fontSize: 12,
                  fontWeight: sortBy === option ? "600" : "500",
                }}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Items List */}
      {filteredAndSortedItems.length > 0 ? (
        <FlatList
          data={filteredAndSortedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/item/${item.id}`)}
              style={{
                flexDirection: "row",
                backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              {/* Thumbnail */}
              {item.thumbnailUri && (
                <Image
                  source={{ uri: item.thumbnailUri }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
                />
              )}

              {/* Item Info */}
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: textColor,
                      marginBottom: 4,
                    }}
                  >
                    {item.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: getCategoryColor(item.categoryId),
                        marginRight: 6,
                      }}
                    />
                    <Text style={{ color: secondaryTextColor, fontSize: 12 }}>
                      {getCategoryName(item.categoryId)}
                    </Text>
                  </View>
                </View>

                {/* Scan Status */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name={
                      item.lastScannedAt ? "check-circle" : "radio-button-unchecked"
                    }
                    size={14}
                    color={
                      item.lastScannedAt ? "#10B981" : secondaryTextColor
                    }
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      color: secondaryTextColor,
                      marginLeft: 4,
                    }}
                  >
                    {item.lastScannedAt
                      ? `Scanned ${new Date(item.lastScannedAt).toLocaleDateString()}`
                      : "Not scanned"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <MaterialIcons
            name="inbox"
            size={48}
            color={secondaryTextColor}
            style={{ marginBottom: 16 }}
          />
          <Text style={{ color: textColor, fontSize: 18, fontWeight: "600" }}>
            No items yet
          </Text>
          <Text
            style={{
              color: secondaryTextColor,
              fontSize: 14,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Create your first inventory item to get started
          </Text>
        </View>
      )}

      {/* Add Item Button */}
      <TouchableOpacity
        onPress={() => router.push("/add-item")}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#3B82F6",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
