import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function CartScreen() {
  const [address, setAddress] = useState("Fetching location...");

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
        `${place.street || ""} ${place.name || ""}, ${place.city || ""}`
      );
    }
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.locationText}>
          Delivering to {address}
        </Text>

        <TouchableOpacity>
          <Text style={styles.changeText}>Change Location</Text>
        </TouchableOpacity>
      </View>

      {/* Cart items will go here */}

      {/* Checkout */}
      <TouchableOpacity style={styles.checkoutBtn}>
        <Text style={styles.checkoutText}>CHECK OUT</Text>
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
  locationText: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 13,
  },
  changeText: {
    color: "#F4B400",
    fontWeight: "600",
  },

  checkoutBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#D9A441",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  checkoutText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
