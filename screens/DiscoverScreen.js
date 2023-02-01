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
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import client from "../lib/sanity";

const DiscoverScreen = () => {
  const [allUsers, setAllUsers] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSent, setSearchSent] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  useEffect(() => {
    client.fetch(`*[_type == "user"]`).then((data) => {
      setAllUsers(data);
    });
  }, []);

  function handleSearch() {
    // console.log(searchTerm);
    let searchedAccounts = allUsers?.filter((user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResult(searchedAccounts);
    setSearchSent(searchTerm);
    console.log(searchResult);
    setSearchTerm("");
    setIsSearch(true);
  }
  // console.log(searchedAccounts)
  return (
    <View>
      <View
        style={{
          marginVertical: 15,
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            flexWrap: "wrap",
            width: 290,
            borderWidth: 0.5,
            borderColor: "gray",
            borderRadius: 8,
            padding: 5,
          }}
          onChangeText={setSearchTerm}
          value={searchTerm}
          placeholder="Type account name to search"
          autoFocus={true}
        />
        <Pressable onPress={handleSearch}>
          <FontAwesome name="search" size={28} color="black" />
        </Pressable>
      </View>
      <View>
        {isSearch ? (
          searchSent && searchResult.length > 0 ? (
            searchResult.map((user) => (
              <View
                key={user._id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                  marginLeft: 20,
                }}
              >
                <Image
                  style={{ height: 50, width: 50, borderRadius: 25 }}
                  source={{ uri: user.image }}
                />
                <Text
                  style={{ fontSize: 17, fontWeight: "500", marginLeft: 14 }}
                >
                  {user.userName}
                </Text>
              </View>
            ))
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 500,
                width: 260,
                marginLeft: 40,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                User not found! Check user name and try again!
              </Text>
            </View>
          )
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 500,
              width: 260,
              marginLeft: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Type account name into search bar to find user!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DiscoverScreen;
