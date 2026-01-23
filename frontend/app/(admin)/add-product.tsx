import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function AddProduct() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TextInput placeholder="Product Name" style={styles.input} />
      <TextInput placeholder="Price" keyboardType="numeric" style={styles.input} />

      <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
        <Text style={{ color: "#fff" }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#e76f51",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
