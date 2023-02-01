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
import React, { useEffect, useState } from "react";
import { Video, AVPlaybackStatus } from "expo-av";

const RecommendVideo = (props) => {
  const [topicVideos, setTopicVideos] = useState(props.topicVideos);
  const video = React.useRef(null);



  return (
    <View>
      {props.topicVideos.length > 0 && (
        <View>
          <Text>{props.topicName}</Text>
          <ScrollView horizontal="true" >
            <View>
            {props.topicVideos.map((item, index) => (
              <Video
                key={index}
                ref={video}
                style={{ height: 140, width: 95, marginLeft: 20 }}
                source={{
                  uri: item.video.asset.url,
                }}
                resizeMode="contain"
                isLooping
                isPlaying="false"
                shouldPlay="false"
              />
            ))}</View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default RecommendVideo;

const styles = StyleSheet.create({});
