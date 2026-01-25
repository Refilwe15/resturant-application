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

export default function CartScreen() {
  const { cart, removeFromCart } = useCart();
  const [address, setAddress] = useState("Fetching location...");

  // Card inputs
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setAddress("Location permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const geo = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (geo.length > 0) {
      const place = geo[0];
      setAddress(
        `${place.street || ""} ${place.name || ""}, ${place.city || ""}`,
      );
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `http://10.0.0.113:8000${item.image}` }}
        style={styles.cartImage}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text>Qty: {item.qty}</Text>
        <Text>
          Extras: {item.extras.map((e) => e.name).join(", ") || "None"}
        </Text>
        <Text>Notes: {item.notes || "None"}</Text>
        <Text style={styles.cartPrice}>R{item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Feather name="trash-2" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return Alert.alert("Cart is empty");

    if (!cardNumber || !expMonth || !expYear || !cvc) {
      return Alert.alert("Enter complete card details");
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://10.0.0.113:8000/api/payment/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100), // amount in cents
            card: {
              number: cardNumber,
              exp_month: parseInt(expMonth),
              exp_year: parseInt(expYear),
              cvc,
            },
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        Alert.alert(
          "Payment Successful ✅",
          `PaymentIntent ID: ${data.paymentIntent.id}`,
        );
        // Optionally clear cart or navigate
      } else {
        Alert.alert("Payment Failed ❌", data.message);
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Payment Error ❌", err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Location */}
        <View style={styles.locationBox}>
          <Feather name="truck" size={18} />
          <Text style={styles.locationText}>Delivering to {address}</Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change Location</Text>
          </TouchableOpacity>
        </View>

        {/* Cart items */}
        {cart.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Your cart is empty
          </Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* Total Amount */}
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>R{totalAmount.toFixed(2)}</Text>
        </View>

        {/* Card Input */}
        <View style={{ padding: 16 }}>
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
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700" },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 20,
  },
  locationText: { flex: 1, marginHorizontal: 10, fontSize: 13 },
  changeText: { color: "#F4B400", fontWeight: "600" },
  checkoutBtn: {
    backgroundColor: "#D9A441",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 40,
  },
  checkoutText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 12,
  },
  cartImage: { width: 80, height: 80, borderRadius: 12 },
  cartName: { fontWeight: "700", fontSize: 16, color: "#222" },
  cartPrice: { fontWeight: "700", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginVertical: 10,
  },
  totalText: { fontSize: 16, fontWeight: "700" },
  totalAmount: { fontSize: 16, fontWeight: "700" },
});
