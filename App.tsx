import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DiscoverScreen from "./screens/DiscoverScreen";
import ChatScreen from "./screens/ChatScreen";
import NewVideoScreen from "./screens/NewVideoScreen";

export default function App() {
  const BottomTab = createBottomTabNavigator();
  // console.log(allPost[0].video.asset.url);
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      
        <NavigationContainer>
          <BottomTab.Navigator
            screenOptions={{

              tabBarStyle: { backgroundColor: "black" },
              headerShown: false,
              tabBarActiveTintColor: "white",
            }}
          >
            <BottomTab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarLabel:() => null,
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require("./assets/images/home.png")}
                    style={[
                      styles.bottomTabIcon,
                      focused && styles.bottomTabIconFocused,
                    ]}
                  />
                ),
              }}
            />

            <BottomTab.Screen
              name="Discover"
              component={DiscoverScreen}
              options={{
                tabBarLabel:() => null,
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require("./assets/images/search.png")}
                    style={[
                      styles.bottomTabIcon,
                      focused && styles.bottomTabIconFocused,
                    ]}
                  />
                ),
              }}
            />

            <BottomTab.Screen
              name="NewVideo"
              component={NewVideoScreen}
              options={{
                tabBarLabel:() => null,
                tabBarIcon: ({ focused }) => (
                  <Image
                  source={require("./assets/images/newVideo.png")}
                    style={[
                      styles.newVideoButton,
                    ]}
                  />
                ),
              }}
            />

            <BottomTab.Screen
              name="Inbox"
              component={ChatScreen}
              options={{
                tabBarLabel:() => null,
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require("./assets/images/message.png")}
                    style={[
                      styles.bottomTabIcon,
                      focused && styles.bottomTabIconFocused,
                    ]}
                  />
                ),
              }}
            />

            <BottomTab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarLabel:() => null,
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require("./assets/images/user.png")}
                    style={[
                      styles.bottomTabIcon,
                      focused && styles.bottomTabIconFocused,
                    ]}
                  />
                ),
              }}
            />
          </BottomTab.Navigator>
        </NavigationContainer>
 
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  bottomTabIcon: {
    width: 25,
    height: 25,
    tintColor: "white",
  },
  bottomTabIconFocused: {
    tintColor: "#f51975",
  },
  newVideoButton: {
    width: 40,
    height: 24,
  },
});
