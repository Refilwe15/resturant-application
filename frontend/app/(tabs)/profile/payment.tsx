import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function PaymentScreen() {
  const [cardDetails, setCardDetails] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) return;
      setCardDetails(JSON.parse(user).cardDetails || "");
    };
    load();
  }, []);

  const saveCard = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch("http://10.0.0.113:8000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cardDetails }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert("Error", "Failed to update card");
      return;
    }

    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    Alert.alert("Success", "Payment method updated");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      <TextInput
        placeholder="Card Number"
        style={styles.input}
        value={cardDetails}
        onChangeText={setCardDetails}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveCard}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: "#D9A441",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  saveText: { color: "#FFF", fontWeight: "700" },
});
