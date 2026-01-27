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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useCart } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [address, setAddress] = useState("Fetching location...");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");

  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");

  const [loading, setLoading] = useState(false);

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
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text>Qty: {item.qty}</Text>
        <Text>
          Extras: {item.extras.map((e: any) => e.name).join(", ") || "None"}
        </Text>
        <Text style={styles.cartPrice}>R{item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Feather name="trash-2" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} />
          </TouchableOpacity>
          <Text style={styles.title}>Cart</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Address */}
        <View style={styles.locationBox}>
          <Feather name="truck" size={18} />
          <Text style={styles.locationText}>{address}</Text>
        </View>

        {/* Cart */}
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>R{totalAmount.toFixed(2)}</Text>
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "card" && styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod("card")}
        >
          <Feather name="credit-card" size={18} />
          <Text style={styles.paymentText}>Pay with Card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "cash" && styles.selectedPayment,
          ]}
          onPress={() => setPaymentMethod("cash")}
        >
          <Feather name="dollar-sign" size={18} />
          <Text style={styles.paymentText}>Cash on Delivery</Text>
        </TouchableOpacity>

        {/* Card Form (ONLY WHEN CARD SELECTED) */}
        {paymentMethod === "card" && (
          <View style={styles.cardBox}>
            <TextInput
              placeholder="Card Number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                placeholder="MM"
                keyboardType="numeric"
                value={expMonth}
                onChangeText={setExpMonth}
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                placeholder="YY"
                keyboardType="numeric"
                value={expYear}
                onChangeText={setExpYear}
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                placeholder="CVC"
                keyboardType="numeric"
                value={cvc}
                onChangeText={setCvc}
                style={[styles.input, { flex: 1 }]}
              />
            </View>
          </View>
        )}

        {/* Checkout */}
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          disabled={loading}
        >
          <Text style={styles.checkoutText}>
            {loading ? "Processing..." : "CHECK OUT"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 70 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700" },

  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 20,
  },

  locationText: { marginLeft: 10, fontSize: 13 },

  cartItem: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 12,
  },

  cartImage: { width: 80, height: 80, borderRadius: 12 },
  cartName: { fontWeight: "700" },
  cartPrice: { fontWeight: "700", marginTop: 6 },

  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginVertical: 14,
  },

  totalText: { fontWeight: "700" },
  totalAmount: { fontWeight: "700" },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },

  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 10,
  },

  selectedPayment: {
    borderColor: "#F4B400",
    backgroundColor: "#FFF7E0",
  },

  paymentText: {
    marginLeft: 10,
    fontWeight: "600",
  },

  cardBox: {
    backgroundColor: "#F9F9F9",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  checkoutBtn: {
    backgroundColor: "#D9A441",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 30,
  },

  checkoutText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
