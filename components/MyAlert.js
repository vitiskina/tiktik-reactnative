import React, { useEffect, useState } from "react";
import {
      View,
      Text,
      TouchableOpacity,
      Alert,
      Pressable,
      StyleSheet,
      TextInput,
      ScrollView,
      Image,
    } from "react-native";
import { Dimensions } from "react-native";

const window_width = Dimensions.get("window").width; //full width
const window_height = Dimensions.get("window").height; //full height

const MyAlert = (props) => {
  return (
   <View style={styles.container}>
      <Text>{props.myAlert}</Text>
   </View>
  )
}

export default MyAlert

const styles=StyleSheet.create({
      container:{
            display:"absolute",
            left: window_width/2,
            top: window_height/2,
            height: 100,
            width: 100,
      }
})