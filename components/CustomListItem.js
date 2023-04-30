import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Avatar } from "@rneui/base";

const CustomListItem = ({ id, chatName, enterChat }) => {
  return (
    <TouchableOpacity
      onPress={() => enterChat(id, chatName)}
      key={id}
      style={styles.container}
    >
      <Avatar />
      <View style={styles.content}>
        <Text style={styles.title} ellipsizeMode="tail">
          {chatName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flex: 1, // Add this to make the content take the remaining available space
  },
  title: {
    fontWeight: "800",
    fontSize: 18,
  },
});
