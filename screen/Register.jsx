import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,Button,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { log } from "../assets/index.js";
import supabase from "../supa.js";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
var Register =({navigation})=> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const handleRegister = async () => {
    try {
      // Implement your registration logic here
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("username:", username);

      // Call the Supabase sign-up method

      const { user, session, error } = await supabase.auth.signUp({
        email,
        password,
        
      });
      // console.log("user", user);
      // console.log("session", session);

      // Check for errors
      if (error) {
        alert("Error signing up:", error.message);
        // alert
      } else {
        
        const { data, error } = await supabase
        .from('users')
        .insert([
          { username: username ,email: email, password: password},
        ])
        .select();
        
        alert("User registered successfully:", user);
        // console.log("Session details:", session);
        // navigation.navigate("Home");
        // You may want to navigate to another screen or perform additional actions here
      }
    } catch (error) {
      alert("An unexpected error occurred:", error.message);
      // Handle unexpected errors
    }
  };


  return (
    <View style={styles.container}>
      <Image style={styles.image} source={log} />
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      
     
      <TouchableOpacity style={{backgroundColor:"white"}} onPress={() => navigation.navigate('Home')}>
        <Text style={{color:"blue"} }>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
export default Register;

 var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
  loginText: {
    color: "white",
  },
});