import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function OnboardingOne() {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Image floating animation (loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageAnim, {
          toValue: -15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(imageAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loader animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/onboarding/delivery");
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      {/* Animated Image */}
      <Animated.Image
        source={require("../../assets/images/pic1.png")}
        style={[
          styles.image,
          {
            transform: [{ translateY: imageAnim }],
          },
        ]}
      />

      {/* Progress bar */}
      <View style={styles.progress}>
        <View style={styles.progressInactive} />
        <Animated.View
          style={[styles.progressActive, { width: progressWidth }]}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Loading Deals And More ....</Text>

      {/* Bottom dot */}
      <View style={styles.dot} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 90,
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginTop: 120,
    marginBottom: 40,
  },

  progress: {
    width: 200,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 18,
  },

  progressInactive: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E0E0E0",
  },

  progressActive: {
    height: 3,
    backgroundColor: "#F4B400",
    borderRadius: 2,
  },

  title: {
    fontSize: 15,
    color: "#000",
    fontWeight: "800",
    marginBottom: 10,
    fontFamily: "PoppinsMedium",
  },

  dot: {
    position: "absolute",
    left: -2,
    width: 60,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F4B400",
    bottom: 100,
  },
});
