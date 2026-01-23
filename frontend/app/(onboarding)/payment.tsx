import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

export default function PaymentScreen() {
  const [method, setMethod] = useState<"card" | "cash">("card");

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
        style={[
          styles.methodCard,
          method === "card" && styles.activeMethod,
        ]}
        onPress={() => setMethod("card")}
      >
        <Feather name="credit-card" size={20} />
        <Text style={styles.methodText}>Credit / Debit Card</Text>
        {method === "card" && <Feather name="check" size={18} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.methodCard,
          method === "cash" && styles.activeMethod,
        ]}
        onPress={() => setMethod("cash")}
      >
        <Feather name="dollar-sign" size={20} />
        <Text style={styles.methodText}>Cash on Delivery</Text>
        {method === "cash" && <Feather name="check" size={18} />}
      </TouchableOpacity>

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payBtn}
        onPress={() => router.replace("../(tabs)/orders")}
      >
        <Text style={styles.payText}>
          PAY R279.98
        </Text>
      </TouchableOpacity>
    </View>
  );
}
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
  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
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

  payBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#D9A441",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  payText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
