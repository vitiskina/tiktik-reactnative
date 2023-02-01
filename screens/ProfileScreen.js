import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Button,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import client from "../lib/sanity";
import { Video, AVPlaybackStatus } from "expo-av";
import { Dimensions } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import useAuthStore from "../store/authStore.ts";
import VideoCreated from "../components/VideoCreated";
import LogOutButton from "../components/LogOutButton";

WebBrowser.maybeCompleteAuthSession();

const window_width = Dimensions.get("window").width; //full width
const window_height = Dimensions.get("window").height; //full height

const ProfileScreen = () => {
  const { userProfile, addUser, removeUser } = useAuthStore();

  const [isWantLogOut, setIsWantLogOut] = React.useState(false);

  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState(null);

  const [userVideos, setUserVideos] = React.useState([]);
  const [userLikedVideos, setUserLikedVideos] = React.useState([]);

  const [isVideoCreateActive, setIsVideoCreateActive] = React.useState(true);
  const [isVideoLikedActive, setIsVideoLikedActive] = React.useState(false);

  const video = React.useRef(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "236317239084-u3fc4ecgm0nalt0l2asuvc93vtuofdd1.apps.googleusercontent.com",
  });

  useEffect(() => {
    client
      .fetch(
        `*[_type == "post"] | order(_createdAt desc){
      _id,
       caption,
         video{
          asset->{
            _id,
            url
          }
        },
        userId,
        postedBy->{
          _id,
          userName,
          image
        },
      likes,
      comments[]{
        comment,
        _key,
        postedBy->{
        _id,
        userName,
        image
      },
      }
    }`
      )
      .then((dt3) => {
        setUserVideos(dt3);
      });
  }, []);



  React.useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  async function getUserData() {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    userInfoResponse.json().then((data) => {
      setUserInfo(data);
      // console.log(data);
    });

    const user = {
      _id: userInfo.id,
      _type: "user",
      userName: userInfo.name,
      image: userInfo.picture,
    };

    addUser(user);

    CreateOrGetUser();
  }

  async function CreateOrGetUser() {
    const mutations = [
      {
        createIfNotExists: {
          _id: userInfo.id,
          _type: "user",
          userName: userInfo.name,
          image: userInfo.picture,
        },
      },
    ];

    await fetch(
      "https://ue93m5w3.api.sanity.io/v2022-03-10/data/mutate/production",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer sk7bpH7ZM1rQyJf3LmPa4Ts9dGtENEVnI8OmM2SS46QIxUMLvBdeNwfKGaRQeSHdYlHPMc2DzF2cbbM2sZXMAI6dQNoE9AHrP8UkhucSLShm8sZ6RYWe1ySmeot1IUFiVvS8gtuNtpY1c5hU99rIaXbShFeWbCCoHLnzh9nJlXeLibCrmhQB",
        },
        body: JSON.stringify({
          mutations,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  const [activeVideoIndex, setActiveVideoIndex] = React.useState(0);
  function showUserInfo() {
    if (userInfo) {
      return (
        <View>
          <View style={styles.userContainer}>
            <LogOutButton
              style={{
                alignSelf: "flex-end",
                marginRight: 5,
              }}
            />

            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 20,
              }}
              source={{ uri: userInfo.picture }}
            />
            <Text
              style={{
                marginBottom: 10,
              }}
            >
              @{userInfo.name.replace(/\s+/g, "")}
            </Text>

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              {userInfo.name}
            </Text>
          </View>

          <View style={styles.videoContainer}>
            <View style={styles.switchBtnContainer}>
              <TouchableOpacity
                onPress={getUserCreateVideo}
                style={[styles.switchBtn ,{ backgroundColor: isVideoCreateActive? "black": "white"}]}
              >
                <Text style={[styles.switchBtnText,{color: isVideoCreateActive? "white": "black"}]}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={getUserLikedVideo}
                style={[styles.switchBtn ,{ backgroundColor: isVideoLikedActive? "black": "white"}]}
              >
                <Text style={[styles.switchBtnText,{color: isVideoLikedActive? "white": "black"}]}>Liked</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userVideoList}>
              {isVideoCreateActive ? (
                <FlatList
                  pagingEnabled
                  data={userVideos}
                  renderItem={({ item, index }) => (
                    <VideoCreated
                      key={index}
                      videoUrl={item.video.asset.url}
                      userName={item.postedBy.userName}
                      profileImg={item.postedBy.image}
                      caption={item.caption}
                      isActive={activeVideoIndex === index}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  onScroll={(e) => {
                    const index = Math.floor(
                      e.nativeEvent.contentOffset.y / (window_height + 180)
                    );
                    setActiveVideoIndex(index);
                  }}
                />
              ) : (
                <FlatList
                  pagingEnabled
                  data={userLikedVideos}
                  renderItem={({ item, index }) => (
                    <VideoCreated
                      key={index}
                      videoUrl={item.video.asset.url}
                      userName={item.postedBy.userName}
                      profileImg={item.postedBy.image}
                      caption={item.caption}
                      isActive={activeVideoIndex === index}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  onScroll={(e) => {
                    const index = Math.floor(
                      e.nativeEvent.contentOffset.y / (window_height + 180)
                    );
                    setActiveVideoIndex(index);
                  }}
                />
              )}
            </View>
          </View>
        </View>
      );
    }
  }

  async function getUserCreateVideo() {
    setIsVideoCreateActive(true);
    setIsVideoLikedActive(false);

    // client
    //   .fetch(
    //     `*[ _type == 'post' && userId == '${userInfo.id}'] | order(_createdAt desc){
    //       _id,
    //        caption,
    //          video{
    //           asset->{
    //             _id,
    //             url
    //           }
    //         },
    //         userId,
    //       postedBy->{
    //         _id,
    //         userName,
    //         image
    //       },
    //    likes,
    //       comments[]{
    //         comment,
    //         _key,
    //         postedBy->{
    //         _id,
    //         userName,
    //         image
    //       },
    //       }
    //     }`
    //   )
    //   .then((data1) => {
    //     setUserVideos(data1);
    //     console.log(data1);
    //   });
  }

  async function getUserLikedVideo() {
    setIsVideoCreateActive(false);
    setIsVideoLikedActive(true);

    client
      .fetch(
        `*[_type == 'post' && '${userInfo.id}' in likes[]._ref ] | order(_createdAt desc) {
          _id,
           caption,
             video{
              asset->{
                _id,
                url
              }
            },
            userId,
          postedBy->{
            _id,
            userName,
            image
          },
       likes,
          comments[]{
            comment,
            _key,
            postedBy->{
            _id,
            userName,
            image
          },
          }
        }`
      )
      .then((data2) => {
        setUserLikedVideos(data2);
        console.log(data2);
      });
  }

  console.log(userProfile);

  return (
    <SafeAreaView style={styles.container}>
      {userProfile ? (
        showUserInfo()
      ) : (
        <View style={styles.loginContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.loginText}>Login to see your profile !</Text>
            <Image
              style={styles.welcomeImage}
              source={require("../assets/images/welcome.jpg")}
            />
          </View>
          <View>
            <Pressable
              onPress={
                accessToken
                  ? getUserData
                  : () => {
                      promptAsync({ showInRevents: true });
                    }
              }
              style={styles.buttonLogin}
            >
              <AntDesign name="google" size={24} color="white" />
              <Text style={styles.textBtnLogin}>
                {accessToken ? ` Confirm Login` : "Sign In with Google"}
              </Text>
            </Pressable>
            {userInfo && (
              <Pressable
                onPress={() => {
                  promptAsync({ showInRevents: true }).then(setIsVideoCreateActive(false)).then(setIsVideoLikedActive(false));
                }}
                style={[styles.buttonLogin, { marginTop: 10, alignItems: "center", justifyContent: "center" }]}
              >
                <AntDesign name="google" size={24} color="white" />
                <Text style={[styles.textBtnLogin, {textAlign: 'center'}]}>
                  Choose other account
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: "500",
  },
  userContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  userVideoList: {
    display: "flex",
    backgroundColor: "black",
  },
  buttonLogin: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginLeft: 60,
    marginRight: 60,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "#F51997",
    display: "flex",
    flexDirection: "row",
  },
  textBtnLogin: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    marginLeft: 10,
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  welcomeImage: {
    width: 360,
    height: 250,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 26,
    fontStyle: "bold",
  },
  switchBtnContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

  },
  switchBtn: {
    backgroundColor: "black",
    paddingVertical: 10,
    marginTop:10,
    flex:1
  },
  switchBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
});
export default ProfileScreen;
