import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { Video, AVPlaybackStatus } from "expo-av";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";

const window_width = Dimensions.get("window").width; //full width
const window_height = Dimensions.get("window").height; //full height

const VideoCreated = (props) => {
  const video = React.useRef(null);
  const [videoStatus, setVideoStatus] = React.useState({});

  const [isTouch, setIsTouch] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const showIconPausePlay = () => {
    setIsTouch((prev) => !prev);
    sleep(700).then(() => {
      setIsTouch((prev) => !prev);
    });
  };

  // console.log()
  return (
    <TouchableWithoutFeedback onPress={() => showIconPausePlay()}>
      <View style={styles.container}>

        {/* video */}
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: props.videoUrl,
          }}
          resizeMode="contain"
          isLooping
          isPlaying={props.isActive}
          shouldPlay={props.isActive}
          onPlaybackStatusUpdate={(videoStatus) =>
            setVideoStatus(() => videoStatus)
          }
        />
        <View style={styles.bottomText} >
        <Text style={styles.channelName}>@{props.userName}</Text>
        <Text style={styles.caption}>{props.caption}</Text>
        </View>
       

        <View
          style={[styles.stopPlayIcon, { display: isTouch ? "flex" : "none" }]}
        >
          {videoStatus.isPlaying ? (
            <FontAwesome5
              name="pause-circle"
              size={60}
              color="white"
              onPress={() => video.current.pauseAsync()}
            />
          ) : (
            <FontAwesome5
              name="play-circle"
              size={60}
              color="white"
              onPress={() => video.current.playAsync()}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: window_width,
    height: window_height+180,
    backgroundColor: "black",
    marginBottom:70
  },
  video: {
    width: window_width,
    height: 440,
  },

  channelName: {
    color: "white",
    fontWeight: "bold",
  },
  caption: {
    color: "white",

  },
  stopPlayIcon: {
    position: "absolute",
    marginTop: 200,
    left: 150,
  },
  bottomText:{
    position: "absolute",
    left:0,
    bottom:0,
    marginBottom:550,
 
    marginLeft:10,
  }
});

export default VideoCreated;
