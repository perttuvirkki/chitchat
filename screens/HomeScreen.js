import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
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
import { getDocs, collection } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "chitchat",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Button title="logout" onPress={logOut} />
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

  const enterChat = (id, chatName, chatImage) => {
    navigation.navigate("Chat", { id, chatName, chatImage });
  };

  useFocusEffect(
    useCallback(() => {
      const getChats = async () => {
        const querySnapshot = await getDocs(collection(db, "chats"));
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
    <View>
      <ScrollView>
        {chats?.map(({ id, data: { chatName, chatImage } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
            chatImage={chatImage}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({ container: {} });
