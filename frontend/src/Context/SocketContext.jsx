import React from "react";
import Socket from "socket.io-client";

let socketiInstance;
//This file contains 3 functions
//1. socketInstance
//2. sendMessage
//3. receiveMessage

export const socketInstance = (projectId) => {
  //sending connection request from front end to backend server that is socket server
  socketiInstance = Socket(import.meta.env.VITE_API_URL, {
    auth: {
      token: localStorage.getItem("token"),
    },
    query: {
      projectId,
    },
  });
  console.log("Socket instance created");

  return socketiInstance;
};

export const sendMessage = (event, data) => {
  socketiInstance.emit(event, data);
};

export const receiveMessage = (event, data) => {
  socketiInstance.on(event, data);
};
