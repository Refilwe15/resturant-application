import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  CardField,
  useConfirmPayment,
  useStripe,
} from "@stripe/stripe-react-native";

// Replace with your actual backend URL
const BACKEND_URL = "http://10.0.0.113:8000/api/payment/create-payment-intent";

export default function PaymentScreen() {
  const [method, setMethod] = useState<"card" | "cash">("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const { confirmPayment } = useConfirmPayment();
  const stripe = useStripe();

  // Fetch PaymentIntent when card is selected
  useEffect(() => {
    if (method === "card") {
      fetchPaymentIntent();
    }
  }, [method]);

  const fetchPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 27998, // R279.98 in cents
          currency: "ZAR",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      if (!data.clientSecret) {
        Alert.alert("Error", "No client secret received");
        setLoading(false);
        return;
      }

      setClientSecret(data.clientSecret);
      setLoading(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create payment");
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (method === "cash") {
      Alert.alert("Order placed", "You chose Cash on Delivery!");
      router.replace("../(tabs)/orders");
      return;
    }

    if (!clientSecret) {
      Alert.alert("Error", "Payment not ready. Please wait...");
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert("Error", "Please enter complete card details");
      return;
    }

    if (!stripe) {
      Alert.alert("Error", "Stripe not initialized");
      return;
    }

    setLoading(true);

    try {
      // ✅ Correct way to confirm payment
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            email: "customer@example.com",
            // Add other details if needed
          },
        },
      });

      if (error) {
        Alert.alert("Payment Failed", error.message);
      } else if (paymentIntent) {
        if (paymentIntent.status === "Succeeded") {
          Alert.alert(
            "Payment Successful",
            "Your payment was processed successfully!",
            [
              {
                text: "OK",
                onPress: () => router.replace("../(tabs)/orders"),
              },
            ],
          );
        } else {
          Alert.alert(
            "Payment Status",
            `Payment status: ${paymentIntent.status}`,
          );
        }
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // Test card function (for development only)
  const fillTestCard = () => {
    // This is just for UI - actual test card should be typed manually
    Alert.alert(
      "Test Card Info",
      "Use: 4242 4242 4242 4242\nExp: 12/34\nCVC: 123\nZIP: 12345",
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Order Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.row}>
          <Text>Items Total</Text>
          <Text>R259.98</Text>
        </View>
        <View style={styles.row}>
          <Text>Delivery Fee</Text>
          <Text>R20.00</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>R279.98</Text>
        </View>
      </View>

      {/* Payment Method */}
      <Text style={styles.sectionTitle}>Payment Method</Text>

      <TouchableOpacity
        style={[styles.methodCard, method === "card" && styles.activeMethod]}
        onPress={() => setMethod("card")}
      >
        <Feather name="credit-card" size={20} />
        <Text style={styles.methodText}>Credit / Debit Card</Text>
        {method === "card" && <Feather name="check" size={18} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.methodCard, method === "cash" && styles.activeMethod]}
        onPress={() => setMethod("cash")}
      >
        <Feather name="dollar-sign" size={20} />
        <Text style={styles.methodText}>Cash on Delivery</Text>
        {method === "cash" && <Feather name="check" size={18} />}
      </TouchableOpacity>

      {/* Stripe Card Field */}
      {method === "card" && (
        <>
          <TouchableOpacity style={styles.testCardBtn} onPress={fillTestCard}>
            <Text style={styles.testCardText}>Need test card info?</Text>
          </TouchableOpacity>

          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: "4242 4242 4242 4242",
              expiration: "MM/YY",
              cvc: "CVC",
              postalCode: "ZIP",
            }}
            cardStyle={styles.card}
            style={styles.cardContainer}
            onCardChange={(cardDetails) => {
              setCardDetails(cardDetails);
            }}
          />
        </>
      )}

      {/* Pay Button */}
      <TouchableOpacity
        style={[
          styles.payBtn,
          (loading || (method === "card" && !cardDetails?.complete)) && {
            opacity: 0.5,
          },
        ]}
        onPress={handlePay}
        disabled={loading || (method === "card" && !cardDetails?.complete)}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.payText}>
            PAY R279.98 {method === "cash" ? "(Cash on Delivery)" : ""}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "700" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },
  summaryBox: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 14,
  },
  activeMethod: {
    borderColor: "#F4B400",
    backgroundColor: "#FFF9E5",
  },
  methodText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  testCardBtn: {
    alignSelf: "flex-end",
    marginBottom: 8,
    padding: 4,
  },
  testCardText: {
    color: "#F4B400",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  card: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
  },
  cardContainer: {
    height: 50,
    marginVertical: 10,
    width: "100%",
  },
  payBtn: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: "#D9A441",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
