import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Picker,
} from "react-native";
import React, { useState } from "react";
import {
  Video,
  AVPlaybackStatus,
  VideoNaturalSize,
  VideoNativeProps,
} from "expo-av";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";
import LikeButton from "./LikeButton";
import Comment from "./Comment";
import useAuthStore from "../store/authStore.ts";
import client from "../lib/sanity";
import {myUuid} from '../createUuid.ts'


const window_width = Dimensions.get("window").width; //full width
const window_height = Dimensions.get("window").height; //full height

const VideoCard = (props) => {
  const { userProfile, addUser, removeUser } = useAuthStore();
  // console.log(userProfile)

  const video = React.useRef(null);
  const [videoStatus, setVideoStatus] = React.useState({});
  const [likes, setLikes] = React.useState(props.likes);
  const [comments, setComments] = React.useState(props.comments);
  const [isTouch, setIsTouch] = useState(false);
  const [postId, setPostId] = useState(props.postId);

  

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const showIconPausePlay = () => {
    setIsTouch((prev) => !prev);
    sleep(700).then(() => {
      setIsTouch((prev) => !prev);
    });
  };


  // console.log(VideoNaturalSize);
  return (
    <TouchableWithoutFeedback onPress={() => showIconPausePlay()}>
      <View style={[styles.container, { height: window_height - 49 }]}>
        <StatusBar style="light" />
        {/* video */}
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: props.videoUrl,
          }}
          resizeMode="contain" //"cover" "contain" "stretch"
          VideoNaturalSize={true}
          isLooping
          isPlaying={props.isActive}
          shouldPlay={props.isActive}
          onPlaybackStatusUpdate={(videoStatus) =>
            setVideoStatus(() => videoStatus)
          }
        />

        <View style={styles.bottomSection}>
          <View style={styles.bottomLeftSection}>
            <Text style={styles.channelName}>@{props.userName}</Text>
            <Text style={styles.caption}>{props.caption}</Text>
          </View>
        </View>
        <View style={styles.verticalBar}>
          <View style={styles.verticalBarItem}>
            <Image style={styles.avatar} source={{ uri: props.profileImg }} />
          </View>
          <View style={styles.verticalBarItem}>
            <LikeButton
            key={props.postId}
              likes={likes}
              postId={props.postId}
              // handleLike={()=>handleLike()}
              // handleDislike={()=>handleDislike()}
            />

    
          </View>
         
          <View style={styles.verticalBarItem}>
          <Comment
            key={props.postId}
           comments={comments}
           postId={props.postId}
          />
            
          </View>
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
    backgroundColor: "black",
  },
  video: {
    flex: 1,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 65,
  },
  bottomLeftSection: {
    flex: 4,
  },
  bottomRightSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  channelName: {
    color: "white",
    fontWeight: "bold",
  },
  caption: {
    color: "white",
    marginVertical: 8,
  },

  verticalBar: {
    position: "absolute",
    right: 8,
    bottom: 50,
  },
  verticalBarItem: {
    marginBottom: 24,
    alignItems: "center",
  },
  verticalBarIcon: {
    width: 32,
    height: 32,
  },
  verticalBarText: {
    color: "white",
    marginTop: 4,
  },
  avatarContainer: {
    marginBottom: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  followButton: {
    position: "absolute",
    bottom: -8,
  },
  followIcon: {
    width: 21,
    height: 21,
  },
  floatingMusicNote: {
    position: "absolute",
    right: 40,
    bottom: 16,
    width: 16,
    height: 16,
    tintColor: "white",
  },
  stopPlayIcon: {
    position: "absolute",
    top: window_height / 2 - 50,
    left: 150,
  },
});

export default VideoCard;
