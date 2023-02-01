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
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { BottomSheet } from "react-native-btr";
import NoResult from "./NoResult";
import MyAlert from "./MyAlert";
import { myUuid } from "../createUuid.ts";
import client from "../lib/sanity";
import useAuthStore from "../store/authStore.ts";


const Comment = (props) => {
  const [visible, setVisible] = useState(false);
  const [comments, setComments] = useState(props.comments);
  const [comment, setComment] = useState();
  const [newComment, setNewComment] = useState();
  const [isPosting, setIsPosting] = useState(false);
  const [commentsLen, setCommentsLen] = useState(comments?.length);

  const { userProfile, addUser, removeUser } = useAuthStore();

  //   console.log(comments);
  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  // console.log(props.postId);
  async function addComment() {
    setIsPosting(true);
    if (userProfile && comment != null) {
      await client
        .patch(props.postId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: myUuid(),
            postedBy: {
              _type: "postedBy",
              _ref: userProfile?._id,
            },
          },
        ])
        .commit();
      // setComments([

      // ]);
      setCommentsLen(commentsLen + 1);
      setNewComment(comment);
      // console.log(newComment);
      // console.log("comment added");
      setComment("");
      setIsPosting(false);
    } else {
      console.log("please login");
      setComment("");
    }
  }

  const showCommentRealTime = () => {
    return (
      newComment && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Image
            style={{
              width: 45,
              height: 45,
              borderRadius: 25,
              marginTop: 10,
              marginLeft: 10,
            }}
            source={{
              uri: userProfile.image,
            }}
          />
          <View
            style={{
              justifyContent: "center",
              marginLeft: 15,
              marginTop: 10,
            }}
          >
            <Text style={{ color: "black", fontWeight: "bold" }}>
              {userProfile.userName}
            </Text>
            <Text style={{ color: "black" }}>{newComment}</Text>
          </View>
        </View>
      )
    );
  };

  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Pressable onPress={toggleBottomNavigationView}>
          <FontAwesome name="commenting-o" size={24} color="white" />
        </Pressable>

        <Text style={{ color: "white", marginTop: 10 }}>
          {commentsLen || 0}
        </Text>
      </View>

      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}
        <View style={styles.bottomNavigationView}>
          <ScrollView
            ref={(ref) => {
              this.scrollView = ref;
            }}
            onContentSizeChange={() =>
              this.scrollView.scrollToEnd({ animated: true })
            }
          >
            {comments ? (
              comments.map((item, inx) => (
                <View
                  key={inx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Image
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 25,
                      marginTop: 10,
                      marginLeft: 10,
                    }}
                    source={{
                      uri: item.postedBy.image,
                    }}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: 15,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ color: "black", fontWeight: "bold" }}>
                      {item.postedBy.userName}
                    </Text>
                    <Text style={{ color: "black" }}>{item.comment}</Text>
                  </View>
                </View>
              ))
            ) : (
              (null)
            )}
            {showCommentRealTime()}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <TextInput
              style={{
                borderColor: "gray",
                borderWidth: 1,
                width: 230,
                height: 40,
                borderRadius: 16,
                paddingLeft: 16,
                marginRight: 10,
              }}
              onChangeText={setComment}
              value={comment}
              placeholder="Add your comment"
              autoFocus={true}
              caretHidden={true}
            />
            <Pressable
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#f51975",
                borderWidth: 1,
                width: 75,
                height: 40,
                backgroundColor: "#f51975",
                borderRadius: 16,
              }}
              onPress={addComment}
            >
              <Text style={{ fontWeight: "bold", color: "white" }}>
                {isPosting ? "Posting" : "Post"}
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Comment;
const styles = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 345,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
});
