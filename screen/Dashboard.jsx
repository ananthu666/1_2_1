import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import supabase from "../supa"; // Import your Supabase client

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [myid, setMid] = useState("");
  const [send_id, setSend_id] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skipsRemaining, setSkipsRemaining] = useState(5);


  

  useEffect(() => {
    const fetchmyid = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setMid(user.email);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error.message);
      }
    };
    fetchmyid();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users from Supabase
        const { data, error } = await supabase
          .from("users")
          .select("userid, username, email, password")
          .order("username", { ascending: true })
          .neq("email", myid);

        if (error) {
          console.error("Error fetching users:", error.message);
        } else {
          setUsers(data);
          console.log("Users fetched successfully:");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error.message);
      }

      try {
        let { data: users } = await supabase
          .from("users")
          .select("username")
          .eq("email", myid);
        setSend_id(users[0].username);
        // console.log(users[0].username);
      } catch (error) {
        console.error("An unexpected error occurred:", error.message);
      }
    };
    fetchUsers();
  }, [myid]);

  const handleUserPress = (userid) => {
    navigation.navigate("Chat", { s_id: send_id, r_id: userid ,userName:userid});
  };

  const handleSkip = () => {
    // Generate a random index
    if (skipsRemaining === 0) return alert("No more skips remaining");
    if (skipsRemaining < 0) return alert("No more skips remaining");
    else {
      const randomIndex = Math.floor(Math.random() * users.length);

      // Display the user at the random index
      setCurrentIndex(randomIndex);
      setSkipsRemaining(skipsRemaining - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => handleUserPress(users[currentIndex]?.username)}
      >
        <Text style={styles.userName}>{users[currentIndex]?.username}</Text>
        <Text style={styles.userEmail}>{users[currentIndex]?.email}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={{ color: "white" }}>
          Skip to Next User ({skipsRemaining})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
  },
  userContainer: {
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderBottomColor: "red",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 8,
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
  },
  skipButton: {
    backgroundColor: "blue",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default UsersList;
