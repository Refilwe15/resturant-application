import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
  const handleLogout = () => {
    router.replace("/(onboarding)");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity>
          <Feather name="refresh-cw" size={20} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <Image
        source={require("../../assets/images/profile.png")}
        style={styles.avatar}
      />

      {/* User Info */}
      <Text style={styles.name}>Refilwe Mokoena</Text>
      <Text style={styles.email}>refilwemokoena12q11@gmail.com</Text>

      {/* Edit Profile */}
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Menu Items */}
      <View style={styles.menu}>
        <ProfileItem
          icon="receipt-outline"
          title="Order History"
          subtitle="Order Information"
        />

        <ProfileItem
          icon="card-outline"
          title="Payment Methods"
          subtitle="Pay Your Bill"
        />

        <ProfileItem
          icon="location-outline"
          title="Delivery Addresses"
          subtitle="Your Delivery Addresses"
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

/* -------------------- REUSABLE ITEM -------------------- */

function ProfileItem({
  icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <TouchableOpacity style={styles.item}>
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
});
