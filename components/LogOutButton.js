import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import React from "react";

import useAuthStore from "../store/authStore.ts";
import { MaterialIcons } from "@expo/vector-icons";
const LogOutButton = () => {
  const { userProfile, addUser, removeUser } = useAuthStore();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => removeUser()}>
        <MaterialIcons name="logout" size={24} color="black" />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 14,
  },
});

export default LogOutButton;
