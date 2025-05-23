import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { handleParseMessage } from "../helper/messageParser";
import { runPlugin } from "../helper/plugins";
import { v4 as uuid } from "uuid";

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

export const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socket = useRef(null);
  const bottomRef = useRef(null);
  const senderName = window.localStorage.getItem("userName") || "You";

  console.log(chat)
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

  const sendMessage = async () => {
    if (message.trim()) {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const parsed = handleParseMessage(message);

      if (parsed.type === "plugin") {
        const userMsg = {
          id: uuid(),
          text: {
            name: senderName,
            time,
            message,
          },
          type: "text",
        };

        setChat((prev) => [...prev, userMsg]);
        socket.current.emit("send-message", userMsg);

        const pluginMsg = await runPlugin(parsed.plugin, parsed.arg);

        const pluginBubble = {
          id: uuid(),
          type: "plugin",
          text: {
            name: "Bot",
            time,
            message: pluginMsg,
          },
        };

        setChat((prev) => [...prev, pluginBubble]);
        socket.current.emit("send-plugin-message", pluginBubble); 
      } else {
        const msgData = {
          id: uuid(),
          text: {
            name: senderName,
            time,
            message,
          },
          type: "text",
        };
        socket.current.emit("send-message", msgData);
        setChat((prev) => [...prev, msgData]);
      }

      setMessage("");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <div className="flex-1 overflow-y-auto mt-12 hide-scrollbar">
        <span className="py-4 grid mx-auto">
          <p className="text-center text-xs border-b pb-2">
            Welcome to chat room
          </p>
        </span>
        {chat.map((msg, index) =>
          msg.type === "plugin" ? (
            <div key={index} className="mb-4">
              <div className="text-xs text-gray-500">
                {msg.text.name} • {msg.text.time}
              </div>
              <div className="mt-1 bg-yellow-100 border border-yellow-400 rounded p-2 max-w-sm">
                {msg.text.message.pluginName === "weather" && (
                  <div className="flex items-center gap-3">
                    <img
                      src={`https:${msg.text.message.pluginData.icon}`}
                      alt="weather icon"
                      className="w-10 h-10"
                    />
                    <div>
                      <p>
                        🌤️ Weather in{" "}
                        <strong>{msg.text.message.pluginData.city}</strong>,{" "}
                        {msg.text.message.pluginData.country}:
                      </p>
                      <p>
                        {msg.text.message.pluginData.temp}°C,{" "}
                        {msg.text.message.pluginData.desc}
                      </p>
                    </div>
                  </div>
                )}
                {msg.text.message.pluginName === "calc" && (
                  <p>
                    🧮 <strong>{msg.text.message.pluginData.expression}</strong>{" "}
                    ={" "}
                    {msg.text.message.pluginData.result ||
                      msg.text.message.pluginData.error}
                  </p>
                )}
                {msg.text.message.pluginName === "define" && (
                  <div>
                    📚 <strong>{msg.text.message.pluginData.word}</strong>{" "}
                    means:
                    <ul className="list-disc list-inside text-sm mt-1">
                      {msg.text.message.pluginData.meanings?.map((def, i) => (
                        <li key={i}>{def}</li>
                      )) || <li>Definition not found.</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ChatMessage
              key={index}
              isSender={msg.text.name === senderName}
              name={msg.text.name}
              time={msg.text.time}
              message={msg.text.message}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>

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
