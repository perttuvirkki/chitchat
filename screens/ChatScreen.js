import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Avatar } from "@rneui/base";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  serverTimestamp,
  orderBy,
  onSnapshot,
  where,
  getDocs,
} from "firebase/firestore";
import { SvgXml } from "react-native-svg";
import CryptoJS from "crypto-js";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchAvatarXml = async (hash) => {
    const baseUrl = "https://api.multiavatar.com";
    const response = await fetch(`${baseUrl}/${hash}`);
    const data = await response.text();
    return data;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri:
                route.params.chatImage ||
                "https://png.pngtree.com/element_our/png_detail/20181229/vector-chat-icon-png_302635.jpg",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const sendMessage = async () => {
    Keyboard.dismiss();

    const messagesCollectionRef = collection(
      db,
      "chats",
      route.params.id,
      "messages"
    );

    const userDocQuery = query(
      collection(db, "chats", route.params.id, "users"),
      where("email", "==", auth.currentUser.email)
    );

    const userDocSnapshot = await getDocs(userDocQuery);

    let userNumber;
    if (!userDocSnapshot.empty) {
      // User already has a number assigned, retrieve it from their document
      const userDoc = userDocSnapshot.docs[0];
      userNumber = userDoc.data().userNumber;
    } else {
      // Assign a new number to the user
      const userNumberQuery = query(
        collection(db, "chats", route.params.id, "users")
      );
      const userNumberSnapshot = await getDocs(userNumberQuery);
      userNumber = userNumberSnapshot.size + 1;
      let randomHash = CryptoJS.SHA256("" + Math.random())
        .toString()
        .substring(0, 20);

      const svgUrl = await fetchAvatarXml(randomHash);

      // Add the new user to the users collection with the assigned number
      await addDoc(collection(db, "chats", route.params.id, "users"), {
        email: auth.currentUser.email,
        userNumber,
        userSVG: svgUrl,
      });
    }

    await addDoc(messagesCollectionRef, {
      createdAt: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
      userNumber: userNumber,
    });

    setInput("");
  };

  useLayoutEffect(() => {
    const messagesCollectionRef = collection(
      db,
      "chats",
      route.params.id,
      "messages"
    );
    const q = query(messagesCollectionRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, [route]);

  useLayoutEffect(() => {
    const usersCollectionRef = collection(
      db,
      "chats",
      route.params.id,
      "users"
    );
    const q = query(usersCollectionRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <>
          <ScrollView
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
          >
            {messages?.map(({ id, data }) => {
              let userAvatar = users.find(
                (user) => user.data.email === data.email
              );
              if (!userAvatar) {
                return null;
              }
              return data?.email === auth?.currentUser?.email ? (
                <View style={styles.sender} key={id}>
                  <Text style={styles.senderText}>{data.message}</Text>
                  <View style={styles.avatarRight}>
                    <SvgXml
                      xml={userAvatar?.data?.userSVG}
                      width={40}
                      height={40}
                    />
                    <Text>{userAvatar?.data?.userNumber}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.receiver} key={id}>
                  <Text style={styles.receiverText}>{data.message}</Text>
                  <View style={styles.avatarLeft}>
                    <SvgXml xml={userAvatar?.data?.userSVG} />
                    <Text>{userAvatar?.data?.userNumber}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput
              placeholder="Say something nice"
              style={styles.textInput}
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={sendMessage}
              disabled={!input}
            >
              <Ionicons
                name="send"
                size={24}
                color={!input ? "gray" : "#2b68e6"}
              />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarRight: {
    position: "absolute",
    top: 0,
    right: -50,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#eee",
  },
  sender: {
    padding: 10,
    paddingRight: 20,
    backgroundColor: "#2B68E6",
    borderRadius: 20,
    marginLeft: 15,
    width: "80%",
    marginBottom: 15,
  },

  senderText: {
    left: 5,
    color: "white",
    fontWeight: "500",
    paddingTop: 40,
    paddingBottom: 40,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 10,
    width: "80%",
    position: "relative",
  },
  avatarLeft: {
    position: "absolute",
    top: 0,
    left: -50,
    alignItems: "center",
    justifyContent: "flex-end",
    width: 40,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    paddingTop: 40,
    paddingBottom: 40,
  },
  footer: {
    flexDirection: "row",
    padding: 15,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    zIndex: 50,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    borderWidth: 1,
    color: "grey",
    borderRadius: 30,
  },
});
