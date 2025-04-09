import Link from "next/link";
import React from "react";

const HeaderLink = ({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      className="flex px-[15px] text-[1.7vh] font-semibold h-full items-center duration-200 text-secondary hover:brightness-125"
      href={href}
    >
      {children}
    </Link>
  );
};

export default HeaderLink;
