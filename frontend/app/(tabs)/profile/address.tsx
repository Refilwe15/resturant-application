import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default function AddressScreen() {
  const [address, setAddress] = useState("");

  // 🔹 Use current device location
  const useCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const places = await Location.reverseGeocodeAsync(location.coords);

      if (places.length > 0) {
        const place = places[0];
        const formatted = `${place.name ?? ""} ${
          place.street ?? ""
        }, ${place.city ?? ""}, ${place.region ?? ""}`;
        setAddress(formatted);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to get current location");
    }
  };

  // 🔹 Save to backend
  const saveAddress = async () => {
    if (!address) {
      Alert.alert("Address required");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      router.replace("/(onboarding)");
      return;
    }

    try {
      const res = await fetch("http://10.0.0.113:8000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed to update address");
        return;
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      Alert.alert("Success", "Address updated");
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Server unreachable");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Address</Text>

      {/* Google Places Autocomplete */}
      <View style={{ height: 150, marginBottom: 12 }}>
        <GooglePlacesAutocomplete
          placeholder="Search address"
          onPress={(data, details = null) => {
            setAddress(data.description);
          }}
          query={{
            key: "YOUR_GOOGLE_MAPS_API_KEY",
            language: "en",
          }}
          fetchDetails={true}
          textInputProps={{
            value: address,
            onChangeText: setAddress,
          }}
          styles={{
            textInput: styles.input,
          }}
        />
      </View>

      {/* Use Current Location */}
      <TouchableOpacity style={styles.locationBtn} onPress={useCurrentLocation}>
        <Text style={styles.locationText}>Use Current Location</Text>
      </TouchableOpacity>

      {/* Save Address */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveAddress}>
        <Text style={styles.saveText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 14,
    padding: Platform.OS === "ios" ? 12 : 10,
    height: 45,
  },
  locationBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  locationText: {
    color: "#D9A441",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#D9A441",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#FFF", fontWeight: "700" },
});
