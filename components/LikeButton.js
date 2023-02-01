import { View, Text, TouchableOpacity, Alert  } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import useAuthStore from "../store/authStore.ts";
import client from "../lib/sanity";
import { myUuid } from "../createUuid.ts";

const LikeButton = (props) => {
  // console.log(props.likes);
  // console.log(myUuid())
 
  const { userProfile, addUser, removeUser } = useAuthStore();
  // console.log(props.postId);
  // console.log(userProfile?._id);
  const [likes, setLikes] = useState(props.likes);
  const [likesLen, setLikesLen]= useState(likes?.length || 0)
 const [isLiked, setIsLiked] = useState();


  const [alreadyLiked, setAlreadyLiked] = useState(false);

  let filterLikes = props.likes?.filter(
    (item) => item._ref === userProfile?._id
  );

  useEffect(() => {
    if (filterLikes?.length > 0) {
      setAlreadyLiked(true);
    } else {
      setAlreadyLiked(false);
    }
  }, [filterLikes, props.likes]);

  async function handleLike() {
    if (userProfile) {
      await client
        .patch(props.postId)
        .setIfMissing({ likes: [] })
        .insert("after", "likes[-1]", [
          {
            _key: myUuid(),
            _ref: userProfile?._id,
          },
        ])
        .commit();
        setIsLiked(true)
        setLikesLen(likesLen + 1)

      console.log("like post done");
      // setAlreadyLiked(true);
    } else {
      console.log("please login");
    }
  }

  async function handleUnlike() {
    if (userProfile) {
      await client
        .patch(props.postId)
        .unset([`likes[_ref=="${userProfile?._id}"]`])
        .commit();
      console.log("unlike post done");
      // setAlreadyLiked(false);
      setIsLiked(false)
      setLikesLen(likesLen - 1)
    } else {
      console.log("please login");
    }
  }
  // console.log(isLiked)
  return (
    <View>
      {alreadyLiked || isLiked ? (
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
          onPress={handleUnlike}
        >
          <AntDesign name="heart" size={24} color="#f51975" />
          <Text style={{ color: "white", marginTop: 4 }}>
            {likesLen}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
          onPress={handleLike}
        >
          <AntDesign name="hearto" size={24} color="white" />
          <Text style={{ color: "white", marginTop: 4 }}>
            {likesLen}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LikeButton;
