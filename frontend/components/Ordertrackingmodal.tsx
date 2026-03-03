import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { Feather } from "@expo/vector-icons";

type OrderStatus = "preparing" | "collected" | "on_the_way" | "delivered";

interface OrderTrackingModalProps {
  visible: boolean;
  orderStatus: OrderStatus;
  orderId: string;
  onClose: () => void;
}

export default function OrderTrackingModal({
  visible,
  orderStatus,
  orderId,
  onClose,
}: OrderTrackingModalProps) {
  // Handle Android back button
  useEffect(() => {
    if (!visible) return;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      onClose();
      return true;
    });
    return () => backHandler.remove();
  }, [visible]);

  const statusLabels: Record<OrderStatus, string> = {
    preparing: "🍳 Preparing your order",
    collected: "✅ Order collected",
    on_the_way: "🛵 On the way to you",
    delivered: "📦 Delivered",
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Order ID */}
          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <Text style={styles.orderIdValue}>#{orderId.slice(0, 6)}</Text>
          </View>

          {/* Current Status */}
          <View style={styles.statusBox}>
            <Feather name="info" size={32} color="#F4B400" />
            <Text style={styles.statusMessage}>{statusLabels[orderStatus]}</Text>
          </View>

          {/* Close / Go to My Orders */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Go to My Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  orderIdBox: {
    backgroundColor: "#F9F9F9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  orderIdLabel: { fontSize: 11, color: "#999", fontWeight: "600", textAlign: "center" },
  orderIdValue: { fontSize: 16, fontWeight: "800", color: "#000", marginTop: 4, textAlign: "center" },
  statusBox: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7E0",
    borderRadius: 16,
    width: "100%",
    marginBottom: 24,
  },
  statusMessage: { fontSize: 16, fontWeight: "700", color: "#000", textAlign: "center", marginTop: 12 },
  closeBtn: {
    backgroundColor: "#F4B400",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
  },
  closeText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
});
