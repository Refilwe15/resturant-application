import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type OrderStatus = "preparing" | "collected" | "on the way" | "delivered";

interface OrderTrackingModalProps {
  visible: boolean;
  orderId: string;
  onComplete: () => void;
}

const ORDER_STAGES: { status: OrderStatus; icon: string; label: string; duration: number }[] = [
  { status: "preparing", icon: "clock", label: "Preparing your order", duration: 3000 },
  { status: "collected", icon: "check-circle", label: "Order collected", duration: 3000 },
  { status: "on the way", icon: "truck", label: "On the way to you", duration: 3000 },
  { status: "delivered", icon: "home", label: "Delivered!", duration: 2000 },
];

export default function OrderTrackingModal({
  visible,
  orderId,
  onComplete,
}: OrderTrackingModalProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!visible) {
      setCurrentStage(0);
      return;
    }

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress through stages
    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        const next = prev + 1;
        if (next >= ORDER_STAGES.length) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, ORDER_STAGES[ORDER_STAGES.length - 1].duration);
          return prev;
        }
        return next;
      });
    }, ORDER_STAGES[currentStage]?.duration || 3000);

    return () => {
      clearInterval(timer);
    };
  }, [visible, currentStage]);

  if (!visible) return null;

  const currentStageData = ORDER_STAGES[currentStage];
  const isLastStage = currentStage === ORDER_STAGES.length - 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // Prevent closing
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Order ID */}
          <View style={styles.orderIdBox}>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <Text style={styles.orderIdValue}>#{orderId}</Text>
          </View>

          {/* Progress Timeline */}
          <View style={styles.timeline}>
            {ORDER_STAGES.map((stage, index) => {
              const isActive = index === currentStage;
              const isCompleted = index < currentStage;
              const isFuture = index > currentStage;

              return (
                <View key={stage.status} style={styles.timelineItem}>
                  {/* Connector Line */}
                  {index > 0 && (
                    <View
                      style={[
                        styles.connector,
                        isCompleted && styles.connectorCompleted,
                      ]}
                    />
                  )}

                  {/* Stage Icon */}
                  <Animated.View
                    style={[
                      styles.iconContainer,
                      isCompleted && styles.iconCompleted,
                      isActive && styles.iconActive,
                      isFuture && styles.iconFuture,
                      isActive && { transform: [{ scale: pulseAnim }] },
                    ]}
                  >
                    <Feather
                      name={stage.icon as any}
                      size={isActive ? 28 : 24}
                      color={
                        isCompleted || isActive
                          ? "#FFF"
                          : "#CCC"
                      }
                    />
                  </Animated.View>

                  {/* Stage Label */}
                  <Text
                    style={[
                      styles.stageLabel,
                      isActive && styles.stageLabelActive,
                      isFuture && styles.stageLabelFuture,
                    ]}
                  >
                    {stage.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Current Status Message */}
          <View style={styles.statusBox}>
            <Feather
              name={currentStageData.icon as any}
              size={32}
              color="#F4B400"
            />
            <Text style={styles.statusMessage}>
              {isLastStage
                ? "Your order has been delivered! 🎉"
                : currentStageData.label}
            </Text>
            {!isLastStage && (
              <Text style={styles.statusSubtext}>
                Please wait while we process your order...
              </Text>
            )}
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${((currentStage + 1) / ORDER_STAGES.length) * 100}%`,
                },
              ]}
            />
          </View>

          {isLastStage && (
            <Text style={styles.redirectText}>
              Redirecting to menu in a moment...
            </Text>
          )}
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
    width: width - 40,
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
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  orderIdLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    textAlign: "center",
  },
  orderIdValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    marginTop: 4,
    textAlign: "center",
  },
  timeline: {
    width: "100%",
    marginBottom: 30,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  connector: {
    position: "absolute",
    left: 24,
    top: -20,
    width: 2,
    height: 20,
    backgroundColor: "#E0E0E0",
  },
  connectorCompleted: {
    backgroundColor: "#4CAF50",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    marginRight: 16,
  },
  iconCompleted: {
    backgroundColor: "#4CAF50",
  },
  iconActive: {
    backgroundColor: "#F4B400",
  },
  iconFuture: {
    backgroundColor: "#F0F0F0",
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  stageLabelActive: {
    color: "#000",
    fontWeight: "800",
  },
  stageLabelFuture: {
    color: "#CCC",
  },
  statusBox: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7E0",
    borderRadius: 16,
    width: "100%",
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginTop: 12,
  },
  statusSubtext: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 6,
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#F4B400",
    borderRadius: 3,
  },
  redirectText: {
    fontSize: 12,
    color: "#666",
    marginTop: 16,
    fontStyle: "italic",
  },
});
