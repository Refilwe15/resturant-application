import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";

export default function RegisterScreen() {
  // State to hold form values
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://10.0.0.113:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Registration failed", data.error || "Unknown error");
        return;
      }

      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)"); // Navigate to main app
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to register. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Sign up to enjoy delicious meals{"\n"}delivered to your doorstep.
      </Text>

      {/* Name */}
      <View style={styles.inputWrapper}>
        <Feather name="user" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#B8B8B8"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Surname */}
      <View style={styles.inputWrapper}>
        <Feather name="user" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Surname"
          placeholderTextColor="#B8B8B8"
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#B8B8B8"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Feather name="lock" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#B8B8B8"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <Feather name="lock" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#B8B8B8"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Register button */}
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.loginWrapper}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.indicator} />
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
    width: 150,
    height: 150,
    marginBottom: -20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "PoppinsSemiBold",
    color: "#000",
    marginBottom: 0,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#7A7A7A",
    textAlign: "center",
    lineHeight: 22,
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

  registerBtn: {
    width: "60%",
    height: 48,
    backgroundColor: "#F4B400",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 24,
  },

  registerText: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "#FFF",
  },

  loginWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  loginText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    color: "#7A7A7A",
  },

  loginLink: {
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
