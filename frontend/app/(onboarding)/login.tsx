import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>Hello</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Sign in your account because good food{"\n"}
        deserves easy access.
      </Text>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#B8B8B8"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
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
        />
      </View>

      {/* Forgot password */}
      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* User Login */}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Admin Login */}
      <TouchableOpacity
        style={styles.adminLogin}
        onPress={() => router.push("/(admin)/login")}
      >
        <Text style={styles.adminLoginText}>Login as Admin</Text>
      </TouchableOpacity>

      {/* Register */}
      <View style={styles.registerWrapper}>
        <Text style={styles.registerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/(onboarding)/register")}>
          <Text style={styles.registerLink}> Register Now</Text>
        </TouchableOpacity>
      </View>

      {/* Indicator */}
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
