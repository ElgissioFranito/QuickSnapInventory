import { useInventory } from "@/context/InventoryContext";
import "@/global.css";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ScanResultModal() {
const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const qrCode = params.qrCode as string;
  const isUnknown = params.unknown === "true";

  const { categories } = useInventory();

  const [itemName, setItemName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || "");
  const [loading, setLoading] = useState(false);

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#374151" : "#E5E7EB";
  const inputBgColor = isDark ? "#1F2937" : "#F3F4F6";

  // Si on arrive avec des params pré-remplis (depuis un autre flux), on les utilise
  useEffect(() => {
    if (params.name) setItemName(params.name as string);
    if (params.categoryId) setSelectedCategoryId(params.categoryId as string);
  }, [params]);

const goToAddItem = () => {
    router.push({
      pathname: "/add-item-modal",
      params: {
        qrCode,
        name: itemName.trim() || undefined,
        categoryId: selectedCategoryId || undefined,
      },
    });
  };

  // const handleQuickCreate = async () => {
  //   if (!itemName.trim()) {
  //     Alert.alert("Tsy am place-ny !", "Veuillez entrer un nom pour l'article");
  //     return;
  //   }
  //   if (!selectedCategoryId) {
  //     Alert.alert("Tsy am place-ny !", "Veuillez sélectionner une catégorie");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // On crée directement l'item (mais SANS photo pour l'instant)
  //     await addNewItem({
  //       name: itemName.trim(),
  //       categoryId: selectedCategoryId,
  //       qrCode,
  //       photoUri: "",           // photo obligatoire → forcera l'utilisateur à l'ajouter après
  //       thumbnailUri: "",
  //       lastScannedAt: new Date().getTime(),
  //     });

  //     Alert.alert(
  //       "Normal !",
  //       "Article créé ! Ajoutez une photo pour finaliser.",
  //       [
  //         {
  //           text: "Ajouter une photo maintenant",
  //           onPress: () => {
  //             // Option : rediriger vers edit avec l'ID nouvellement créé
  //             // Mais pour simplifier → on retourne juste au scan ou à l'accueil
  //             router.back();
  //           },
  //         },
  //         { text: "Plus tard", style: "cancel", onPress: () => router.back() },
  //       ]
  //     );
  //   } catch (error) {
  //     Alert.alert("Tsy am place-ny !", "Échec de la création de l'article");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
    >
      {/* QR affiché en haut – toujours visible */}
      <View
        style={{
          alignItems: "center",
          backgroundColor: inputBgColor,
          borderRadius: 16,
          padding: 20,
          marginBottom: 28,
          borderWidth: 1,
          borderColor: borderColor,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: textColor,
            marginBottom: 12,
          }}
        >
          Code QR scanné
        </Text>
        <QRCode
          value={qrCode}
          size={140}
          color="#000000"
          backgroundColor="#FFFFFF"
        />
        <Text
          style={{
            fontSize: 11,
            color: secondaryTextColor,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          {qrCode}
        </Text>
      </View>

      {isUnknown ? (
        <>
          {/* Cas inconnu – proposition de création */}
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <MaterialIcons
              name="qr-code-scanner"
              size={56}
              color="#3B82F6"
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
              Entana vaovao
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: secondaryTextColor,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Tsy maintsy ampidirina ity baina fa tsy mbola fantatray 
            </Text>
          </View>

          {/* Formulaire rapide (pré-rempli si params) */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: secondaryTextColor, marginBottom: 8 }}>
              Ino anarany ino *
            </Text>
            <TextInput
              placeholder="Ex : Chaise bureau A-12"
              placeholderTextColor={secondaryTextColor}
              value={itemName}
              onChangeText={setItemName}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: borderColor,
                fontSize: 16,
              }}
              autoFocus
            />

            <Text style={{ fontSize: 14, fontWeight: "600", color: secondaryTextColor, marginBottom: 8 }}>
              ino karazany *
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor:
                      selectedCategoryId === cat.id ? cat.color : isDark ? "#374151" : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      color: selectedCategoryId === cat.id ? "#FFFFFF" : textColor,
                      fontWeight: selectedCategoryId === cat.id ? "700" : "500",
                      fontSize: 14,
                    }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Actions principales */}
          <TouchableOpacity
            onPress={goToAddItem}
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>
              Aleo asiana sary amizay bogoss tsara
            </Text>
          </TouchableOpacity>

    
        </>
      ) : (
        <>
          {/* Cas connu – feedback immédiat */}
          <View style={{ alignItems: "center", marginVertical: 40 }}>
            <MaterialIcons
              name="check-circle"
              size={80}
              color="#10B981"
              style={{ marginBottom: 24 }}
            />
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: textColor,
                marginBottom: 12,
              }}
            >
              Tsy haiko io !
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: secondaryTextColor,
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              San farany nandeha tsisy problème
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>
              Impody hanao scan
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Bouton fermer discret en bas */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginTop: 32,
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: secondaryTextColor, fontSize: 15, fontWeight: "500" }}>
          Impody
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}