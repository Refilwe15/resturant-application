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
import MapView, { Marker } from "react-native-maps";

export default function HomeScreen() {
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
        <TextInput placeholder="Search food here" style={styles.searchInput} />
      </View>

      {/* Promo */}
      <View style={styles.promo}>
        <View>
          <Text style={styles.promoTitle}>Taste Rally</Text>
          <Text style={styles.promoText}>Burgers Worth Cheering{"\n"}For</Text>

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

      {/* Mostly Ordered */}
      <Text style={styles.sectionTitle}>Mostly Ordered</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {FOODS.map((item) => (
          <View key={item.id} style={styles.foodCard}>
            <Image source={item.image} style={styles.foodImage} />

            {/* PLUS BUTTON */}
            <TouchableOpacity style={styles.addBtn}>
              <Feather name="plus" size={18} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodDesc}>{item.desc}</Text>
            <Text style={styles.foodPrice}>{item.price}</Text>
          </View>
        ))}
      </ScrollView>

      {/* MAP */}
      <Text style={styles.sectionTitle2}>Available Shops For Delivery</Text>
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -26.2041,
            longitude: 28.0473,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {STORES.map((store) => (
            <Marker
              key={store.id}
              coordinate={store.location}
              title={store.name}
            />
          ))}
        </MapView>
      </View>
    </ScrollView>
  );
}

/* ---------------- DATA ---------------- */

const FOODS = [
  {
    id: "1",
    name: "Classic Burger",
    desc: "Juicy beef patty with cheese & sauce",
    price: "R89.99",
    image: require("../../assets/images/rb2.png"),
  },
  {
    id: "2",
    name: "Double Hamburger",
    desc: "Double beef, extra cheese",
    price: "R180.99",
    image: require("../../assets/images/rb1.png"),
  },
  {
    id: "3",
    name: "Oreo Sundae",
    desc: "Vanilla ice cream with Oreo crumbs",
    price: "R21.99",
    image: require("../../assets/images/oreo.png"),
  },
];

const STORES = [
  {
    id: "1",
    name: "Rally’s Sandton",
    location: { latitude: -26.1076, longitude: 28.0567 },
  },
  {
    id: "2",
    name: "Rally’s Rosebank",
    location: { latitude: -26.1466, longitude: 28.0421 },
  },
  {
    id: "3",
    name: "Rally’s Braamfontein",
    location: { latitude: -26.1929, longitude: 28.0305 },
  },
];

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 55,
  },

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
  },

  promo: {
    flexDirection: "row",
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  promoTitle: { fontSize: 20, fontWeight: "700" },
  promoText: { color: "#999", marginVertical: 6 },
  orderBtn: {
    backgroundColor: "#F4B400",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 16,
    width: 110,
  },
  orderText: { color: "#FFF", fontWeight: "600" },
  mascot: { width: 150, height: 150 },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 16,
  },
  sectionTitle2: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },

  foodCard: {
    width: 160,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#F4B400",
  },
  foodImage: {
    width: "100%",
    height: 90,
    borderRadius: 12,
  },
  addBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#F4B400",
    borderRadius: 16,
    padding: 6,
  },
  foodName: {
    fontWeight: "700",
    marginTop: 8,
  },
  foodDesc: {
    fontSize: 12,
    color: "#777",
  },
  foodPrice: {
    color: "#F4B400",
    fontWeight: "700",
    marginTop: 4,
  },

  mapWrapper: {
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 30,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
