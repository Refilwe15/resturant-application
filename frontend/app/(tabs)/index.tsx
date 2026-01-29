import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from "react-native";
import { Feather, MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* CHANGE TO YOUR LAPTOP IP */
const BASE_URL = "http://10.0.0.113:8000";
const FOOD_ENDPOINT = `${BASE_URL}/api/foods`;

/* -------------------- EXTRAS ---------------- */
const extrasData = [
  { id: "e1", name: "Extra Cheese", price: 10 },
  { id: "e2", name: "Add Bacon", price: 15 },
  { id: "e3", name: "Spicy Sauce", price: 5 },
];

export default function HomeScreen() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const { addToCart, cart } = useCart();

  // Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [extras, setExtras] = useState<any[]>([]);

  useEffect(() => {
    fetchFoods();
    loadUser();
  }, []);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "User");
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await fetch(FOOD_ENDPOINT);
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      console.error("Failed to fetch foods", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Modal handlers --------------------
  const openModal = (item: any) => {
    setSelectedItem(item);
    setQty(1);
    setNotes("");
    setExtras([]);
  };

  const toggleExtra = (extra: any) => {
    setExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const basePrice = selectedItem ? selectedItem.price : 0;
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = ((basePrice + extrasTotal) * qty).toFixed(2);

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart({
      id: `${selectedItem.id}-${Date.now()}`,
      name: selectedItem.name,
      price: Number(totalPrice),
      image: selectedItem.image,
      qty,
      extras,
      notes,
    });
    setSelectedItem(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Feather name="bell" size={22} color="#333" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search delicious food..."
          style={styles.searchInput}
          onFocus={() => router.push("/(tabs)/menu")}
        />
      </View>

      {/* Promotional Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <Text style={styles.promoTag}>Special Offer</Text>
          <Text style={styles.promoTitle}>
            Get 20% OFF{"\n"}on your first order
          </Text>
          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() => router.push("/(tabs)/menu")}
          >
            <Text style={styles.promoBtnText}>Order Now</Text>
            <Feather name="arrow-right" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.promoImageWrapper}>
          <Image
            source={require("../../assets/images/chef.png")}
            style={styles.promoImage}
          />
        </View>
      </View>

      {/* Quick Actions */}
<View style={styles.quickActions}>
  <TouchableOpacity
    style={styles.actionCard}
    onPress={() => router.push("/(tabs)/menu")}
  >
    <View style={styles.actionIcon}>
      <Ionicons name="restaurant-outline" size={26} color="#F4B400" />
    </View>
    <Text style={styles.actionLabel}>Browse Menu</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.actionCard}>
    <View style={styles.actionIcon}>
      <Ionicons name="gift-outline" size={26} color="#FF6B6B" />
    </View>
    <Text style={styles.actionLabel}>Rewards</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.actionCard}>
    <View style={styles.actionIcon}>
      <Ionicons name="heart-outline" size={26} color="#FF6B6B" />
    </View>
    <Text style={styles.actionLabel}>Favorites</Text>
  </TouchableOpacity>
</View>


      {/* Most Popular Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Most Popular</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/menu")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F4B400" />
        </View>
      ) : foods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="restaurant" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No items available</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.foodScroll}
        >
          {foods.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.foodCard}
              onPress={() => openModal(item)}
            >
              <View style={styles.foodImageWrapper}>
                <Image
                  source={{ uri: `${BASE_URL}${item.image}` }}
                  style={styles.foodImage}
                />
                <View style={styles.foodBadge}>
                  <AntDesign name="star" size={14} color="#F4B400" />
                  <Text style={styles.foodRating}>4.5</Text>
                </View>
              </View>

              <View style={styles.foodInfo}>
                <Text style={styles.foodName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.foodDesc} numberOfLines={1}>
                  {item.description}
                </Text>
                <View style={styles.foodFooter}>
                  <Text style={styles.foodPrice}>R{item.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => openModal(item)}
                  >
                    <Feather name="plus" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Delivery Shops Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Shops</Text>
      </View>

      {/* MAP */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -26.2041,
            longitude: 28.0473,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {STORES.map((store) => (
            <Marker
              key={store.id}
              coordinate={store.location}
              title={store.name}
              description="Tap to get directions"
            />
          ))}
        </MapView>
      </View>

      {/* Stores List */}
      <View style={styles.storesList}>
        {STORES.map((store) => (
          <View key={store.id} style={styles.storeCard}>
            <View style={styles.storeIcon}>
              <Feather name="map-pin" size={20} color="#F4B400" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeDistance}>0.8 km away</Text>
            </View>
            <TouchableOpacity style={styles.storeBtn}>
              <Text style={styles.storeBtnText}>Directions</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Item Detail Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <ScrollView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedItem(null)}
                >
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>

                {/* Image */}
                <Image
                  source={{ uri: `${BASE_URL}${selectedItem.image}` }}
                  style={styles.modalImage}
                />

                {/* Info */}
                <View style={styles.modalInfo}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                    <Text style={styles.modalDesc}>
                      {selectedItem.description}
                    </Text>
                    <View style={styles.modalRating}>
                      <AntDesign name="star" size={16} color="#F4B400" />
                      <Text style={styles.rating}>4.5 (120 reviews)</Text>
                    </View>
                  </View>
                  <Text style={styles.modalPrice}>
                    R{selectedItem.price.toFixed(2)}
                  </Text>
                </View>

                {/* Quantity */}
                <Text style={styles.modalSectionLabel}>Quantity</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => qty > 1 && setQty(qty - 1)}
                  >
                    <Feather name="minus" size={18} />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQty(qty + 1)}
                  >
                    <Feather name="plus" size={18} />
                  </TouchableOpacity>
                </View>

                {/* Extras */}
                <Text style={styles.modalSectionLabel}>Add Extras</Text>
                <View style={styles.extrasBox}>
                  {extrasData.map((extra) => (
                    <TouchableOpacity
                      key={extra.id}
                      style={[
                        styles.extraRow,
                        extras.find((e) => e.id === extra.id) &&
                          styles.extraRowSelected,
                      ]}
                      onPress={() => toggleExtra(extra)}
                    >
                      <Feather
                        name={
                          extras.find((e) => e.id === extra.id)
                            ? "check-circle"
                            : "circle"
                        }
                        size={18}
                        color={
                          extras.find((e) => e.id === extra.id)
                            ? "#F4B400"
                            : "#CCC"
                        }
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.extraText}>{extra.name}</Text>
                      </View>
                      <Text style={styles.extraPrice}>+R{extra.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Notes */}
                <Text style={styles.modalSectionLabel}>Special Instructions</Text>
                <TextInput
                  placeholder="Any special requests?"
                  style={styles.notes}
                  value={notes}
                  onChangeText={setNotes}
                  placeholderTextColor="#999"
                  multiline
                />

                {/* Add to Cart */}
                <TouchableOpacity
                  style={styles.addCartBtn}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.addCartText}>
                    Add to Cart • R{totalPrice}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

/* ---------------- STORES ---------------- */

const STORES = [
  { id: "1", name: "Rally’s Sandton", location: { latitude: -26.1076, longitude: 28.0567 } },
  { id: "2", name: "Rally’s Rosebank", location: { latitude: -26.1466, longitude: 28.0421 } },
  { id: "3", name: "Rally’s Braamfontein", location: { latitude: -26.1929, longitude: 28.0305 } },
];

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  greeting: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    marginTop: 2,
  },

  notificationIcon: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B6B",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  promoBanner: {
    flexDirection: "row",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, 
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },

  promoContent: {
    flex: 1,
  },

  promoTag: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(0,0,0,0.6)",
  },

  promoTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    marginVertical: 8,
    lineHeight: 24,
  },

  promoBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 12,
  },

  promoBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },

  promoImageWrapper: {
    width: 120,
    height: 120,
  },

  promoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },

  actionCard: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  actionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },

  viewAll: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F4B400",
  },

  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
  },

  foodScroll: {
    marginBottom: 24,
  },

  foodCard: {
    width: 160,
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  foodImageWrapper: {
    position: "relative",
  },

  foodImage: {
    width: "100%",
    height: 110,
  },

  foodBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  foodRating: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F4B400",
  },

  foodInfo: {
    padding: 10,
  },

  foodName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },

  foodDesc: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },

  foodFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  foodPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#F4B400",
  },

  addBtn: {
    backgroundColor: "#F4B400",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  mapWrapper: {
    height: 200,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  storesList: {
    marginBottom: 30,
  },

  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  storeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF7E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  storeName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },

  storeDistance: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },

  storeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F4B400",
    borderRadius: 6,
  },

  storeBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },

  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 40,
    minHeight: "100%",
  },

  modalCloseBtn: {
    alignSelf: "flex-end",
    padding: 12,
    marginTop: 8,
  },

  modalImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 16,
  },

  modalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    maxWidth: "80%",
  },

  modalDesc: {
    fontSize: 13,
    color: "#777",
    marginVertical: 8,
    lineHeight: 18,
    maxWidth: "90%",
  },

  modalRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },

  rating: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },

  modalPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4B400",
  },

  modalSectionLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginTop: 20,
    marginBottom: 12,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingVertical: 10,
  },

  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  qty: {
    marginHorizontal: 24,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  extrasBox: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 12,
  },

  extraRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },

  extraRowSelected: {
    backgroundColor: "#FFF7E0",
    marginHorizontal: -12,
    paddingHorizontal: 12,
    marginVertical: -12,
    paddingVertical: 12,
  },

  extraText: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
  },

  extraPrice: {
    fontSize: 13,
    color: "#F4B400",
    fontWeight: "700",
  },

  notes: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 80,
    textAlignVertical: "top",
  },

  addCartBtn: {
    backgroundColor: "#F4B400",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },

  addCartText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
  },
});
