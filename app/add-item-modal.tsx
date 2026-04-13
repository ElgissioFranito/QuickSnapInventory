import { useInventory } from "@/context/InventoryContext";
import "@/global.css";
import { createThumbnail, saveImage } from "@/utils/imageUtils";
import { generateUniqueQRCode } from "@/utils/qrcode";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function AddItemModal() {
const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const itemId = params.id as string | undefined;

  // ───── Pré-remplissage depuis scan-result-modal ─────
  const prefillName = params.name as string | undefined;
  const prefillCategoryId = params.categoryId as string | undefined;
  const prefillQrCode = params.qrCode as string | undefined;

  const {
    categories,
    addNewItem,
    updateItemData,
    getItemById,
  } = useInventory();

  const existingItem = itemId ? getItemById(itemId) : null;

  const [name, setName] = useState(existingItem?.name || prefillName || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    existingItem?.categoryId || prefillCategoryId || (categories[0]?.id || "")
  );
  const [photoUri, setPhotoUri] = useState(existingItem?.photoUri || "");
  const [thumbnailUri, setThumbnailUri] = useState(existingItem?.thumbnailUri || "");
  const [qrCode, setQrCode] = useState(existingItem?.qrCode || prefillQrCode || "");
  const [loading, setLoading] = useState(false);

  // Génère un QR seulement si on n'en a pas reçu en paramètre
  useEffect(() => {
    if (!itemId && !qrCode && !prefillQrCode) {
      generateUniqueQRCode().then(setQrCode);
    }
  }, [itemId, qrCode, prefillQrCode]);

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#111827" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "#374151" : "#E5E7EB";
  const inputBgColor = isDark ? "#1F2937" : "#F3F4F6";
  // ────────────────────────────────────────────────
  //  Demande de permission + sélection photo
  // ────────────────────────────────────────────────
  const pickImage = async (useCamera = false) => {
    try {
      // Option 1 : Demander la permission explicitement (recommandé pour camera)
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Courage fa tsy nahazo alalana", "Mba omeo appareil photo mba hi-shoot ee");
          return;
        }
      }

      // Pour la galerie → permission souvent pas demandée explicitement (système gère)
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.75,
            base64: false,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
          });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await processPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Tsy am place-ny ! lors de la sélection de la photo :", error);
      Alert.alert("Tsy am place-ny !", "Tena tsy nety ny tantana");
    }
  };

  const processPhoto = async (uri: string) => {
    try {
      setLoading(true);
      const savedUri = await saveImage(uri);
      setPhotoUri(savedUri);

      const thumbnail = await createThumbnail(savedUri);
      setThumbnailUri(thumbnail);
    } catch (error) {
      Alert.alert("Tsy am place-ny !", "Tena tsy nety ny tantana");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Tsy am place-ny !", "Azovy tsara ny anarany ?");
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert("Tsy am place-ny !", "Tsy mazava amiko ny karazany");
      return;
    }
    if (!photoUri) {
      Alert.alert("Tsy am place-ny !", "Tsy azontsary lery");
      return;
    }

    try {
      setLoading(true);

      if (itemId) {
        await updateItemData(itemId, {
          name,
          categoryId: selectedCategoryId,
          photoUri,
          thumbnailUri,
        } as any);
      } else {
        await addNewItem({
          name,
          categoryId: selectedCategoryId,
          qrCode: qrCode || "",
          photoUri,
          thumbnailUri,
          lastScannedAt: null,
        });
      }

      Alert.alert("Normal !", "Arabaina fa mety tsara ny natao");
      router.back();
    } catch (error) {
      Alert.alert("Tsy am place-ny !", "Misy raha tsy normal");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
<ScrollView
      style={{ flex: 1, backgroundColor: bgColor }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Nom */}
      <Text style={{ fontSize: 14, fontWeight: "600", color: secondaryTextColor, marginBottom: 8, marginTop: 12 }}>
        Ino anarany ino *
      </Text>
      <TextInput
        placeholder="Eto anao mampiditra anarany"
        placeholderTextColor={secondaryTextColor}
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: inputBgColor,
          color: textColor,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: borderColor,
          fontSize: 16,
        }}
      />

      {/* Catégories (inchangé) */}
      <Text style={{ fontSize: 14, fontWeight: "600", color: secondaryTextColor, marginBottom: 8 }}>
        Ino karazany ino *
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategoryId(category.id)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
              marginRight: 8,
              backgroundColor:
                selectedCategoryId === category.id ? category.color : isDark ? "#374151" : "#E5E7EB",
            }}
          >
            <Text
              style={{
                color: selectedCategoryId === category.id ? "#FFFFFF" : isDark ? "#D1D5DB" : "#374151",
                fontWeight: selectedCategoryId === category.id ? "600" : "500",
              }}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section Photo – version simplifiée & moderne */}
      {photoUri ? (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: secondaryTextColor, marginBottom: 8 }}>
            Apetaho eto sariny
          </Text>
          <Image
            source={{ uri: photoUri }}
            style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 12, backgroundColor: inputBgColor }}
          />
          <TouchableOpacity
            onPress={() => {
              setPhotoUri("");
              setThumbnailUri("");
            }}
            style={{
              backgroundColor: "#EF4444",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Fafao fa tsy izy</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: secondaryTextColor, marginBottom: 12 }}>
            Apetaho eto sariny
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => pickImage(true)} // true = caméra
              style={{
                flex: 1,
                backgroundColor: inputBgColor,
                borderRadius: 12,
                paddingVertical: 24,
                alignItems: "center",
                borderWidth: 2,
                borderColor: borderColor,
                borderStyle: "dashed",
              }}
            >
              <MaterialIcons name="photo-camera" size={36} color="#3B82F6" style={{ marginBottom: 8 }} />
              <Text style={{ color: textColor, fontWeight: "600", fontSize: 15 }}>Itifitra </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickImage(false)} // false = galerie
              style={{
                flex: 1,
                backgroundColor: inputBgColor,
                borderRadius: 12,
                paddingVertical: 24,
                alignItems: "center",
                borderWidth: 2,
                borderColor: borderColor,
                borderStyle: "dashed",
              }}
            >
              <MaterialIcons name="photo-library" size={36} color="#3B82F6" style={{ marginBottom: 8 }} />
              <Text style={{ color: textColor, fontWeight: "600", fontSize: 15 }}>Hifidy</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* QR Code (inchangé) */}
{/* QR Code – toujours affiché si on en a un */}
      {qrCode && (
        <View 
          style={{
            backgroundColor: inputBgColor,
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            marginBottom: 24,
            borderWidth: 1,
            borderColor: borderColor,
          }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: secondaryTextColor, marginBottom: 12 }}>
            Code QR
          </Text>
          <QRCode value={qrCode} size={150} color="#000000" backgroundColor="#FFFFFF" />
          <Text style={{ fontSize: 10, color: secondaryTextColor, marginTop: 12, textAlign: "center" }}>
            {qrCode}
          </Text>
        </View>
      )}

      {/* Bouton Enregistrer */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#9CA3AF" : "#3B82F6",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {loading ? <ActivityIndicator color="#FFFFFF" /> : (
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            {itemId ? "Ovaina an'io" : "Atsofoka amizay"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Annuler */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          backgroundColor: isDark ? "#374151" : "#E5E7EB",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: isDark ? "#D1D5DB" : "#374151", fontWeight: "600", fontSize: 16 }}>
          Tsy tapakevitra aho
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}