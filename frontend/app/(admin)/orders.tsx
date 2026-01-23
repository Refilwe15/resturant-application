import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

/* ---------- MOCK DATA ---------- */
const ORDERS = [
  { id: "101", status: "Pending", total: 25 },
  { id: "102", status: "Preparing", total: 32 },
  { id: "103", status: "Delivered", total: 40 },
  { id: "104", status: "Cancelled", total: 18 },
];

export default function Orders() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"open" | "history">("open");

  const openOrders = ORDERS.filter(
    (o) => o.status === "Pending" || o.status === "Preparing"
  );

  const historyOrders = ORDERS.filter(
    (o) => o.status === "Delivered" || o.status === "Cancelled"
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.total}>Total: ${item.total}</Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status === "Delivered"
                ? "#E8F7EE"
                : item.status === "Cancelled"
                ? "#FDECEC"
                : "#FFF4E5",
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color:
                item.status === "Delivered"
                  ? "#2A9D8F"
                  : item.status === "Cancelled"
                  ? "#E63946"
                  : "#F4B400",
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>

        <Text style={styles.title}>Orders</Text>

        <View style={{ width: 22 }} />
      </View>

      {/* ---------- TABS ---------- */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "open" && styles.activeTab]}
          onPress={() => setActiveTab("open")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "open" && styles.activeTabText,
            ]}
          >
            Open Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            Order History
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------- LIST ---------- */}
      <FlatList
        data={activeTab === "open" ? openOrders : historyOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders found</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#EEE",
    borderRadius: 16,
    marginBottom: 20,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: "#FFF",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
  },

  activeTabText: {
    color: "#222",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  total: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 14,
  },
});
