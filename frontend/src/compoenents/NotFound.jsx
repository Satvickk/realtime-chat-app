import React from "react";
import { Link } from "react-router-dom";

const getCurrentRoute = () => {
  const isLoggedIn = window.localStorage.getItem("userToken");
  return isLoggedIn ? "/chat-room" : "/";
};

export function NotFound() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <p>
        Not Found | Go back to{" "}
        <Link className="text-blue-500 font-bold" to={getCurrentRoute()}>
          Home
        </Link>
      </p>
    </div>
  );
}
