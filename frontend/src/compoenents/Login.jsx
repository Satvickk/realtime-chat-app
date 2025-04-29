import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userToken, setUserToken] = useState("");

  const handleUserName = (e) => setUserName(e.target.value);
  const handleUserToken = (e) => setUserToken(e.target.value);

  const handleSubmit = () => {
    if (!userName || !userToken) {
      alert("Incomplete Details");
    } else {
      window.localStorage.setItem("userName", userName);
      window.localStorage.setItem("userToken", userToken);
      navigate("/chat-room");
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="grid gap-6 p-8 rounded-xl shadow-md bg-gray-200">
        <p className="text-center text-lg">Login</p>
        <input
          className="h-10 w-60 px-2 border-b"
          type="text"
          value={userName}
          onChange={handleUserName}
          placeholder="Username"
        />
        <input
          type="text"
          className="h-10 w-60 px-2 border-b"
          placeholder="User Token"
          value={userToken}
          onChange={handleUserToken}
        />
        <button
          className="mt-8 px-3 py-2 rounded-md bg-gradient-to-b from-blue-500 to-blue-700 text-white"
          onClick={handleSubmit}
        >
          Login
        </button>
      </div>
    </div>
  );
}
