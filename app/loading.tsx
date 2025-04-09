import Spinner from "@/components/spinner";
import React from "react";

const loading = () => {
  return (
    <div className="flex w-full h-[90vh] items-center justify-center">
      <Spinner />
    </div>
  );
};

export default loading;
