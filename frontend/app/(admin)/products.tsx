import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const PRODUCTS = [
  { id: "1", name: "Burger", price: 8 },
  { id: "2", name: "Pizza", price: 10 },
];

export default function Products() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - ${item.price}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/(admin)/add-product")}>
        <Text style={{ color: "#fff" }}>+ Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  item: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 10,
  },
  addBtn: {
    backgroundColor: "#2a9d8f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
});
