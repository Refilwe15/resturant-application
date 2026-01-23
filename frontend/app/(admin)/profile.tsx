import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Profile() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@email.com");
  const [role, setRole] = useState("Restaurant Administrator");

  const handleLogout = () => {
    router.replace("/(onboarding)/login");
  };

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Feather name="edit-2" size={20} color="#222" />
        </TouchableOpacity>
      </View>

      {/* ---------- PROFILE CARD ---------- */}
      <View style={styles.card}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>

        <View style={styles.divider} />

        <ProfileRow icon="mail" label={email} />
        <ProfileRow icon="shield" label="Full Access" />
      </View>

      {/* ---------- LOGOUT ---------- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#FFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* ================= EDIT PROFILE MODAL ================= */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Role"
              value={role}
              onChangeText={setRole}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- SMALL ROW COMPONENT ---------- */
function ProfileRow({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={16} color="#777" />
      <Text style={styles.rowText}>{label}</Text>
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
    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  role: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  rowText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },

  logoutBtn: {
    backgroundColor: "#E63946",
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },

  /* ---------- MODAL ---------- */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },

  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    marginBottom: 12,
    color: "#222",
  },

  saveBtn: {
    backgroundColor: "#F4B400",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "#FFF",
    fontWeight: "700",
  },

  cancelText: {
    textAlign: "center",
    color: "#777",
    marginTop: 12,
  },
});
