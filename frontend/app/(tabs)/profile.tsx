/* ==================== IMPORTS ==================== */
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
import { useRouter } from "expo-router";

/* ==================== TYPES ==================== */
type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  address?: string;
  cardDetails?: string;
};

/* ==================== MAIN SCREEN ==================== */
export default function ProfileScreen() {
  const router = useRouter();

  /* ---------- STATE ---------- */
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState<"info" | "address" | "edit" | "payment">("info");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cardDetails, setCardDetails] = useState("");

  /* ==================== LOAD USER ==================== */
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;

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

  /* ==================== LOGOUT ==================== */
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
      setActiveTab("info");
      router.replace("/(onboarding)");
    } catch (err) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  /* ==================== ADDRESS ==================== */
  const useCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return Alert.alert("Permission denied");

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const places = await Location.reverseGeocodeAsync(location.coords);
      if (places.length > 0) {
        const p = places[0];
        setAddress(
          `${p.name ?? ""} ${p.street ?? ""}, ${p.city ?? ""}, ${p.region ?? ""}`
        );
      }
    } catch {
      Alert.alert("Error", "Failed to get location");
    }
  };

  const saveAddress = async () => {
    if (!address) return Alert.alert("Address required");

    const token = await AsyncStorage.getItem("token");
    if (!token) return Alert.alert("Not authenticated");

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
      if (!res.ok) return Alert.alert("Error", data.message);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setActiveTab("info");
    } catch {
      Alert.alert("Error", "Server unreachable");
    }
  };

  /* ==================== PROFILE ==================== */
  const handleSaveProfile = async () => {
    if (!name || !surname || !email)
      return Alert.alert("Please fill all fields");

    const token = await AsyncStorage.getItem("token");
    if (!token) return Alert.alert("Not authenticated");

    const res = await fetch("http://10.0.0.113:8000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, surname, email }),
    });

    const data = await res.json();
    if (!res.ok) return Alert.alert("Error", data.message);

    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setActiveTab("info");
  };

  /* ==================== PAYMENT ==================== */
  const saveCard = async () => {
    if (!cardDetails) return Alert.alert("Enter card details");

    const token = await AsyncStorage.getItem("token");
    if (!token) return Alert.alert("Not authenticated");

    const res = await fetch("http://10.0.0.113:8000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cardDetails }),
    });

    const data = await res.json();
    if (!res.ok) return Alert.alert("Error", "Failed to update card");

    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setActiveTab("info");
  };

  /* ==================== LOADING ==================== */
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#F4B400" />
      </View>
    );
  }

  /* ==================== INFO TAB ==================== */
  if (activeTab === "info") {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Feather name="arrow-left" size={22} />
          <Text style={styles.headerTitle}>Profile</Text>
          <Feather name="refresh-cw" size={20} />
        </View>

        {/* Avatar */}
        <Image
          source={require("../../assets/images/profile.png")}
          style={styles.avatar}
        />

        {/* User Info */}
        <Text style={styles.name}>
          {user?.name} {user?.surname}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Text style={styles.infoText}>
          Address: {user?.address || "Not set"}
        </Text>
        <Text style={styles.infoText}>
          Card:{" "}
          {user?.cardDetails
            ? "**** **** **** " + user.cardDetails.slice(-4)
            : "Not set"}
        </Text>

        {/* Menu */}
        <View style={styles.menu}>
          <ProfileItem
            icon="receipt-outline"
            title="Order History"
            subtitle="Order Information"
            onPress={() => router.push("/(onboarding)/my-orders")}
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

          <ProfileItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
          />
        </View>
      </View>
    );
  }

  /* ==================== ADDRESS TAB ==================== */
  if (activeTab === "address") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Delivery Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity style={styles.locationBtn} onPress={useCurrentLocation}>
          <Text style={styles.locationText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={saveAddress}>
          <Text style={styles.saveText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /* ==================== EDIT TAB ==================== */
  if (activeTab === "edit") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
        />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /* ==================== PAYMENT TAB ==================== */
  if (activeTab === "payment") {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Payment Method</Text>

        <TextInput
          style={styles.input}
          value={cardDetails}
          onChangeText={setCardDetails}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveCard}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

/* ==================== PROFILE ITEM ==================== */
function ProfileItem({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} />
    </TouchableOpacity>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 36, // ⬅️ moved down slightly (was 24)
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
    marginBottom: 24, // ⬅️ balanced
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
    marginBottom: 14, // ⬅️ slightly down
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
    marginTop: 18, // ⬅️ slightly down
  },
  editText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  menu: {
    marginTop: 24, // ⬅️ slightly down
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
    marginTop: 24, // ⬅️ slightly down
    marginBottom: 24, // ⬅️ keeps it visible
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
    marginBottom: 18, // ⬅️ slightly down
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
    marginTop: 18,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
