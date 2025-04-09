"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const bs = "text-[1.6vh] text-secondary hover:brightness-125 duration-200";

const Footer = () => {
  const pathname: string = usePathname() ?? "";
  const [status, setStatus] = useState<
    "UP" | "HASISSUES" | "UNDERMAINTENANCE" | "ERR"
  >("UP");

  useEffect(() => {
    fetch("https://status.whisp.bot/summary.json")
      .then((response) => response.json())
      .then((data) => {
        const statusText = data.page.status;
        setStatus(statusText);
      })
      .catch((error) => {
        console.error("Error fetching status:", error);
        setStatus("ERR");
      });
  }, []);

  return (
    <footer
      className={`${
        pathname?.startsWith("/cad/") || pathname.startsWith("/panel")
          ? "hidden"
          : "flex"
      } flex-col items-center mt-[10vh] mb-[5vh]`}
    >
      <div className="flex flex-col sm:flex-row w-full px-[5vw] sm:px-[2vw] md:px-[5vw] lg:px-[15vw]">
        <div className="flex flex-col w-full sm:w-[40%] items-center justify-center">
          <Link
            href="/"
            className="flex flex-row font-bold text-[2.8vh] items-center justify-center"
          >
            <Image
              src="/favicon.ico"
              alt="ico"
              width={64}
              height={64}
              className="h-[4vh] w-auto mr-2"
            ></Image>
            <span>WHISP</span>
            <span className="text-purple-600">BOT</span>
          </Link>
          <p className="text-[1.4vh] text-tertiary">
            &copy; {new Date().getFullYear()} Whispbot. All rights reserved.
          </p>
          <a href="https://status.whisp.bot" className="mt-[10px] items-center">
            <div className="bg-secondary shadow-xl flex flex-row mx-auto items-center justify-center px-4 py-1 rounded-full border border-transparent hover:brightness-125 duration-200">
              <div
                className={`h-[1vh] w-auto aspect-square rounded-full ${
                  status === "UP"
                    ? "bg-green-400"
                    : status == "UNDERMAINTENANCE"
                    ? "bg-blue-400"
                    : "bg-red-400"
                }`}
              />
              <p className="text-[1.4vh] ml-[10px] text-primary font-semibold">
                {status == "UP"
                  ? "Operational"
                  : status == "HASISSUES"
                  ? "Downtime"
                  : status == "UNDERMAINTENANCE"
                  ? "Maintenance"
                  : "Error"}
              </p>
            </div>
          </a>
        </div>
        <div className="flex flex-row text-center sm:text-left w-full sm:w-[60%] pt-[2vh] sm:pt-0">
          <div className="flex flex-col w-1/3">
            <h1 className="text-primary text-[1.8vh]">Product</h1>
            <Link className={bs} href="/dashboard">
              • Dashboard
            </Link>
            <Link className={bs} href="/panel">
              • Mod Panel
            </Link>
            <Link className={bs} href="/cad">
              • CAD
            </Link>
          </div>
          <div className="flex flex-col w-1/3">
            <h1 className="text-primary text-[1.8vh]">Contact</h1>
            <Link className={bs} href="/support">
              • Discord
            </Link>
            <a className={bs} href="mailto:support@whisp.bot">
              • Email
            </a>
          </div>
          <div className="flex flex-col w-1/3">
            <h1 className="text-primary text-[1.8vh]">Legal</h1>
            <Link className={bs} href="/terms">
              • Terms
            </Link>
            <Link className={bs} href="/privacy">
              • Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
