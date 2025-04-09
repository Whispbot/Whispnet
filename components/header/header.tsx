"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderUser from "./header-user";
import { usePathname } from "next/navigation";
import HeaderLink from "./header-link";

const Header = () => {
  if (usePathname()?.startsWith("/panel")) return <></>;

  return (
    <div className="sticky top-0 w-full py-[1.5vh] z-[9999] backdrop-blur-sm">
      <div
        className="flex flex-row h-[3.5vh] px-[5vw] sm:px-[2vw] md:px-[5vw] lg:px-[15vw] 
                    md:bg-transparent"
      >
        <div className="flex flex-row w-1/2 sm:w-[20%]">
          <Link
            className="flex flex-row h-full items-center justify-center"
            href="/"
          >
            <Image
              className="flex aspect-square h-full w-auto"
              src="/favicon.ico"
              alt="icon"
              width={64}
              height={64}
            />
            <p className="flex items-center ml-[10px] h-full text-[2.2vh] font-bold text-primary">
              {process.env.NODE_ENV == "development"
                ? "DEV"
                : process.env.ENVIRONMENT == "PREVIEW"
                ? "BETA"
                : "WHISP"}
            </p>
          </Link>
        </div>
        <div className="hidden sm:flex flex-row w-[60%] items-center justify-center">
          <HeaderLink href="/article">Articles</HeaderLink>
          <HeaderLink href="https://docs.whisp.bot">Documentation</HeaderLink>
          <HeaderLink href="https://status.whisp.bot">Status</HeaderLink>
          <HeaderLink href="/support">Support</HeaderLink>
        </div>
        <div className="flex flex-row-reverse w-1/2 sm:w-[20%]">
          <HeaderUser />
        </div>
      </div>
    </div>
  );
};

export default Header;
