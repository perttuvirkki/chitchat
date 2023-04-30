import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import CustomListItem from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { Button, Image, Input } from "@rneui/themed";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { getDocs, collection, orderBy, query } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "chitchat",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <SimpleLineIcons
            name="logout"
            onPress={logOut}
            size={24}
          ></SimpleLineIcons>
        </View>
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
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24}></AntDesign>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddChat")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={24}></SimpleLineIcons>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const logOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", { id, chatName });
  };

  useFocusEffect(
    useCallback(() => {
      const getChats = async () => {
        const chatsCollectionRef = collection(db, "chats");

        const querySnapshot = await getDocs(
          query(chatsCollectionRef, orderBy("createdAt", "desc"))
        );
        const newChats = [];
        querySnapshot.forEach((doc) => {
          newChats.push({ id: doc.id, data: doc.data() });
        });
        setChats(newChats);
      };
      getChats();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {chats?.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
      <TouchableOpacity activeOpacity={0.5} style={styles.addchat}>
        <SimpleLineIcons
          onPress={() => navigation.navigate("AddChat")}
          name="plus"
          size={58}
        ></SimpleLineIcons>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>chitchat - Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2023 Pepetec</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  addchat: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: "white",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  footer: {
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#e7e7e7",
    padding: 15,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#7a7a7a",
  },
});
