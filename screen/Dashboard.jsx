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
  const [skipsRemaining, setSkipsRemaining] = useState(0);
  supabase.auth.onAuthStateChange((event, session) => {
    // if signed in move to dash
    if (event === "SIGNED_OUT") {
      console.log("User signed in successfully");
      navigation.navigate("Home");
    }
  });
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        console.error('Error logging out:', error.message);
      } else {
        alert('Logout successful');
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      // Handle any unexpected errors that might occur during the logout process
    }
  };
  useEffect(() => {
    // update count in db
    const updateCount = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .update({ count: skipsRemaining })
          .eq("username", send_id);
        if (error) {
          console.error("Error updating users:", error.message);
        } else {
          console.log("Users updated successfully:", data);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error.message);
      }
    };
    updateCount();
  }, [skipsRemaining]);
  const time_diff =async()=>{
    try {
      const { data, error } = await supabase
        .from('users')
        .select('datelogin,count')
        .eq('username', send_id);
      if (error) {
        console.error("Error fetching users:", error.message);
      }
      else {
        const date1 = new Date(data[0].datelogin);
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if(diffDays>1)
        {
          setSkipsRemaining(5);
          const { data, error } = await supabase
          .from('users')
          .update({ datelogin: new Date(), count: 5})
          .eq('username', send_id)
          .select();
        }
        else
          setSkipsRemaining(data[0].count);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
    }
  }

  
  useEffect(() =>
  {
    time_diff();
  },[send_id])
  

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
    <>
       <Text style={styles.loginButton} onPress={logout}>Logout</Text>

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
          Skip to Next User   ({skipsRemaining})
        </Text>
      </TouchableOpacity>
    </View>
    </>
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
    borderBottomWidth: 4,
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
    backgroundColor: "#FF1493",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "50%",
    alignSelf: "center",
  },
  loginButton: {
    backgroundColor: "#FF1493",
    borderRadius: 20,
    // paddingVertical: 1,
    // paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    color: "white",
    width: "25%",
    height: "7%",
    
    padding: "3.5%",
    alignSelf: "flex-end",
    marginRight: 10,
    fontSize: 18,

    
  },
});

export default UsersList;
