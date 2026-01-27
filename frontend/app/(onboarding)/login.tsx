import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Feather } from "@expo/vector-icons";

// 🔥 CHANGE THIS BASED ON YOUR ENV
const API_URL = "http://10.0.0.113:8000/api/auth/login";
// Android emulator ↑
// iOS simulator → http://localhost:8000

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login failed", data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ SAVE TOKEN
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // ✅ GO TO TABS
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Server unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Hello</Text>

      <Text style={styles.subtitle}>
        Sign in your account because good food{"\n"}deserves easy access.
      </Text>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Feather name="lock" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerWrapper}>
        <Text style={styles.registerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/(onboarding)/register")}>
          <Text style={styles.registerLink}> Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 80,
  },

  logo: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "PoppinsSemiBold",
    color: "#000",
  },

  subtitle: {
    fontSize: 18,
    fontFamily: "PoppinsRegular",
    color: "#7A7A7A",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },

  inputWrapper: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#000",
  },

  forgot: {
    width: "85%",
    alignItems: "flex-end",
    marginBottom: 24,
  },

  forgotText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    color: "#B8B8B8",
  },

  loginBtn: {
    width: "60%",
    height: 48,
    backgroundColor: "#F4B400",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  loginText: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "#FFF",
  },

  adminLogin: {
    marginBottom: 24,
  },

  adminLoginText: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    color: "#000",
    textDecorationLine: "underline",
  },

  registerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  registerText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    color: "#7A7A7A",
  },

  registerLink: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    color: "#F4B400",
  },

  indicator: {
    position: "absolute",
    bottom: 90,
    left: 40,
    width: 60,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F4B400",
  },
});
