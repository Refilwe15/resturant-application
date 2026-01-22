import { router } from "expo-router";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DeliveryScreen() {
  return (
    <View style={styles.container}>
      {/* Skip */}
      <TouchableOpacity
        style={styles.skip}
        onPress={() => router.replace("/onboarding/reviews")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={require("../../assets/images/delivery.png")}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>
        Get Delivery at Your{"\n"}Food Step
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Your food at your food step and just{"\n"}click on step
      </Text>

      {/* Arrow button */}
      <TouchableOpacity
        style={styles.arrowWrapper}
        onPress={() => router.push("/onboarding/reviews")}
        activeOpacity={0.7}
      >
        <Image
          source={require("../../assets/images/arrow.png")}
          style={styles.arrowImage}
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
    fontSize: 13,
    color: "#B8B8B8",
    fontFamily: "PoppinsRegular",
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontFamily: "PoppinsMedium",
    fontWeight : "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    fontFamily: "PoppinsRegular",
    color: "#777",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 10,
  },

  arrowWrapper: {

   
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  arrowImage: {
    width: 120,       
    height: 120,
   
    
   
  },

  indicator: {
    position: "absolute",
    bottom: 100,
    left: 40,
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F4B400",
  },
});
