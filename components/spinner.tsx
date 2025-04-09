import React from "react";
import Icon from "./icon";

const Spinner = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Icon iconName="LoaderCircle" className="animate-spin" />
    </div>
  );
};

export default Spinner;
