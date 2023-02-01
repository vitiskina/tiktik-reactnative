import {
  StyleSheet,
  RefreshControl,
  Text,
  ScrollView,
  View,
  Button,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import client from "../lib/sanity";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Dimensions } from "react-native";

import useAuthStore from "../store/authStore.ts";

import { myUuid } from "../createUuid.ts";

const window_width = Dimensions.get("window").width; //full width
const window_height = Dimensions.get("window").height; //full height

const HomeScreen = () => {
  const { userProfile, addUser } = useAuthStore();

  const [allPost, setAllPost] = React.useState([]);

  const bottomTabHeight = useBottomTabBarHeight();

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
      .then((data) => {
        setAllPost(data);
      });
  }, []);
  //  console.log(allPost);

  

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
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
      .then((data) => {
        setAllPost(data);
        setRefreshing(false);
      });
  }, [refreshing]);

  const [activeVideoIndex, setActiveVideoIndex] = React.useState(0);

  


  return (
    <FlatList
      data={allPost}
      pagingEnabled
      renderItem={({ item, index }) => (
        <VideoCard
          videoUrl={item.video.asset.url}
          isActive={activeVideoIndex === index}
          userName={item.postedBy.userName}
          profileImg={item.postedBy.image}
          caption={item.caption}
          likes={item.likes}
          comments={item.comments}
          postId={item._id}
        />
      )}
      onScroll={(e) => {
        const index = Math.floor(
          e.nativeEvent.contentOffset.y / (window_height - 49)
        );
        setActiveVideoIndex(index);
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default HomeScreen;

