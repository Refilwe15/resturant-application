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
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {

    if (!name || !contactNumber || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register(name, "", email, password);
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("../(tabs)"),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error instanceof Error ? error.message : "Server unreachable");
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

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Sign up to enjoy delicious meals{"\n"}delivered to your doorstep.
      </Text>

      <View style={styles.inputWrapper}>
        <Feather name="user" size={20} color="#B8B8B8" />
      <TextInput
      placeholder="First Name"
      style={styles.input}
      value={name}
      onChangeText={setName}
      placeholderTextColor="#999" 
/>

      </View>

      <View style={styles.inputWrapper}>
        <Feather name="phone" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Cell Number"
          style={styles.input}
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          placeholderTextColor="#999"
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
          placeholderTextColor="#999"
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Feather name="lock" size={20} color="#B8B8B8" />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          placeholderTextColor="#999"
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.registerText}>Register</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginWrapper}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom dot */}
            <View style={styles.dot} />
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
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "#7A7A7A",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
    dot: {
    position: "absolute",
    left: 4,
    width: 60,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F4B400",
    bottom: 100,
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
});
