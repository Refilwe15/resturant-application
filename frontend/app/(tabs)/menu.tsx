import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";

/* -------------------- CATEGORIES -------------   */
const categories = ["Burgers", "Sides", "Desserts", "Drinks"];

/* -------------------- EXTRAS ----------------    */
const extrasData = [
  { id: "e1", name: "Extra Cheese", price: 10 },
  { id: "e2", name: "Add Bacon", price: 15 },
  { id: "e3", name: "Spicy Sauce", price: 5 },
];

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState("Burgers");
  const [menuData, setMenuData] = useState<Record<string, any[]>>({
    Burgers: [],
    Sides: [],
    Desserts: [],
    Drinks: [],
  });

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [extras, setExtras] = useState<any[]>([]);
  const { addToCart } = useCart(); // Cart hook

  // -------------------- Fetch foods --------------------
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("http://10.196.0.142:8000/api/foods");
        const data = await res.json();

        const categorized: Record<string, any[]> = {
          Burgers: [],
          Sides: [],
          Desserts: [],
          Drinks: [],
        };

        data.forEach((item: any) => {
          if (categorized[item.type]) categorized[item.type].push(item);
        });

        setMenuData(categorized);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      }
    };

    fetchFoods();
  }, []);

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
        : [...prev, extra],
    );
  };

  const basePrice = selectedItem ? selectedItem.price : 0;
  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
  const totalPrice = ((basePrice + extrasTotal) * qty).toFixed(2);

  // -------------------- Add to Cart --------------------
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

  // -------------------- Render single item --------------------
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `http://10.196.0.142:8000${item.image}` }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.description}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => openModal(item)}>
          <Feather name="plus" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.greeting}>Hi, Refilwel</Text>
      <Text style={styles.title}>Find your favourite food</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#999" />
        <TextInput placeholder="Search food here" style={styles.searchInput} />
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

      {/* Menu Grid */}
      {menuData[activeCategory].length === 0 ? (
        <Text style={styles.emptyText}>Coming soon</Text>
      ) : (
        <FlatList
          data={menuData[activeCategory]}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* View Cart */}
      <TouchableOpacity
        style={styles.cartBtn}
        onPress={() => router.push("/(tabs)/cart")}
      >
        <Text style={styles.cartText}>View Cart</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image
                  source={{ uri: `http://10.196.0.142:8000/${selectedItem.image}` }}
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
    </View>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingHorizontal: 16, paddingTop: 80 },
  greeting: { fontSize: 14, color: "#999" },
  title: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 16 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14 },
  categories: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  categoryItem: { alignItems: "center" },
  categoryText: { fontSize: 14, color: "#999" },
  activeCategory: { color: "#222", fontWeight: "700" },
  activeLine: { width: 22, height: 3, backgroundColor: "#F4B400", borderRadius: 2, marginTop: 6 },
  card: { backgroundColor: "#FFF", width: "48%", borderRadius: 18, padding: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  image: { width: "100%", height: 100, borderRadius: 14 },
  name: { fontSize: 14, fontWeight: "700", marginTop: 8, color: "#222" },
  desc: { fontSize: 11, color: "#777", marginVertical: 6, lineHeight: 15 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 14, fontWeight: "700", color: "#222" },
  addBtn: { backgroundColor: "#F4B400", width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#999", fontSize: 14 },
  cartBtn: { position: "absolute", bottom: 20, left: 16, right: 16, backgroundColor: "#D9A441", paddingVertical: 16, borderRadius: 18, alignItems: "center" },
  cartText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
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
