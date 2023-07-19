import React, { useMemo } from "react";
import TextItem from "../TextItems/TextItem";
import CustomIcon from "../CustomIcon/CustomIcon";

export interface TooltipOwnProps {
  direction?: string;
  contentClassName?: string;
  children?: React.ReactNode;
  text?: string;
  item: React.ReactNode;
  icon?: string;
  iconClassName?: string;
  size?: string;
  displayArrow?: boolean;
  color?: string;
  className?: string;
  arrowStyle?: any;
}

export type TooltipProps = TooltipOwnProps & ContentProps;

// Use for rendering component in ToolTip
// element: component which display tooltip on hover
export const Tooltip = (props: TooltipProps) => {
  const {
    direction,
    className,
    contentClassName,
    children,
    arrowStyle,
    displayArrow,
    text,
    textReplace = {},
    item,
    icon,
    iconClassName,
    // content props
    lg,
    defaultLanguage,
    content,
    localeContent,
    ...rest
  } = props;

  const contentProps = useMemo(
    () => ({
      lg,
      content,
      defaultLanguage,
      localeContent,
    }),
    [lg, content, defaultLanguage, localeContent]
  );

  const element = useMemo(() => {
    if (item) return item;

    if (icon) {
      return (
        <span className={`${iconClassName ? iconClassName : ""}`}>
          <CustomIcon icon={icon} />
        </span>
      );
    }
    return null;
  }, [item, icon, iconClassName]);

  return (
    <Dropdown
      {...props}
      className={`${className ? className : ""}`}
      item={element}
      {...rest}
      noArrow={!displayArrow}
      center
      arrowStyle={arrowStyle}
      direction={direction}
      contentClass={` bg-colors-dark text-white p-2 text-xs text-left min-w-[130px] b-border-radius-default z-10 ${
        contentClassName ? contentClassName : ""
      }`}
      hover
    >
      <div>
        {text && (
          <TextItem {...contentProps} path={text} replace={textReplace} />
        )}
        {children}
      </div>
    </Dropdown>
  );
};

export default Tooltip;
