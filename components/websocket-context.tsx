"use client";
import { useNotification } from "@/components/notification-context";
import { useSession } from "@/components/session-context";
import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

type SessionContextType = {
  connected: boolean;
  socket: typeof Socket | null;
  addEventListener: (eventName: string, callback: Function) => void;
  emit: (eventName: string, data: any) => void;
};

const SessionContext = createContext<SessionContextType>({
  connected: false,
  socket: null,
  addEventListener: () => {},
  emit: () => {}
});

export const WebsocketProvider = ({
  children,
  url
}: {
  children: React.ReactNode;
  url: string | undefined;
}) => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useSession();
  const notifications = useNotification();

  useEffect(() => {
    if (!user) return;
    if (!url) {
      console.error("Websocket URL is not defined");
      return;
    }

    const socketIo = io(url);

    socketIo.on("connect", () => {
      setConnected(true);
      if (window.location.hostname == "localhost")
        notifications.showNotification({
          title: "Websocket",
          message: "Connected to websocket server",
          iconName: "Unplug"
        });
    });

    socketIo.on("disconnect", () => {
      setConnected(false);
      if (window.location.hostname == "localhost")
        notifications.showNotification({
          title: "Websocket",
          message: "Disconnected from websocket server",
          iconName: "Unplug"
        });
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [url, user]);

  const addEventListener = (eventName: string, callback: Function) => {
    if (socket) {
      socket.on(eventName, callback);
    } else throw new Error("Socket not initialized");
  };

  const emit = (eventName: string, data: any) => {
    if (socket) {
      socket.emit(eventName, data);
    } else throw new Error("Socket not initialized");
  };

  return (
    <SessionContext.Provider
      value={{ socket, connected, addEventListener, emit }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useWebsocket = () => useContext(SessionContext);
