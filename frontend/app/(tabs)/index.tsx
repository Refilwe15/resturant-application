import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

const categories = ["Burgers", "Sides", "Desserts", "Drinks"];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Burgers");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Feather name="menu" size={22} />
        <Text style={styles.headerTitle}>Rally’s Burger</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search food here"
          style={styles.searchInput}
        />
      </View>

      {/* Promo */}
      <View style={styles.promo}>
        <View>
          <Text style={styles.promoTitle}>Taste Rally</Text>
          <Text style={styles.promoText}>
            Burgers Worth Cheering{"\n"}For
          </Text>

          {/* ORDER NOW → MENU TAB */}
          <TouchableOpacity
            style={styles.orderBtn}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Text style={styles.orderText}>Order Now</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require("../../assets/images/chef.png")}
          style={styles.mascot}
        />
      </View>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
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
                activeCategory === item && styles.categoryActiveText,
              ]}
            >
              {item}
            </Text>

            {activeCategory === item && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Mostly Ordered */}
      <Text style={styles.sectionTitle}>Mostly Ordered</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.foodCard}>
          <Image
            source={require("../../assets/images/rb2.png")}
            style={styles.foodImage}
          />
          <Text style={styles.foodName}>Classic Burger</Text>
          <Text style={styles.foodDesc}>
            Juicy beef patty with cheese & sauce
          </Text>
          <Text style={styles.foodPrice}>R89.99</Text>
        </View>

        <View style={styles.foodCard}>
          <Image
            source={require("../../assets/images/rb1.png")}
            style={styles.foodImage}
          />
          <Text style={styles.foodName}>Double Hamburger</Text>
          <Text style={styles.foodDesc}>
            Double beef, extra cheese, special sauce
          </Text>
          <Text style={styles.foodPrice}>R180.99</Text>
        </View>

        <View style={styles.foodCard}>
          <Image
            source={require("../../assets/images/oreo.png")}
            style={styles.foodImage}
          />
          <Text style={styles.foodName}>Oreo Sundae</Text>
          <Text style={styles.foodDesc}>
            Vanilla ice cream with Oreo crumbs
          </Text>
          <Text style={styles.foodPrice}>R21.99</Text>
        </View>
      </ScrollView>

      {/* Shops */}
      <Text style={styles.sectionTitle2}>Available Shops For Delivery</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((_, i) => (
          <View key={i} style={styles.shopCard}>
            <Text style={styles.shopText}>Rally’s Burger</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 55,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  /* Search Box */
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  /* Promo Section */
  promo: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  promoTitle: {
  
     fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  promoText: {
   fontSize: 16,
    color: "#999",
    marginVertical: 6,
    lineHeight: 26,
  },
  orderBtn: {
    backgroundColor: "#F4B400",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 16,
    width : 110
  },
  orderText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  mascot: {
    width: 150,
    height: 150,

  },

  /* Section Titles */
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },
  sectionTitle2: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginTop: 24,
    marginBottom: 12,
  },

  /* Categories */
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: "center",
  },
  categoryText: {
    fontSize: 14,
    color: "#999",
  },
  categoryActiveText: {
    color: "#222",
    fontWeight: "700",
  },
  activeLine: {
    width: 24,
    height: 3,
    backgroundColor: "#F4B400",
    borderRadius: 2,
    marginTop: 6,
  },

  /* Food Cards */
  foodCard: {
    width: 160,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#F4B400",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  foodImage: {
    width: "100%",
    height: 90,
    borderRadius: 12,
  },
  foodName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#222",
    marginTop: 8,
  },
  foodDesc: {
    fontSize: 12,
    color: "#777",
    marginVertical: 4,
    lineHeight: 16,
  },
  foodPrice: {
    color: "#F4B400",
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
  },

  /* Shops */
  shopCard: {
    backgroundColor: "#FFF4D6",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  shopText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#222",
  },
});

