import React from "react";
import * as Icons from "lucide-react";

export type IconNames = keyof typeof Icons;

interface DynamicIconProps {
  iconName: IconNames;
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<DynamicIconProps> = ({
  iconName,
  size = 24,
  color = "currentColor",
  className
}) => {
  const IconComponent: any = Icons[iconName];

  if (!IconComponent) {
    return null;
  }

  if (
    typeof IconComponent === "function" ||
    typeof IconComponent === "object"
  ) {
    return <IconComponent size={size} color={color} className={className} />;
  }

  return null;
};

export default Icon;
