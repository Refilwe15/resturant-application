import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

/* -------------------- TYPES -------------------- */
type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  address?: string;
  cardDetails?: string;
};

/* -------------------- MAIN PROFILE SCREEN -------------------- */
export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Tab control: 'info', 'address', 'edit', 'payment'
  const [activeTab, setActiveTab] = useState<"info" | "address" | "edit" | "payment">("info");

  // Form states for editing profile
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  // Address state
  const [address, setAddress] = useState("");

  // Payment state
  const [cardDetails, setCardDetails] = useState("");

  /* Load user data from storage on mount */
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");

      if (!storedUser) {
        // Redirect to onboarding if no user
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name || "");
      setSurname(parsedUser.surname || "");
      setEmail(parsedUser.email || "");
      setAddress(parsedUser.address || "");
      setCardDetails(parsedUser.cardDetails || "");
      setLoading(false);
    };

    loadUser();
  }, []);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    // You can also navigate out here if using router
    // router.replace("/(onboarding)");
    setUser(null);
    setActiveTab("info");
  };

  /* -------------------- ADDRESS -------------------- */
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

  const saveAddress = async () => {
    if (!address) {
      Alert.alert("Address required");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Not authenticated");
      return;
    }

    try {
      const res = await fetch("http://10.196.0.142:8000/api/users/profile", {
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
      setUser(data.user);
      Alert.alert("Success", "Address updated");
      setActiveTab("info");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Server unreachable");
    }
  };

  /* -------------------- EDIT PROFILE -------------------- */
  const handleSaveProfile = async () => {
    if (!name || !surname || !email) {
      Alert.alert("Please fill all fields");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Not authenticated");
      return;
    }

    try {
      const res = await fetch("http://10.196.0.142:8000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, surname, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Update failed");
        return;
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      Alert.alert("Success", "Profile updated");
      setActiveTab("info");
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  /* -------------------- PAYMENT -------------------- */
  const saveCard = async () => {
    if (!cardDetails) {
      Alert.alert("Enter card details");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Not authenticated");
      return;
    }

    try {
      const res = await fetch("http://10.196.0.142:8000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardDetails }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", "Failed to update card");
        return;
      }

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      Alert.alert("Success", "Payment method updated");
      setActiveTab("info");
    } catch (err) {
      Alert.alert("Error", "Failed to update card");
    }
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F4B400" />
      </View>
    );
  }

  /* -------------------- TAB COMPONENTS -------------------- */

  // Default info tab
  if (activeTab === "info") {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {}}>
            <Feather name="arrow-left" size={22} color="#222" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Profile</Text>

          <TouchableOpacity onPress={() => setActiveTab("info")}>
            <Feather name="refresh-cw" size={20} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <Image
          source={require("../../assets/images/profile.png")}
          style={styles.avatar}
        />

        {/* User Data */}
        <Text style={styles.name}>
          {user?.name} {user?.surname}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={{ textAlign: "center", marginVertical: 10, color: "#555" }}>
          Address: {user?.address || "Not set"}
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 10, color: "#555" }}>
          Card: {user?.cardDetails ? "**** **** **** " + user.cardDetails.slice(-4) : "Not set"}
        </Text>

        {/* Menu */}
        <View style={styles.menu}>
          <ProfileItem
            icon="receipt-outline"
            title="Order History"
            subtitle="Order Information"
            onPress={() => Alert.alert("Coming Soon", "Order History feature coming soon")}
          />
          <ProfileItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Pay Your Bill"
            onPress={() => setActiveTab("payment")}
          />
          <ProfileItem
            icon="location-outline"
            title="Delivery Addresses"
            subtitle="Your Delivery Addresses"
            onPress={() => setActiveTab("address")}
          />
          <ProfileItem
            icon="create-outline"
            title="Edit Profile"
            subtitle="Update your info"
            onPress={() => setActiveTab("edit")}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* -------------------- ADDRESS TAB -------------------- */
  if (activeTab === "address") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Delivery Address</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter delivery address"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity style={styles.locationBtn} onPress={useCurrentLocation}>
          <Text style={styles.locationText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={saveAddress}>
          <Text style={styles.saveText}>Save Address</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: "#ccc", marginTop: 10 }]}
          onPress={() => setActiveTab("info")}
        >
          <Text style={[styles.saveText, { color: "#333" }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /* -------------------- EDIT PROFILE TAB -------------------- */
  if (activeTab === "edit") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: "#ccc", marginTop: 10 }]}
          onPress={() => setActiveTab("info")}
        >
          <Text style={[styles.saveText, { color: "#333" }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /* -------------------- PAYMENT TAB -------------------- */
  if (activeTab === "payment") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Payment Method</Text>

        <TextInput
          placeholder="Card Number"
          style={styles.input}
          value={cardDetails}
          onChangeText={setCardDetails}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveCard}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: "#ccc", marginTop: 10 }]}
          onPress={() => setActiveTab("info")}
        >
          <Text style={[styles.saveText, { color: "#333" }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

/* -------------------- REUSABLE PROFILE ITEM -------------------- */
function ProfileItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#222" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>

      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 60,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: "center",
    marginBottom: 16,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#222",
  },
  email: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
  },

  editBtn: {
    alignSelf: "center",
    backgroundColor: "#D9A441",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 18,
    marginTop: 20,
  },
  editText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  menu: {
    marginTop: 30,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F1E2C3",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F9F5EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 14,
    padding: Platform.OS === "ios" ? 12 : 10,
    height: 45,
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
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
  saveText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
