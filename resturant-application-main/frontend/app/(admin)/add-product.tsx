import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function AddProduct() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  /* -------- PICK IMAGE -------- */
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission required to access images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Product</Text>
      </View>

      {/* ---------- IMAGE PICKER ---------- */}
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <>
            <Feather name="camera" size={26} color="#999" />
            <Text style={styles.imageText}>Add product image</Text>
          </>
        )}
      </TouchableOpacity>

      {/* ---------- INPUTS ---------- */}
      <TextInput
        placeholder="Product name"
        placeholderTextColor="#999"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor="#999"
        style={[styles.input, styles.textArea]}
        multiline
        value={desc}
        onChangeText={setDesc}
      />

      <TextInput
        placeholder="Price (e.g. 99.99)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />

      {/* ---------- SAVE BUTTON ---------- */}
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          // frontend only for now
          router.back();
        }}
      >
        <Text style={styles.saveText}>Save Product</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
    color: "#222",
  },

  imageBox: {
    height: 180,
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  imageText: {
    marginTop: 8,
    color: "#999",
    fontSize: 13,
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    marginBottom: 16,
    color: "#222",             
    
  },

  textArea: {
    height: 90,
    textAlignVertical: "top",
  },

  saveBtn: {
    backgroundColor: "#F4B400",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
