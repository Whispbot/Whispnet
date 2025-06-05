"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
//id, username, display_name, avatar_url, role, created_at, updated_at
type User = {
  id: string | undefined;
  username: string | undefined;
  avatar: string | undefined;
  discriminator: string | undefined;
  public_flags: number | undefined;
  flags: number | undefined;
  banner: string | undefined;
  accent_color: number | undefined;
  global_name: string | undefined;
  banner_color: string | undefined;
  clan: string | undefined;
  mfa_enabled: boolean | undefined;
  locale: string | undefined;
  premium_type: number | undefined;
  token: string;
};

type SessionContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => void;
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  refreshUser: () => {}
});

export const SessionProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${
            window.location.hostname == "localhost"
              ? "http://localhost:3000"
              : "https://beta.api.whisp.bot"
          }/auth/me`,
          {
            credentials: "include"
          }
        );
        if (res.status == 200) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshUser = () => {
    setUser(null);
    setLoading(true);
  };

  return (
    <SessionContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
