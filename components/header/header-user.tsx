"use client";
import Icon from "@/components/icon";
import { useSession } from "@/components/session-context";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const HeaderUser = () => {
  const { loading, user } = useSession();
  const [display_dropdown, set_display_dropdown] = useState(false);

  const close = () => {
    set_display_dropdown(false);
  };

  if (user && !loading) {
    return (
      <div className="relative">
        {display_dropdown && (
          <div className="absolute right-0 top-[calc(100%+10px)] w-[280px] rounded-lg border border-custom bg-faded-secondary backdrop-blur-xl p-2 shadow-lg z-[1000]">
            <Link
              href="/me"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-[rgba(255,255,255,0.1)]"
              onClick={close}
            >
              <Image
                className="rounded-full"
                src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.webp?size=64`}
                alt="pfp"
                width={40}
                height={40}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {user?.username}
                </span>
                <div className="flex flex-row">
                  {/* {(user?.permission || 0) > 0 && (
                    <>
                      <span className="text-xs text-gray-400">
                        {
                          { 1: "Support", 2: "Management", 3: "Developer" }[
                            user?.permission || 1
                          ]
                        }
                      </span>
                      <span className="ml-[3px] mr-[2px] text-xs text-gray-400">
                        •
                      </span>
                    </>
                  )} */}
                  <span className="text-xs text-gray-400">View Profile</span>
                </div>
              </div>
            </Link>
            <div className="h-[1px] bg-[rgba(255,255,255,0.1)] my-2" />
            <Link
              href="/dashboard"
              onClick={close}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-[rgba(255,255,255,0.1)] text-white text-sm"
            >
              <Icon iconName="Home" className="h-[18px]" />
              Dashboard
            </Link>
            <Link
              href="/panel"
              onClick={close}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-[rgba(255,255,255,0.1)] text-white text-sm"
            >
              <Icon iconName="Hammer" className="h-[18px]" />
              Mod Panel
            </Link>
            <Link
              href="/cad"
              onClick={close}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-[rgba(255,255,255,0.1)] text-white text-sm"
            >
              <Icon iconName="Laptop2" className="h-[18px]" />
              CAD
            </Link>
            {/* {(user?.permission || 0) > 0 && (
              <>
                <div className="h-[1px] bg-[rgba(255,255,255,0.1)] my-2" />
                <Link
                  href="/admin"
                  onClick={close}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-[rgba(255,255,255,0.1)] text-white text-sm"
                >
                  <Icon iconName="Microscope" className="h-[18px]" />
                  Admin
                </Link>
                {(user?.permission || 0) == 3 && (
                  <Link
                    href="/admin/database/view"
                    onClick={close}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-[rgba(255,255,255,0.1)] text-white text-sm"
                  >
                    <Icon iconName="HardDrive" className="h-[18px]" />
                    Database
                  </Link>
                )}
              </>
            )} */}
            <div className="h-[1px] bg-[rgba(255,255,255,0.1)] my-2" />
            <Link
              href="https://api.whisp.bot/auth/logout"
              onClick={close}
              className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[rgba(255,255,255,0.1)] text-red-400 text-sm"
            >
              <Icon iconName="LogOut" className="h-[18px]" />
              Logout
            </Link>
          </div>
        )}
        <div className="size-full flex flex-row-reverse py-[0.1vh]">
          <button
            className="h-full w-auto aspect-square duration-200 rounded-full bg-secondary hover:brightness-125 cursor-pointer"
            onClick={() => set_display_dropdown(!display_dropdown)}
          >
            {user?.avatar ? (
              <Image
                className="flex size-full overflow-hidden rounded-full"
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=64`}
                alt="pfp"
                width={64}
                height={64}
              />
            ) : null}
          </button>
          <Link
            href="/dashboard"
            className="h-full w-[25vw] sm:w-[15vw] md:w-[10vw] lg:w-[8vw] rounded-md bg-secondary duration-200 
            hover:brightness-125 mr-[15px] text-[1.7vh] font-semibold flex items-center 
            justify-center text-secondary"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  } else if (!user && loading) {
    return (
      <div className="size-full flex flex-row-reverse py-[0.1vh]">
        <div className="h-full w-auto aspect-square rounded-full bg-secondary opacity-50"></div>
        <div className="h-full w-[7vw] rounded-md bg-secondary mr-[15px] opacity-50"></div>
      </div>
    );
  } else {
    return (
      <div className="size-full flex flex-row-reverse py-[0.1vh]">
        <Link
          href="https://beta.api.whisp.bot/auth"
          className="h-full w-[7vw] rounded-md bg-secondary duration-200 hover:brightness-125 text-[1.7vh] font-semibold flex items-center justify-center"
        >
          Login
        </Link>
      </div>
    );
  }
};

export default HeaderUser;
