import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import loginImage from "../assets/splash2.png";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 1000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={loginImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFEAD8",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default SplashScreen;
