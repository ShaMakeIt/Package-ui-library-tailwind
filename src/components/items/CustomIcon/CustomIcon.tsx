import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface CustomIconProps {
  img?: string;
  icon?: any;
  className?: string;
  iconStyle?: any;
  fontAwesome?: boolean;
  defaultIcon?: string;
}

export const CustomIcon = ({
  icon,
  className,
  img,
  fontAwesome,
  iconStyle,
  defaultIcon = "fontawesome",
  ...rest
}: CustomIconProps) => {
  const forceFontAwesome = fontAwesome || defaultIcon === "fontawesome";

  if (img) {
    return <img src={img} className={className} alt="icon" />;
  }

  if (typeof icon === "string" || forceFontAwesome) {
    return (
      <FontAwesomeIcon
        icon={icon}
        className={className}
        style={iconStyle || {}}
        {...rest}
      />
    );
  }

  return icon;
};

export default CustomIcon;
