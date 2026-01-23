import { View, Text, FlatList, StyleSheet } from "react-native";

const ORDERS = [
  { id: "101", status: "Pending", total: 25 },
  { id: "102", status: "Delivered", total: 40 },
];

export default function Orders() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>

      <FlatList
        data={ORDERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Order #{item.id}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: ${item.total}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  card: {
    padding: 15,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginTop: 10,
  },
});
