import { useInventory } from "@/context/InventoryContext";
import "@/global.css";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const { categories, addNewCategory, deleteCategoryData, updateCategoryData } =
    useInventory();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#374151" : "#E5E7EB";
  const inputBgColor = isDark ? "#1F2937" : "#F3F4F6";

  const colors = [
    "#EF4444", // red
    "#F97316", // orange
    "#EAB308", // yellow
    "#22C55E", // green
    "#06B6D4", // cyan
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#EC4899", // pink
  ];

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Tsy am place-ny !", "Please enter a category name");
      return;
    }

    try {
      await addNewCategory({
        name: newCategoryName,
        color: newCategoryColor,
      });
      setNewCategoryName("");
      setNewCategoryColor("#3B82F6");
    } catch (error) {
      Alert.alert("Tsy am place-ny !", "Tsy mety ny fampidirana");
      console.error(error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editName.trim()) {
      Alert.alert("Tsy am place-ny !", "Ino tsara karazanyy io ?");
      return;
    }

    try {
      await updateCategoryData(editingId!, {
        name: editName,
        color: editColor,
      });
      setEditingId(null);
      setEditName("");
      setEditColor("");
    } catch (error) {
      Alert.alert("Tsy am place-ny !", "Courage fa tena misy tsy mety ny fanovana");
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    Alert.alert(
      "Ataovy séreux !",
      `Tena sura ve anao hamafa "${name}" io?`,
      [
        { text: "Tsy tapakevitra indray", onPress: () => {}, style: "cancel" },
        {
          text: "Mazava oazy",
          onPress: async () => {
            try {
              await deleteCategoryData(id);
            } catch (error) {
              Alert.alert("Tsy am place-ny !", "Misy zavatra mi-coince");
              console.error(error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Add Category Form */}
      <View
        style={{
          backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: textColor,
            marginBottom: 12,
          }}
        >
          Fampidirana ny Karazany
        </Text>

        <TextInput
          placeholder="Anarany karazany"
          placeholderTextColor={secondaryTextColor}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          style={{
            backgroundColor: inputBgColor,
            color: textColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        />

        {/* Color Picker */}
        <Text
          style={{
            fontSize: 12,
            color: secondaryTextColor,
            marginBottom: 8,
          }}
        >
          Couleur nao couleurako :
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setNewCategoryColor(color)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: color,
                borderWidth: newCategoryColor === color ? 3 : 0,
                borderColor: "#FFFFFF",
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleAddCategory}
          style={{
            backgroundColor: "#3B82F6",
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Atsofoka ny Karazany
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) =>
          editingId === item.id ? (
            // Edit mode
            <View
              style={{
                backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <TextInput
                placeholder="Category name"
                placeholderTextColor={secondaryTextColor}
                value={editName}
                onChangeText={setEditName}
                style={{
                  backgroundColor: inputBgColor,
                  color: textColor,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              />

              {/* Color Picker */}
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setEditColor(color)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: color,
                      borderWidth: editColor === color ? 3 : 0,
                      borderColor: "#FFFFFF",
                    }}
                  />
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <TouchableOpacity
                  onPress={handleUpdateCategory}
                  style={{
                    flex: 1,
                    backgroundColor: "#10B981",
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    Zay
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditingId(null)}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? "#374151" : "#E5E7EB",
                    borderRadius: 8,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? "#D1D5DB" : "#374151",
                      fontWeight: "600",
                    }}
                  >
                    Tsy ovana indray
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // View mode
            <View
              style={{
                flexDirection: "row",
                backgroundColor: isDark ? "#1F2937" : "#F9FAFB",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: borderColor,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: item.color,
                    marginRight: 12,
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: textColor,
                  }}
                >
                  {item.name}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setEditingId(item.id);
                    setEditName(item.name);
                    setEditColor(item.color);
                  }}
                  style={{
                    padding: 8,
                  }}
                >
                  <MaterialIcons
                    name="edit"
                    size={20}
                    color="#3B82F6"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteCategory(item.id, item.name)
                  }
                  style={{
                    padding: 8,
                  }}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color="#EF4444"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 32,
            }}
          >
            <MaterialIcons
              name="category"
              size={48}
              color={secondaryTextColor}
              style={{ marginBottom: 16 }}
            />
            <Text
              style={{
                color: textColor,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Mbola tsisy raha paré
            </Text>
            <Text
              style={{
                color: secondaryTextColor,
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Create your first category to organize items
            </Text>
          </View>
        }
      />
    </View>
  );
}
