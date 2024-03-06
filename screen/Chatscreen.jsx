import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import supabase from "../supa";

const ChatScreen = ({ route }) => {
  const flatListRef = useRef();

  const { s_id, r_id } = route.params;
  // console.log("!!!!!!!!!!!!!!!!!!!!");
  // console.log("s_id", s_id);
  // console.log("r_id", r_id);
  // alert(s_id );

  const [messages, setMessages] = useState([]);
  const [messagelen, setMessagelen] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setsender] = useState(s_id);
  const [receiver, setreceiver] = useState(r_id);
  const [contentSize, setContentSize] = useState(0);

  const fetchMessages = async () => {
    try {
      // Fetch messages for the current user

      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, content, timestamp")

        .in("sender_id", [sender, receiver])
        .in("receiver_id", [receiver, sender])

        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        setMessages(data);
        setMessagelen(data.length);
        console.log("Messages fetched", messages);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMessages();

        console.log("Fetch messages completed");
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };
    fetchData();
     
  }, [messages]);

  useEffect(() => {
    flatListRef.current.scrollToEnd({ animated: true });
  }, [contentSize]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }

    try {
      // Store the new message in Supabase
      const { data, error } = await supabase.from("messages").upsert([
        {
          sender_id: sender,
          receiver_id: receiver, // Replace with the actual receiver's user ID
          content: newMessage,
        },
      ]);

      if (error) {
        console.error("Error sending message:", error.message);
      } else {
        // Update the local state with the new message
        setMessages((messages) => [
          ...messages,
          {
            id: messagelen,
            content: newMessage,
            sender_id: sender,
          },
        ]);
        setMessagelen(messagelen + 1);

        // Clear the input field
        setNewMessage("");
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.sender_id === sender
                ? styles.userMessage
                : styles.otherMessage
            }
          >
            <Text>{item.content}</Text>
          </View>
        )}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setContentSize(contentHeight);
        }}
      />

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 2,
    borderColor: "#CCCCCC",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatScreen;
