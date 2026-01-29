import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

interface OrderItem {
  id: string;
  totalPrice: number;
  paymentStatus: "paid" | "cash";
  deliveryAddress: string;
  createdAt: string;
  orderStatus:string;
  items: {
    name: string;
    qty: number;
    price: number;
    image?: string; // food image URL
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
      const res = await fetch("http://10.0.0.113:8000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: OrderItem }) => {
    const totalPrice = item.totalPrice || 0; // fix RNaN

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>#{item.id.slice(0, 6)}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.paymentStatus === "paid" ? "#E8F5E9" : "#FFF7E0",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.paymentStatus === "paid" ? "#4CAF50" : "#F4B400" },
              ]}
            >
              {item.paymentStatus === "paid" ? "Paid" : "Cash"}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsList}>
          {item.items.map((food, index) => (
            <View key={index} style={styles.itemRow}>
              {food.image && <Image source={{ uri: food.image }} style={styles.foodImage} />}
              <View style={{ flex: 1 }}>
                 <Text style={styles.addressLabel}>{item.orderStatus}</Text>
                <Text style={styles.itemExtras}>
                  {food.extras?.map(e => e.name).join(", ")}
                </Text>
              </View>
             
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total: R{totalPrice.toFixed(2)}</Text>
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
        <TouchableOpacity onPress={() => router.back()}>
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
          <Text style={styles.emptySubtext}>Place some orders to see them here</Text>
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
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 10,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#000" },
  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: "700", color: "#333" },
  emptySubtext: { fontSize: 14, color: "#999", marginTop: 4 },

  orderCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: { fontWeight: "700", fontSize: 14, color: "#000" },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: { fontWeight: "700", fontSize: 12 },

  itemsList: { borderTopWidth: 1, borderTopColor: "#EEE", paddingTop: 8, marginBottom: 8 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  foodImage: { width: 40, height: 40, borderRadius: 6, marginRight: 8 },
  itemName: { fontSize: 14, color: "#333", fontWeight: "600" },
  itemExtras: { fontSize: 12, color: "#999" },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#F4B400" },

  orderFooter: { borderTopWidth: 1, borderTopColor: "#EEE", paddingTop: 8 },
  totalLabel: { fontWeight: "700", fontSize: 14, marginBottom: 4 },
  addressLabel: { fontSize: 12, color: "#666", marginBottom: 2 },
  dateLabel: { fontSize: 11, color: "#999" },
});
