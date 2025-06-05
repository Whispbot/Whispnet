"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import Icon from "./icon";
import Image from "next/image";

interface Notification {
  id: string;
  title: string;
  message: string;
  iconUrl?: string;
  iconName?: string;
  visible?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (params: {
    title: string;
    message: string;
    iconUrl?: string;
    iconName?: string;
    duration?: number;
  }) => string;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    ({
      title,
      message,
      iconUrl,
      iconName,
      duration = 10000
    }: {
      title: string;
      message: string;
      iconUrl?: string;
      iconName?: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2);
      setNotifications((prev) => [
        ...prev,
        { id, title, message, iconUrl, iconName, visible: false }
      ]);

      requestAnimationFrame(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, visible: true }
              : notification
          )
        );
      });

      setTimeout(() => hideNotification(id), duration);

      return id;
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, visible: false }
          : notification
      )
    );
    setTimeout(
      () =>
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        ),
      300
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg backdrop-blur-md bg-faded-secondary border border-custom shadow-lg 
                     transition-all transform duration-300 relative max-w-sm text-primary flex items-start gap-3
                     ${
                       notification.visible
                         ? "translate-x-0 opacity-100"
                         : "translate-x-[120%] opacity-0"
                     }`}
          >
            {notification.iconUrl ? (
              <Image
                src={notification.iconUrl}
                alt=""
                width={24}
                height={24}
                className="flex-shrink-0 rounded-full"
              />
            ) : notification.iconName ? (
              <Icon
                iconName={notification.iconName as any}
                className="w-6 h-6 flex-shrink-0"
              />
            ) : null}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium mb-1">{notification.title}</h4>
              <p className="text-sm text-secondary pr-6">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => hideNotification(notification.id)}
              className="absolute top-2 right-2 text-tertiary hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
