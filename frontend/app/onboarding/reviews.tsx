import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ReviewsScreen() {
  return (
    <View style={styles.container}>
      {/* Skip */}
      <TouchableOpacity
        style={styles.skip}
        onPress={() => router.replace("/onboarding/login")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Review Image */}
      <Image
        source={require("../../assets/images/reviews.png")}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>We Have 5000 +{"\n"}Review On Our App</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        We have 5+ User review you can{"\n"}check on socials
      </Text>

      {/* Arrow button */}
      <TouchableOpacity
        style={styles.arrowWrapper}
        onPress={() => router.push("/onboarding/delivery")}
        activeOpacity={0.8}
      >
        <Image
          source={require("../../assets/images/arrow.png")}
          style={styles.arrow}
        />
      </TouchableOpacity>

      {/* Bottom indicator */}
      <View style={styles.indicator} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingTop: 90,
  },

  skip: {
    position: "absolute",
    top: 55,
    right: 24,
  },
  skipText: {
    fontSize: 14,
    color: "#B8B8B8",
    fontFamily: "PoppinsRegular",
  },

  image: {
    width: 280,
    height: 280,
    resizeMode: "contain",
    marginTop: 40,

  },

  title: {
    fontSize: 22,
    fontFamily: "PoppinsSemiBold",
    fontWeight : "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    fontSize:18,
    fontFamily: "PoppinsRegular",
    color: "#7A7A7A",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 0,
  },

  arrowWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    width: 120,
    height: 120,
   
  },

  indicator: {
    position: "absolute",
    bottom: 95,
    left: 40,
    width: 60,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F4B400",
  },
});
