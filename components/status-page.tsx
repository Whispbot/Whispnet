"use client";
import React from "react";
import * as Icons from "lucide-react";
import Icon from "./icon";
import { useRouter } from "next/navigation";

export type IconNames = keyof typeof Icons;

interface StatusPreset {
  icon: IconNames;
  name: string;
  subtext: string;
  color: string;
  reasons?: string[];
}

type StatusCodes = 400 | 401 | 403 | 404 | 500 | 503;

const PresetValues: Record<StatusCodes, StatusPreset> = {
  400: {
    icon: "AlertCircle",
    name: "Bad Request",
    subtext: "The request could not be understood by the server.",
    color: "red"
  },
  401: {
    icon: "Lock",
    name: "Unauthorized",
    subtext: "Authentication is required to access this resource.",
    color: "orange"
  },
  403: {
    icon: "ShieldX",
    name: "Forbidden",
    subtext: "You don't have permission to access this resource.",
    color: "orange"
  },
  404: {
    icon: "AlertTriangle",
    name: "Not Found",
    subtext: "That page or resource could not be found.",
    color: "red",
    reasons: [
      "You typed the URL wrong.",
      "The page has been moved.",
      "You do not have access to this resource."
    ]
  },
  500: {
    icon: "AlertTriangle",
    name: "Internal Server Error",
    subtext: "Something went wrong on our end. Please try again later.",
    color: "red",
    reasons: [
      "The API is down.",
      "A third party service failed.",
      "Our server ran into a problem."
    ]
  },
  503: {
    icon: "Power",
    name: "Service Unavailable",
    subtext: "The service is temporarily unavailable. Please try again later.",
    color: "red"
  }
};

const StatusPage = ({
  code,
  message = undefined,
  error_id = undefined
}: {
  code: keyof typeof PresetValues;
  message?: string | undefined;
  error_id?: string | undefined;
}) => {
  const { icon, name, subtext, color, reasons } = PresetValues[code];

  const textColor = {
    red: "text-red-500",
    orange: "text-orange-400"
  }[color];

  const bgColor = {
    red: "bg-red-400/20",
    orange: "bg-orange-400/20"
  }[color];

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex w-full h-[90vh] items-center justify-center">
      <p className="absolute text-[30vw] overflow-hidden text-primary opacity-5 w-full text-center font-bold pointer-events-none">
        {code}
      </p>
      <div className="flex flex-col items-center bg-faded w-1/4 rounded-xl shadow-xl backdrop-blur-md p-4 border border-custom py-8">
        <div className={`${bgColor} w-1/6 rounded-full p-4`}>
          <Icon className={`${textColor} w-full h-auto`} iconName={icon} />
        </div>
        <h1
          className={`${textColor} font-bold text-[5vh] text-wrap text-center leading-none mt-3`}
        >
          {name}
        </h1>
        <p className="text-secondary text-[1.8vh] text-center">
          {message || subtext}
        </p>
        {reasons && (
          <div className="w-5/6 p-2 mt-5 backdrop-blur-sm text-secondary">
            <p className="text-center">This could be due to:</p>
            <div className="border border-white/10 rounded-xl py-2 shadow">
              {reasons.map((r, i) => (
                <p key={i} className="pl-2 text-tertiary text-[1.5vh]">
                  • {r}
                </p>
              ))}
            </div>
          </div>
        )}
        {error_id && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(error_id);
            }}
            className="flex flex-row text-tertiary hover:text-primary duration-200 cursor-pointer mt-5 bg-black/10 
            p-1 px-2 rounded-md shadow-sm hover:shadow-md"
          >
            <Icon className="pr-1" iconName="Clipboard" />
            <p>{error_id}</p>
          </button>
        )}
        <button
          onClick={goBack}
          className="flex mt-5 bg-faded-secondary w-1/2 text-center justify-center py-2 rounded-md shadow-sm hover:shadow-md brightness-110 hover:brightness-125 duration-200 text-tertiary"
        >
          <Icon className="pr-2" iconName="ArrowLeft" />
          Back
        </button>
      </div>
    </div>
  );
};

export default StatusPage;
