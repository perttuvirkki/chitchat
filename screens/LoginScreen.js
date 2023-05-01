import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { React, useEffect, useState } from "react";
import { Button, Image, Input, Avatar } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import loginImage from "../assets/login.png";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    }, []);

    return unsubscribe;
  }, []);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      alert(error)
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Avatar size={150} source={loginImage} containerStyle={{ padding: 15 }} />
      <Text>welcome to chitchat</Text>
      <Text>remember to behave!</Text>
      <View style={{ height: 50 }} />

      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>

      <Button containerStyle={styles.button} onPress={signIn} title="Login" />
      <Button
        containerStyle={styles.button}
        onPress={() => navigation.navigate("Register")}
        type="outline"
        title="Sign up"
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>chitchat - Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2023 Pepetec</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#EFEAD8",
  },
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#e7e7e7",
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#7a7a7a",
  },
});
