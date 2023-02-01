import {
  Button,
  Image,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
} from "react-native";
import * as FileSystem from "expo-file-system";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Video, AVPlaybackStatus } from "expo-av";
import { SanityAssetDocument } from "@sanity/client";
import client from "../lib/sanity";
import useAuthStore from "../store/authStore";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";

// import { Picker } from "react-native";
// import {Picker} from '@react-native-picker/picker';

const NewVideoScreen = () => {
  const { userProfile, addUser, removeUser } = useAuthStore();
  // console.log(userProfile);
  const [newVideo, setNewVideo] = useState();
  const [uploadVideoScreen, setUploadVideoScreen] = useState();
  const [uploadVideoServer, setUploadVideoServer] = useState();
  const video = React.useRef(null);
  const [newVideo_id, setNewVideo_id] = useState();

  const [caption, setCaption] = React.useState();
  const [topic, setTopic] = useState();

  const [haveResult, setHaveResult] = React.useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [videoStatus, setVideoStatus] = React.useState({});
  const [isUpload, setIsUpload] = useState(false);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const showIconPausePlay = () => {
    setIsTouch((prev) => !prev);
    sleep(700).then(() => {
      setIsTouch((prev) => !prev);
    });
  };

  // const pickerRef = React.useRef();

  // function open() {
  //   pickerRef.current.focus();
  // }

  // function close() {
  //   pickerRef.current.blur();
  // }

  //setup data topic
  const dataTopic = [
    { label: "Development", value: "development" },
    { label: "Comedy", value: "comedy" },
    { label: "Gaming", value: "gaming" },
    { label: "Food", value: "food" },
    { label: "Dance", value: "dance" },
    { label: "Beauty", value: "beauty" },
    { label: "Animals", value: "animals" },
    { label: "Sports", value: "sports" },
  ];

  const [isDropFocus, setIsDropFocus] = useState(false);

  const renderLabel = () => {
    if (topic || isDropFocus) {
      return (
        <Text style={[styles.dropdownLabel, isDropFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const pickUploadVideo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    setHaveResult(true);
    console.log(result);
    setUploadVideoScreen(result.uri);
    setUploadVideoServer(result);
    console.log(uploadVideoServer);

    if (!result.cancelled) {
      setHaveResult(false);
    }

    // client.assets
    //   .upload(
    //     "file",
    //     FileSystem.getContentUriAsync(FileSystem.cacheDirectory),
    //     {
    //       contentType: "video",
    //       filename: result.uri,
    //     }
    //   )
    //   .then((newVideo) => {
    //     console.log("Upload Done!", newVideo);
    //   });
    const vid = await fetch(result.uri);
    const bytes = await vid.blob();

    await client.assets
      .upload("file", bytes, {
        filename: "video",
      })
      .then((newVideo) => {
        console.log("Upload Done!", newVideo);
        setNewVideo_id(newVideo?._id);

        // client.create(doc).then((res) => {
        //   console.log(res);
        //   return client
        //     .patch(res._id)
        //     .set({
        //       video: {
        //         _type: "file",
        //         asset: { _type: "reference", _ref: newVideo?._id },
        //       },
        //     })
        //     .commit();
        // });
      });
  };

  const handleUploadVideo = async () => {
    setIsUpload(true);
    const doc = {
      _type: "post",
      caption,
      video: {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: newVideo?._id,
        },
      },
      userId: userProfile?._id,
      postedBy: {
        _type: "postedBy",
        _ref: userProfile?._id,
      },
      topic,
    };
    if (caption && userProfile && topic) {
      client.create(doc).then((res) => {
        console.log(res);
        return client
          .patch(res._id)
          .set({
            video: {
              _type: "file",
              asset: { _type: "reference", _ref: newVideo_id },
            },
          })
          .commit();
      });
      setCaption("");
      setTopic("");
      setNewVideo_id("");
      setIsUpload(false);
    } else {
      console.log("Please fill all the field");
      setIsUpload(false);
    }
  };

  // console.log(caption);
  // console.log(topic);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* //show video */}
      {newVideo_id ? (
        <View>
          <TouchableWithoutFeedback onPress={() => showIconPausePlay()}>
            <Video
              ref={video}
              style={{ height: 400, width: 240 }}
              source={{
                uri: uploadVideoScreen,
              }}
              resizeMode="contain"
              isLooping
              isPlaying={true}
              shouldPlay={true}
              onPlaybackStatusUpdate={(videoStatus) =>
                setVideoStatus(() => videoStatus)
              }
            />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.stopPlayIcon,
              { display: isTouch ? "flex" : "none" },
            ]}
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
          {
            <Pressable
              style={{ position: "absolute", right: 20, top: 15 }}
              onPress={() => {
                setNewVideo_id(null);
              }}
            >
              <AntDesign name="closecircle" size={24} color="#f51975" />
            </Pressable>
          }
        </View>
      ) : (
        <Pressable onPress={pickUploadVideo}>
          <View
            style={{
              height: 240,
              width: 170,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "#f51975",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 14,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "#f51975",
              }}
            >
              Choose your video to upload
            </Text>
          </View>
        </Pressable>
      )}
      <View style={{flexDirection:'row', height:40, marginTop:20,}}>
        <Text style={{fontWeight:'bold', marginTop:4}}>Caption: </Text>
        <TextInput
          style={{marginBottom:10, flexWrap: 'wrap', width:144, borderWidth:0.5, borderColor:'gray', borderRadius:8, padding:5}}
          onChangeText={setCaption}
          value={caption}
          placeholder="Fill your video caption"
          autoFocus={false}

        />
      </View>

      <View style={{ marginTop: 10 }}>
        <View style={{flexDirection:'row'}}>
          {/* {renderLabel()} */}
          <Text style={{fontWeight:'bold', marginTop:4} }>Topic: </Text>
          <Dropdown
            style={[styles.dropdown, isDropFocus && { borderColor: "#f51975" }]}
            placeholderStyle={styles.dropdownPlaceholderStyle}
            selectedTextStyle={styles.dropdownSelectedTextStyle}
            inputSearchStyle={styles.dropdownInputSearchStyle}
            iconStyle={styles.dropdownIconStyle}
            data={dataTopic}
            search
            maxHeight={300}
            labelField="label"
            valueField="topic"
            placeholder={!isDropFocus ? topic : "..."}
            searchPlaceholder="Search..."
            value={topic}
            onFocus={() => setIsDropFocus(true)}
            onBlur={() => setIsDropFocus(false)}
            onChange={(item) => {
              setTopic(item.value);
              setIsDropFocus(false);
            }}
            
          />
        </View>
      </View>

      <Pressable onPress={handleUploadVideo}>
        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            height: 35,
            width: 120,
            backgroundColor: "#f51975",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            paddingHorizontal: 10,
            marginVertical:20
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            {isUpload ? "Uploading..." : "Upload Video"}
          </Text>
        </View>
      </Pressable>
      
   
    </View>
  );
};

export default NewVideoScreen;
const styles = StyleSheet.create({
  stopPlayIcon: {
    position: "absolute",
    top: 160,
    left: 90,
  },

  //dropdown style
  dropdown: {
    height: 30,
    width: 160,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownIcon: {
    marginRight: 5,
  },
  dropdownLabel: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  dropdownPlaceholderStyle: {
    fontSize: 14,
  },
  dropdownSelectedTextStyle: {
    fontSize: 14,
  },
  dropdownIconStyle: {
    width: 20,
    height: 20,
  },
  dropdownInputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
