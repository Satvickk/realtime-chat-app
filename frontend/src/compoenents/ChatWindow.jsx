import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

// Component for displaying individual chat messages
const ChatMessage = ({ isSender, name, time, message }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div>
        <div
          className={`flex ${
            isSender ? "justify-end" : "justify-start"
          } items-center`}
        >
          <span className="font-semibold text-sm">{name}</span>
          <time className="text-xs text-gray-400 ml-2">{time}</time>
        </div>
        <div
          className={`max-w-xs px-4 py-2 mt-1 rounded-lg ${
            isSender ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-800"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

// Main Chat Window
export const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socket = useRef(null);
  const bottomRef = useRef(null);
  const senderName = window.localStorage.getItem("userName") || "You";

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("chat-history", (messages) => {
      setChat(messages);
    });

    socket.current.on("receive-message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (message.trim()) {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const msgData = { name: senderName, message, time };
      socket.current.emit("send-message", msgData);
      setMessage("");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col p-4">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto mt-12 hide-scrollbar">
        <span className="py-4 grid mx-auto">
          <p className="text-center text-xs border-b pb-2">
            Welcome to chat room
          </p>
        </span>
        {chat.map((msg, index) => (
          <ChatMessage
            key={index}
            isSender={msg.text.name === senderName}
            name={msg.text.name}
            time={msg.text.time}
            message={msg.text.message}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Sticky input form */}
      <div className="flex mt-4 lg:px-4">
        <input
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send »
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
