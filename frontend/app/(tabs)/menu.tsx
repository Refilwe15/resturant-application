import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [orderType, setOrderType] = useState<"delivery" | "collection">("delivery");
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
  const { addToCart, cart } = useCart();

  // -------------------- Fetch foods --------------------
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("https://restu-back.onrender.com/api/foods");
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

    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User");
      }
    };

    fetchFoods();
    loadUser();
  }, []);

  // Filter foods based on search
  useEffect(() => {
    const allFoods = Object.values(menuData).flat();
    if (searchQuery.trim()) {
      setFilteredFoods(
        allFoods.filter((food) =>
          food.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredFoods([]);
    }
  }, [searchQuery, menuData]);

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
        source={{ uri: `https://restu-back.onrender.com${item.image}` }}
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
      {/* Header with Greeting */}
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Hi, {userName}! 👋</Text>
          <Text style={styles.subtitle}>Ready to order?</Text>
        </View>
        <View style={styles.cartBadge}>
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
          <Feather name="shopping-bag" size={24} color="#333" />
        </View>
      </View>

      {/* Order Type Selector */}
      <View style={styles.orderTypeContainer}>
        <TouchableOpacity
          style={[
            styles.orderTypeBtn,
            orderType === "delivery" && styles.orderTypeActive,
          ]}
          onPress={() => setOrderType("delivery")}
        >
          <Feather
            name="truck"
            size={18}
            color={orderType === "delivery" ? "#F4B400" : "#999"}
          />
          <Text
            style={[
              styles.orderTypeText,
              orderType === "delivery" && styles.orderTypeTextActive,
            ]}
          >
            Delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.orderTypeBtn,
            orderType === "collection" && styles.orderTypeActive,
          ]}
          onPress={() => setOrderType("collection")}
        >
          <Feather
            name="package"
            size={18}
            color={orderType === "collection" ? "#F4B400" : "#999"}
          />
          <Text
            style={[
              styles.orderTypeText,
              orderType === "collection" && styles.orderTypeTextActive,
            ]}
          >
            Collect
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#999" />
        <TextInput
          placeholder="Search food here..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      {searchQuery === "" && (
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
      )}

      {/* Menu Grid or Search Results */}
      {searchQuery !== "" ? (
        filteredFoods.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="search-off" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Try searching for something else</Text>
          </View>
        ) : (
          <FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )
      ) : menuData[activeCategory].length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="restaurant" size={48} color="#CCC" />
          <Text style={styles.emptyText}>Coming soon</Text>
          <Text style={styles.emptySubtext}>
            New items in this category coming soon
          </Text>
        </View>
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

      {/* View Cart Floating Button */}
      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <View style={styles.cartBtnContent}>
            <Feather name="shopping-bag" size={20} color="#FFF" />
            <Text style={styles.cartText}>
              View Cart ({cart.length} items)
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Item Detail Modal */}
      <Modal visible={!!selectedItem} transparent animationType="slide">
        <ScrollView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedItem(null)}
                >
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>

                {/* Image */}
                <Image
                  source={{ uri: `https://restu-back.onrender.com/${selectedItem.image}` }}
                  style={styles.modalImage}
                />

                {/* Info */}
                <View style={styles.modalInfo}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                    <Text style={styles.modalDesc}>
                      {selectedItem.description}
                    </Text>
                    <View style={styles.ratingRow}>
                      <AntDesign name="star" size={16} color="#F4B400" />
                      <Text style={styles.rating}>4.5 (120 reviews)</Text>
                    </View>
                  </View>
                  <Text style={styles.modalPrice}>
                    R{selectedItem.price.toFixed(2)}
                  </Text>
                </View>

                {/* Quantity */}
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionLabel}>Quantity</Text>
                </View>
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
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionLabel}>Extras (Optional)</Text>
                </View>
                <View style={styles.extrasContainer}>
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
                      <View style={styles.extraCheck}>
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
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.extraText}>{extra.name}</Text>
                      </View>
                      <Text style={styles.extraPrice}>+R{extra.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Notes */}
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionLabel}>Special Instructions</Text>
                </View>
                <TextInput
                  placeholder="Any special requests? (e.g., no onions, extra crispy)"
                  style={styles.notes}
                  value={notes}
                  onChangeText={setNotes}
                  placeholderTextColor="#999"
                  multiline
                />

                {/* Order Type in Modal */}
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionLabel}>Order Type</Text>
                </View>
                <View style={styles.orderTypeInModal}>
                  <Feather
                    name={orderType === "delivery" ? "truck" : "package"}
                    size={16}
                    color="#F4B400"
                  />
                  <Text style={styles.orderTypeInModalText}>
                    {orderType === "delivery"
                      ? "Delivery to your address"
                      : "Collect in store"}
                  </Text>
                </View>

                {/* Add to Cart Button */}
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
    </View>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  greeting: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  subtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },

  cartBadge: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B6B",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  orderTypeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  orderTypeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    gap: 8,
  },

  orderTypeActive: {
    backgroundColor: "#FFF7E0",
    borderColor: "#F4B400",
  },

  orderTypeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },

  orderTypeTextActive: {
    color: "#F4B400",
    fontWeight: "700",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  categoryItem: {
    alignItems: "center",
  },

  categoryText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },

  activeCategory: {
    color: "#333",
    fontWeight: "800",
  },

  activeLine: {
    width: 24,
    height: 3,
    backgroundColor: "#F4B400",
    borderRadius: 2,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFF",
    width: "48%",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  image: {
    width: "100%",
    height: 110,
    borderRadius: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
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
    marginTop: 8,
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F4B400",
  },

  addBtn: {
    backgroundColor: "#F4B400",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#999",
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 13,
    color: "#BBB",
    marginTop: 6,
  },

  cartBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#D9A441",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  cartBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  cartText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
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

  closeBtn: {
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

  ratingRow: {
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

  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  qty: {
    marginHorizontal: 24,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  extrasContainer: {
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

  extraCheck: {
    marginRight: 10,
  },

  extraText: {
    flex: 1,
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

  orderTypeInModal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7E0",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F4B400",
    gap: 10,
  },

  orderTypeInModalText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F4B400",
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
