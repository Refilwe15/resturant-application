import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderTrackingModal from "../../components/Ordertrackingmodal";

export default function CartScreen() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [address, setAddress] = useState("Fetching location...");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("cash");

  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("12"); // pre-filled
  const [expYear, setExpYear] = useState("2025"); // pre-filled
  const [cvc, setCvc] = useState("123"); // pre-filled

  const [loading, setLoading] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // Order Tracking Modal state
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");

  useEffect(() => {
    const loadAddress = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.address) setAddress(user.address);
        else getLocation();
      } else getLocation();
    };
    loadAddress();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setAddress("Location permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const geo = await Location.reverseGeocodeAsync(location.coords);

    if (geo.length > 0) {
      const place = geo[0];
      setAddress(`${place.street || ""} ${place.name || ""}, ${place.city || ""}`);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return Alert.alert("Cart is empty");

    if (paymentMethod === "card" && !cardNumber) {
      return Alert.alert("Enter card number");
    }

    setLoading(true);

    try {
      let paymentIntentId = null;

      if (paymentMethod === "card") {
        const paymentRes = await fetch(
          "http://10.0.0.113:8000/api/payment/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: Math.round(totalAmount * 100),
              card: {
                number: cardNumber,
                exp_month: parseInt(expMonth),
                exp_year: parseInt(expYear),
                cvc,
              },
            }),
          },
        );

        const paymentData = await paymentRes.json();

        if (!paymentData.success) {
          setLoading(false);
          return Alert.alert("Payment Failed", paymentData.message);
        }

        paymentIntentId = paymentData.paymentIntent.id;
      }

      const token = await AsyncStorage.getItem("token");

      const orderRes = await fetch("http://10.0.0.113:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            foodId: item.id,
            quantity: item.qty,
            selectedExtras: item.extras || [],
            notes: item.notes || "",
          })),
          totalPrice: totalAmount,
          deliveryAddress: address,
          paymentStatus: paymentMethod === "card" ? "paid" : "cash",
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setLoading(false);
        return Alert.alert("Order Failed", "Try again");
      }

      // Extract order ID (adjust based on your API response structure)
      const orderId = orderData._id || orderData.id || Date.now().toString();
      
      clearCart();
      setLoading(false);
      
      // Show tracking modal instead of alert
      setCurrentOrderId(orderId);
      setShowTrackingModal(true);

    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleTrackingComplete = () => {
    setShowTrackingModal(false);
    router.replace("/(tabs)/menu");
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `http://10.0.0.113:8000${item.image}` }}
        style={styles.cartImage}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartQty}>Qty: {item.qty}</Text>
        {item.extras && item.extras.length > 0 && (
          <Text style={styles.cartExtras}>
            {item.extras.map((e: any) => e.name).join(", ")}
          </Text>
        )}
        <Text style={styles.cartPrice}>R{(item.price * item.qty).toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
        <Feather name="trash-2" size={18} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-bag" size={80} color="#CCC" />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>Add delicious items to get started</Text>
      <TouchableOpacity
        style={styles.continueShopping}
        onPress={() => router.push("/(tabs)/menu")}
      >
        <Text style={styles.continueText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={22} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>My Cart</Text>
            <View style={{ width: 22 }} />
          </View>

          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <TouchableOpacity
                style={styles.locationBox}
                onPress={() => setShowLocationModal(true)}
              >
                <View style={styles.locationIcon}>
                  <Feather name="map-pin" size={16} color="#F4B400" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationLabel}>Delivery To</Text>
                  <Text style={styles.locationText} numberOfLines={1}>
                    {address}
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#999" />
              </TouchableOpacity>

              <View style={styles.cartSection}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                <FlatList
                  data={cart}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  scrollEnabled={false}
                />
              </View>

              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>R{totalAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>R25.00</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>R{(totalAmount + 25).toFixed(2)}</Text>
                </View>
              </View>

              {/* Payment Method */}
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Method</Text>

                <TouchableOpacity
                  style={[styles.paymentOption, paymentMethod === "cash" && styles.selectedPayment]}
                  onPress={() => setPaymentMethod("cash")}
                >
                  <View style={styles.radioButton}>
                    {paymentMethod === "cash" && <View style={styles.radioDot} />}
                  </View>
                  <Feather name="dollar-sign" size={18} color="#333" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.paymentText}>Cash on Delivery</Text>
                    <Text style={styles.paymentSubtext}>Pay when order arrives</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentOption, paymentMethod === "card" && styles.selectedPayment]}
                  onPress={() => {
                    setPaymentMethod("card");
                    setShowCardModal(true); // open modal when card selected
                  }}
                >
                  <View style={styles.radioButton}>
                    {paymentMethod === "card" && <View style={styles.radioDot} />}
                  </View>
                  <Feather name="credit-card" size={18} color="#333" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.paymentText}>Debit/Credit Card</Text>
                    <Text style={styles.paymentSubtext}>Secure payment</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.checkoutBtn, loading && styles.checkoutBtnDisabled]}
                onPress={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.checkoutText}>Place Order</Text>
                    <Text style={styles.checkoutAmount}>R{(totalAmount + 25).toFixed(2)}</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  Alert.alert("Clear Cart?", "Remove all items?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Clear", style: "destructive", onPress: () => clearCart() },
                  ]);
                }}
              >
                <Text style={styles.clearText}>Clear Cart</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Card Modal */}
      <Modal visible={showCardModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Card Details</Text>
              <TouchableOpacity onPress={() => setShowCardModal(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Card Number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
              style={styles.modalInput}
              maxLength={16}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TextInput
                placeholder="MM"
                value={expMonth}
                style={[styles.modalInput, { flex: 1 }]}
                editable={false}
              />
              <TextInput
                placeholder="YY"
                value={expYear}
                style={[styles.modalInput, { flex: 1 }]}
                editable={false}
              />
              <TextInput
                placeholder="CVC"
                value={cvc}
                style={[styles.modalInput, { flex: 1 }]}
                editable={false}
              />
            </View>

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => setShowCardModal(false)}
            >
              <Text style={styles.modalConfirmText}>Save Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Address</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Enter delivery address"
              value={address}
              onChangeText={setAddress}
              style={[styles.modalInput, { height: 100, textAlignVertical: "top" }]}
              multiline
            />

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => setShowLocationModal(false)}
            >
              <Text style={styles.modalConfirmText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        visible={showTrackingModal}
        orderId={currentOrderId}
        onComplete={handleTrackingComplete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24, marginTop: 10 },
  title: { fontSize: 24, fontWeight: "800", color: "#000" },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 100 },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#333", marginTop: 16 },
  emptySubtext: { fontSize: 14, color: "#999", marginTop: 8 },
  continueShopping: { backgroundColor: "#F4B400", paddingVertical: 12, paddingHorizontal: 32, borderRadius: 20, marginTop: 24 },
  continueText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  locationBox: { flexDirection: "row", alignItems: "center", padding: 14, backgroundColor: "#FFF7E0", borderRadius: 12, borderWidth: 1, borderColor: "#F4B400", marginBottom: 20 },
  locationIcon: { width: 36, height: 36, borderRadius: 50, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  locationLabel: { fontSize: 12, color: "#999", fontWeight: "600" },
  locationText: { fontSize: 13, color: "#333", fontWeight: "600", marginTop: 2 },
  cartSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#000", marginBottom: 12 },
  cartItem: { flexDirection: "row", marginBottom: 12, backgroundColor: "#F9F9F9", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#EFEFEF" },
  cartImage: { width: 80, height: 80, borderRadius: 10 },
  cartName: { fontWeight: "700", fontSize: 14, color: "#000" },
  cartQty: { fontSize: 12, color: "#666", marginTop: 4 },
  cartExtras: { fontSize: 11, color: "#999", marginTop: 2, fontStyle: "italic" },
  cartPrice: { fontWeight: "700", fontSize: 14, color: "#F4B400", marginTop: 6 },
  deleteBtn: { padding: 8, justifyContent: "center" },
  summaryBox: { backgroundColor: "#F9F9F9", padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: "#EFEFEF" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: "#666", fontWeight: "600" },
  summaryValue: { fontSize: 13, color: "#333", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#EFEFEF", marginVertical: 12 },
  totalLabel: { fontSize: 15, color: "#000", fontWeight: "800" },
  totalValue: { fontSize: 15, color: "#F4B400", fontWeight: "800" },
  paymentSection: { marginBottom: 20 },
  paymentOption: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: "#EFEFEF", marginBottom: 10, backgroundColor: "#FFF" },
  selectedPayment: { borderColor: "#F4B400", backgroundColor: "#FFF7E0" },
  radioButton: { width: 20, height: 20, borderRadius: 50, borderWidth: 2, borderColor: "#DDD", justifyContent: "center", alignItems: "center", marginRight: 12 },
  radioDot: { width: 10, height: 10, borderRadius: 50, backgroundColor: "#F4B400" },
  paymentText: { fontWeight: "700", fontSize: 14, color: "#000" },
  paymentSubtext: { fontSize: 12, color: "#999", marginTop: 2 },
  checkoutBtn: { backgroundColor: "#F4B400", paddingVertical: 16, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, alignItems: "center", marginBottom: 12 },
  checkoutBtnDisabled: { opacity: 0.6 },
  checkoutText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  checkoutAmount: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  clearBtn: { alignItems: "center", padding: 12 },
  clearText: { color: "#FF6B6B", fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFF", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontWeight: "800", fontSize: 18 },
  modalInput: { borderWidth: 1, borderColor: "#DDD", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  modalConfirmBtn: { backgroundColor: "#F4B400", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  modalConfirmText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
