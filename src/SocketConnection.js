import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { backendURL } from './config';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = io.connect(backendURL, {
    autoConnection: false,
  });

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
