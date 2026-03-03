import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* ---------- MOCK DATA ---------- */
const PRODUCTS = [
  {
    id: "1",
    name: "Burger",
    description: "Juicy beef burger with cheese",
    price: 8,
    available: true,
    image: require("../../assets/images/rb1.png"),
  },
  {
    id: "2",
    name: "Pizza",
    description: "Cheesy pepperoni pizza",
    price: 10,
    available: false,
    image: require("../../assets/images/rb2.png"),
  },
];

export default function Products() {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${item.price}</Text>

          <View
            style={[
              styles.status,
              {
                backgroundColor: item.available ? "#E8F7EE" : "#FDECEC",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.available ? "#2A9D8F" : "#E63946" },
              ]}
            >
              {item.available ? "Available" : "Out of stock"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.editBtn}>
        <Feather name="edit-2" size={18} color="#F4B400" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>

        <Text style={styles.title}>Products</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* ---------- LIST ---------- */}
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* ---------- ADD BUTTON ---------- */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/(admin)/add-product")}
      >
        <Feather name="plus" size={18} color="#FFF" />
        <Text style={styles.addText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  desc: {
    fontSize: 13,
    color: "#777",
    marginVertical: 6,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  editBtn: {
    padding: 6,
    justifyContent: "center",
  },

  addBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#F4B400",
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  addText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
});
