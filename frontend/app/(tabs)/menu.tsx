import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

const categories = ["Burgers", "Sides", "Desserts", "Drinks"];

const burgers = [
  {
    id: "1",
    name: "Classic Burger",
    desc: "Juicy beef patty topped with cheese and mayo sauce.",
    price: "R189.99",
    image: require("../../assets/images/rb2.png"),
  },
  {
    id: "2",
    name: "Spicy Chicken Burger",
    desc: "Juicy chicken patty topped with cheese and mayo sauce.",
    price: "R110.99",
    image: require("../../assets/images/rb1.png"),
  },
  {
    id: "3",
    name: "Gourmet Black Bun Burger",
    desc: "Juicy beef patty topped with cheese and mayo sauce.",
    price: "R120.99",
    image: require("../../assets/images/rb3.png"),
  },
  {
    id: "4",
    name: "Beef Burger",
    desc: "Juicy beef patty topped with cheese and mayo sauce.",
    price: "R210.99",
    image: require("../../assets/images/rb4.png"),
  },
];

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState("Burgers");

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.desc}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>{item.price}</Text>

        <TouchableOpacity style={styles.addBtn}>
          <Feather name="plus" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.greeting}>Hi, Refilwe</Text>
      <Text style={styles.title}>Find your favourite food</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search food here"
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveCategory(item)}
            style={styles.categoryItem}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === item && styles.activeCategory,
              ]}
            >
              {item}
            </Text>
            {activeCategory === item && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Burgers Grid */}
      <FlatList
        data={burgers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* View Cart */}
      <TouchableOpacity style={styles.cartBtn}>
        <Text style={styles.cartText}>View Cart</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 80,
  },

  greeting: {
    fontSize: 14,
    color: "#999",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
  },
  categoryText: {
    fontSize: 14,
    color: "#999",
  },
  activeCategory: {
    color: "#222",
    fontWeight: "700",
  },
  activeLine: {
    width: 22,
    height: 3,
    backgroundColor: "#F4B400",
    borderRadius: 2,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFF",
    width: "48%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 14,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    color: "#222",
  },
  desc: {
    fontSize: 11,
    color: "#777",
    marginVertical: 6,
    lineHeight: 15,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },
  addBtn: {
    backgroundColor: "#F4B400",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  cartBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#D9A441",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  cartText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
