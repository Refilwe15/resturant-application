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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useCart } from "../../context/CartContext";

/* CHANGE TO YOUR LAPTOP IP */
const BASE_URL = "http://10.196.0.142:8000";
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
  const { addToCart } = useCart(); // Cart hook

  // Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [extras, setExtras] = useState<any[]>([]);

  useEffect(() => {
    fetchFoods();
  }, []);

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
          <Text style={styles.promoText}>
            Burgers Worth Cheering{"\n"}For
          </Text>

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

      {loading ? (
        <ActivityIndicator size="large" color="#F4B400" />
      ) : foods.length === 0 ? (
        <Text style={{ color: "#999" }}>No food available</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {foods.map((item) => (
            <View key={item.id} style={styles.foodCard}>
              <Image
                source={{ uri: `${BASE_URL}${item.image}` }}
                style={styles.foodImage}
              />

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => openModal(item)} // open modal like Menu
              >
                <Feather name="plus" size={18} color="#FFF" />
              </TouchableOpacity>

              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDesc}>{item.description}</Text>
              <Text style={styles.foodPrice}>R{item.price}</Text>
            </View>
          ))}
        </ScrollView>
      )}

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

      {/* Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image
                  source={{ uri: `${BASE_URL}${selectedItem.image}` }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDesc}>{selectedItem.description}</Text>

                {/* Quantity */}
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
                {extrasData.map((extra) => (
                  <TouchableOpacity
                    key={extra.id}
                    style={styles.extraRow}
                    onPress={() => toggleExtra(extra)}
                  >
                    <Feather
                      name={extras.find((e) => e.id === extra.id) ? "check-circle" : "circle"}
                      size={18}
                      color="#F4B400"
                    />
                    <Text style={styles.extraText}>{extra.name}</Text>
                    <Text>R{extra.price}</Text>
                  </TouchableOpacity>
                ))}

                {/* Notes */}
                <TextInput
                  placeholder="Add notes..."
                  style={styles.notes}
                  value={notes}
                  onChangeText={setNotes}
                />

                {/* Add to Cart */}
                <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
                  <Text style={styles.addCartText}>
                    Add to Cart • R{totalPrice}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedItem(null)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
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
  container: { flex: 1, backgroundColor: "#FFF", paddingHorizontal: 16, paddingTop: 55 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 24 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14 },
  promo: { flexDirection: "row", borderRadius: 18, padding: 18, marginBottom: 24, justifyContent: "space-between", alignItems: "center" },
  promoTitle: { fontSize: 20, fontWeight: "700" },
  promoText: { color: "#999", marginVertical: 6 },
  orderBtn: { backgroundColor: "#F4B400", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, marginTop: 16, width: 110 },
  orderText: { color: "#FFF", fontWeight: "600" },
  mascot: { width: 150, height: 150 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 16 },
  sectionTitle2: { fontSize: 17, fontWeight: "700", marginTop: 24, marginBottom: 12 },
  foodCard: { width: 160, backgroundColor: "#FFF", borderRadius: 16, padding: 12, marginRight: 16, borderWidth: 1, borderColor: "#F4B400" },
  foodImage: { width: "100%", height: 90, borderRadius: 12 },
  addBtn: { position: "absolute", right: 10, top: 10, backgroundColor: "#F4B400", borderRadius: 16, padding: 6 },
  foodName: { fontWeight: "700", marginTop: 8 },
  foodDesc: { fontSize: 12, color: "#777" },
  foodPrice: { color: "#F4B400", fontWeight: "700", marginTop: 4 },
  mapWrapper: { height: 220, borderRadius: 18, overflow: "hidden", marginBottom: 30 },
  map: { width: "100%", height: "100%" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalImage: { width: 200, height: 180, borderRadius: 16, marginBottom: 12, marginLeft: 80 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  modalDesc: { fontSize: 13, color: "#777", marginVertical: 10, lineHeight: 18 },
  qtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20 },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center" },
  qty: { marginHorizontal: 20, fontSize: 18, fontWeight: "700" },
  extraRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  extraText: { flex: 1, marginLeft: 10, fontSize: 14, color: "#222" },
  notes: { backgroundColor: "#F5F5F5", borderRadius: 12, padding: 12, fontSize: 14, marginVertical: 14 },
  addCartBtn: { backgroundColor: "#F4B400", paddingVertical: 16, borderRadius: 16, alignItems: "center", marginBottom: 10 },
  addCartText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  closeText: { textAlign: "center", color: "#999", marginTop: 8 },
});
