import React from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "../../Utils/Colors";

const SplashScreenComponent = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/images/station-marker.png")} style={styles.logo} />
      <Text style={styles.text}>ChargEase</Text>
      <ActivityIndicator size="large" color={Colors.PRIMARY} style={styles.loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 100,
    height: 120,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  loading: {
    marginTop: 20,
  },
});

export default SplashScreenComponent;
