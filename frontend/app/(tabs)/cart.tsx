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

export default function CartScreen() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [address, setAddress] = useState("Fetching location...");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("cash");

  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

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
      setAddress(
        `${place.street || ""} ${place.name || ""}, ${place.city || ""}`,
      );
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return Alert.alert("Cart is empty");

    if (
      paymentMethod === "card" &&
      (!cardNumber || !expMonth || !expYear || !cvc)
    ) {
      return Alert.alert("Enter complete card details");
    }

    setLoading(true);

    try {
      let paymentIntentId = null;

      if (paymentMethod === "card") {
        const paymentRes = await fetch(
          "http://10.196.0.142:8000/api/payment/create-payment-intent",
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

      const orderRes = await fetch("http://10.196.0.142:8000/api/orders", {
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

      if (!orderRes.ok) {
        setLoading(false);
        return Alert.alert("Order Failed", "Try again");
      }

      clearCart();
      Alert.alert(
        "Order Placed",
        paymentMethod === "card"
          ? `Payment ID: ${paymentIntentId}`
          : "Pay with cash on delivery",
      );

      router.replace("/(tabs)/menu");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `http://10.196.0.142:8000${item.image}` }}
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
      <TouchableOpacity
        onPress={() => removeFromCart(item.id)}
        style={styles.deleteBtn}
      >
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
          {/* Header */}
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
              {/* Delivery Address */}
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

              {/* Cart Items */}
              <View style={styles.cartSection}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                <FlatList
                  data={cart}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  scrollEnabled={false}
                />
              </View>

              {/* Order Summary */}
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    R{totalAmount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>R25.00</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    R{(totalAmount + 25).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Payment Method */}
              <View style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    paymentMethod === "cash" && styles.selectedPayment,
                  ]}
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
                  style={[
                    styles.paymentOption,
                    paymentMethod === "card" && styles.selectedPayment,
                  ]}
                  onPress={() => setPaymentMethod("card")}
                >
                  <View style={styles.radioButton}>
                    {paymentMethod === "card" && <View style={styles.radioDot} />}
                  </View>
                  <Feather name="credit-card" size={18} color="#333" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.paymentText}>Debit/Credit Card</Text>
                    <Text style={styles.paymentSubtext}>Secure payment</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowCardModal(true)}
                    style={styles.editCardBtn}
                  >
                    <Feather name="edit-2" size={16} color="#F4B400" />
                  </TouchableOpacity>
                </TouchableOpacity>

                {/* Card Info Display when selected */}
                {paymentMethod === "card" && cardNumber && (
                  <View style={styles.cardInfoBox}>
                    <Feather name="check-circle" size={20} color="#4CAF50" />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={styles.cardInfoLabel}>Card Details Saved</Text>
                      <Text style={styles.cardInfoNumber}>
                        •••• •••• •••• {cardNumber.slice(-4)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Checkout Button */}
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
                    <Text style={styles.checkoutAmount}>
                      R{(totalAmount + 25).toFixed(2)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Clear Cart Option */}
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  Alert.alert("Clear Cart?", "Remove all items?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Clear",
                      style: "destructive",
                      onPress: () => clearCart(),
                    },
                  ]);
                }}
              >
                <Text style={styles.clearText}>Clear Cart</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Card Details Modal */}
      <Modal
        visible={showCardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Card Details</Text>
              <TouchableOpacity onPress={() => setShowCardModal(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

            {/* Card Preview */}
            <View style={styles.cardPreview}>
              <View style={styles.cardGradient}>
                <View style={styles.cardPreviewContent}>
                  <Text style={styles.cardChip}>•••• •••• •••• {cardNumber.slice(-4) || "••••"}</Text>
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardExpLabel}>Valid Thru</Text>
                      <Text style={styles.cardExpValue}>
                        {expMonth || "MM"}/{expYear || "YY"}
                      </Text>
                    </View>
                    <Feather name="credit-card" size={32} color="#FFF" />
                  </View>
                </View>
              </View>
            </View>

            {/* Card Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
                style={styles.modalInput}
                maxLength={16}
              />
            </View>

            {/* Expiry and CVC */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Expires</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TextInput
                    placeholder="MM"
                    keyboardType="numeric"
                    value={expMonth}
                    onChangeText={setExpMonth}
                    style={[styles.modalInput, { flex: 1 }]}
                    maxLength={2}
                  />
                  <TextInput
                    placeholder="YY"
                    keyboardType="numeric"
                    value={expYear}
                    onChangeText={setExpYear}
                    style={[styles.modalInput, { flex: 1 }]}
                    maxLength={2}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 0.8 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  placeholder="123"
                  keyboardType="numeric"
                  value={cvc}
                  onChangeText={setCvc}
                  style={styles.modalInput}
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <Feather name="lock" size={16} color="#4CAF50" />
              <Text style={styles.securityText}>Your card details are encrypted and secure</Text>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.modalConfirmBtn,
                (!cardNumber || !expMonth || !expYear || !cvc) && styles.modalConfirmBtnDisabled,
              ]}
              onPress={() => {
                if (!cardNumber || !expMonth || !expYear || !cvc) {
                  Alert.alert("Error", "Please fill all card details");
                  return;
                }
                setShowCardModal(false);
              }}
              disabled={!cardNumber || !expMonth || !expYear || !cvc}
            >
              <Text style={styles.modalConfirmText}>Save Card Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Details</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Feather name="x" size={24} />
              </TouchableOpacity>
            </View>

            {paymentMethod === "card" && (
              <>
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
                    keyboardType="numeric"
                    value={expMonth}
                    onChangeText={setExpMonth}
                    style={[styles.modalInput, { flex: 1 }]}
                    maxLength={2}
                  />
                  <TextInput
                    placeholder="YY"
                    keyboardType="numeric"
                    value={expYear}
                    onChangeText={setExpYear}
                    style={[styles.modalInput, { flex: 1 }]}
                    maxLength={2}
                  />
                  <TextInput
                    placeholder="CVC"
                    keyboardType="numeric"
                    value={cvc}
                    onChangeText={setCvc}
                    style={[styles.modalInput, { flex: 1 }]}
                    maxLength={3}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={() => {
                setShowPaymentModal(false);
                handleCheckout();
              }}
            >
              <Text style={styles.modalConfirmText}>Confirm & Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
  },

  /* Empty Cart */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },

  continueShopping: {
    backgroundColor: "#F4B400",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 24,
  },

  continueText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  /* Location */
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#FFF7E0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F4B400",
    marginBottom: 20,
  },

  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  locationLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },

  locationText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
    marginTop: 2,
  },

  /* Cart Section */
  cartSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    marginBottom: 12,
  },

  cartItem: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  cartName: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000",
  },

  cartQty: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  cartExtras: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
    fontStyle: "italic",
  },

  cartPrice: {
    fontWeight: "700",
    fontSize: 14,
    color: "#F4B400",
    marginTop: 6,
  },

  deleteBtn: {
    padding: 8,
    justifyContent: "center",
  },

  /* Summary */
  summaryBox: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 15,
    color: "#000",
    fontWeight: "800",
  },

  totalValue: {
    fontSize: 15,
    color: "#F4B400",
    fontWeight: "800",
  },

  /* Payment Section */
  paymentSection: {
    marginBottom: 20,
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    marginBottom: 10,
    backgroundColor: "#FFF",
  },

  selectedPayment: {
    borderColor: "#F4B400",
    backgroundColor: "#FFF7E0",
  },

  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#F4B400",
  },

  paymentText: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000",
  },

  paymentSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  /* Checkout Button */
  checkoutBtn: {
    backgroundColor: "#D9A441",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  checkoutBtnDisabled: {
    opacity: 0.6,
  },

  checkoutText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
  },

  checkoutAmount: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
    marginTop: 4,
  },

  clearBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FF6B6B",
  },

  clearText: {
    color: "#FF6B6B",
    fontWeight: "700",
    fontSize: 14,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },

  modalInput: {
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },

  modalConfirmBtn: {
    backgroundColor: "#F4B400",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  modalConfirmBtnDisabled: {
    opacity: 0.5,
  },

  modalConfirmText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
  },

  /* Card Details Modal Styles */
  cardPreview: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },

  cardGradient: {
    padding: 20,
    minHeight: 200,
    justifyContent: "space-between",
    backgroundColor: "#F4B400",
    borderRadius: 12,
  },

  cardPreviewContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  cardChip: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 2,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  cardExpLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },

  cardExpValue: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "700",
    marginTop: 4,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },

  editCardBtn: {
    padding: 8,
  },

  cardInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },

  cardInfoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E7D32",
  },

  cardInfoNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B5E20",
    marginTop: 2,
  },

  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 10,
    marginVertical: 16,
  },

  securityText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
    marginLeft: 10,
    flex: 1,
  },
});
