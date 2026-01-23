import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/* -------------------- SCREEN -------------------- */

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome back, Admin</Text>

      {/* STATS */}
      <View style={styles.statsRow}>
        <StatCard title="Live Orders" value="12" icon="shopping-bag" />
        <StatCard title="Total Orders" value="340" icon="clipboard" />
      </View>

      <View style={styles.statsRow}>
        <StatCard title="Menu Items" value="48" icon="grid" />
        <StatCard title="Revenue" value="R 12,450" icon="dollar-sign" />
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <ActionCard title="Manage Food Menu" icon="book-open" />

      {/* 👇 THIS NOW NAVIGATES */}
      <ActionCard
        title="View Orders"
        icon="shopping-cart"
        onPress={() => router.push("/(admin)/orders")}
      />

      <ActionCard title="Employees" icon="users" />
      <ActionCard title="Drivers" icon="truck" />
      <ActionCard title="Store Settings" icon="settings" />
    </ScrollView>
  );
}

/* -------------------- COMPONENTS -------------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: any;
}) {
  return (
    <View style={styles.statCard}>
      <Feather name={icon} size={22} color="#F4B400" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function ActionCard({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <Feather name={icon} size={20} color="#222" />
      <Text style={styles.actionText}>{title}</Text>
      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    color: "#222",
  },

  statTitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 16,
    color: "#222",
  },

  actionCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
});
