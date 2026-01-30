import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface OrderItem {
  id: string;
  totalPrice: number;
  paymentStatus: "paid" | "cash";
  deliveryAddress: string;
  createdAt: string;
  orderStatus: string;
  items: {
    name: string;
    qty: number;
    price: number;
    image?: string;
    extras?: { name: string }[];
  }[];
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "http://10.0.0.113:8000/api/orders/my-orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch orders: ${text}`);
      }

      const data = await res.json();
      const fetchedOrders: OrderItem[] = data.orders || data.data || [];
      setOrders(fetchedOrders);
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: OrderItem }) => {
    const isPaid = item.paymentStatus === "paid";

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>#{item.id.slice(0, 6)}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isPaid ? "#E0F7EA" : "#FFF4E5" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isPaid ? "#2E7D32" : "#F57C00" },
              ]}
            >
              {isPaid ? "Paid" : "Cash"}
            </Text>
          </View>
        </View>

        {/* Order Status */}
        <View style={styles.orderStatus}>
          <MaterialIcons
            name={
              item.orderStatus.toLowerCase() === "delivered"
                ? "check-circle"
                : "pending-actions"
            }
            size={20}
            color={item.orderStatus.toLowerCase() === "delivered" ? "#4CAF50" : "#F4B400"}
          />
          <Text style={styles.statusLabel}>{item.orderStatus}</Text>
        </View>

        {/* Items */}
        <View style={styles.itemsList}>
          {item.items.map((food, index) => (
            <View key={index} style={styles.itemRow}>
              {food.image && (
                <Image source={{ uri: food.image }} style={styles.foodImage} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>
                  {food.name} x {food.qty}
                </Text>
                {food.extras && food.extras.length > 0 && (
                  <Text style={styles.itemExtras}>
                    Extras: {food.extras.map((e) => e.name).join(", ")}
                  </Text>
                )}
              </View>
              <Text style={styles.itemPrice}>R{food.price}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total: R{item.totalPrice}</Text>
          <Text style={styles.addressLabel}>{item.deliveryAddress}</Text>
          <Text style={styles.dateLabel}>
            {new Date(item.createdAt).toLocaleDateString()}{" "}
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Loading / Empty / Orders */}
      {loading ? (
        <ActivityIndicator size="large" color="#F4B400" style={{ marginTop: 50 }} />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>
            Place some orders to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 10,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#EEE",
  },
  title: { fontSize: 22, fontWeight: "800", color: "#000" },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#333" },
  emptySubtext: { fontSize: 14, color: "#999", marginTop: 4 },

  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderId: { fontWeight: "700", fontSize: 14, color: "#000" },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: { fontWeight: "700", fontSize: 12 },

  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: { marginLeft: 6, fontWeight: "600", color: "#333" },

  itemsList: { borderTopWidth: 1, borderTopColor: "#EEE", paddingTop: 10, marginBottom: 10 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  foodImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#333" },
  itemExtras: { fontSize: 12, color: "#999", marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#F4B400", marginLeft: 8 },

  orderFooter: { borderTopWidth: 1, borderTopColor: "#EEE", paddingTop: 10 },
  totalLabel: { fontWeight: "700", fontSize: 14, marginBottom: 4 },
  addressLabel: { fontSize: 12, color: "#666", marginBottom: 2 },
  dateLabel: { fontSize: 11, color: "#999" },
});
