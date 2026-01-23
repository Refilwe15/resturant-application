import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Profile() {
  const handleLogout = () => {
    // Frontend-only logout → go back to onboarding login
    router.replace("/(onboarding)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Profile</Text>

      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
