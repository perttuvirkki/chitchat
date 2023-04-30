import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Button, Input } from "@rneui/themed";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import CryptoJS from "crypto-js";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);

  const handleInputChange = (text) => {
    setInput(text.slice(0, 100));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
    });
  }, [navigation]);

  const createChat = async () => {
    try {
      const newChatRef = await addDoc(collection(db, "chats"), {
        chatName: input,
        createdAt: serverTimestamp(),
      });
      setChatId(newChatRef.id);

      let randomHash = CryptoJS.SHA256("" + Math.random())
        .toString()
        .substring(0, 20);

      const svgUrl = await fetchAvatarXml(randomHash);

      await addDoc(collection(db, "chats", newChatRef.id, "users"), {
        email: auth.currentUser.email,
        userNumber: 1,
        userSVG: svgUrl,
      });

      await addDoc(collection(db, "chats", newChatRef.id, "messages"), {
        createdAt: serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        userNumber: 1,
      });
    } catch (error) {
      alert(error);
    }
  };

  const fetchAvatarXml = async (hash) => {
    const baseUrl = "https://api.multiavatar.com";
    const response = await fetch(`${baseUrl}/${hash}`);
    const data = await response.text();
    return data;
  };

  useEffect(() => {
    if (chatId) {
      navigation.navigate("Chat", { id: chatId, chatName: input });
    }
  }, [chatId]);

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder="Whats on your mind?"
        value={input}
        onChangeText={handleInputChange}
        multiline={true}
        onSubmitEditing={createChat}
      />
      <Text style={styles.counter}>{input.length}/100</Text>
      <Button title="Create chat" onPress={createChat} />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
  },
  input: {
    height: 100,
    borderColor: "gray",
    backgroundColor: "yellow",
    borderBottomWidth: 0,
    borderWidth: 2,
    borderRadius: 5,
    flex: 1,
    paddingHorizontal: 10,
  },
  counter: {
    fontSize: 12,
    color: "gray",
    marginLeft: 10,
  },
});
