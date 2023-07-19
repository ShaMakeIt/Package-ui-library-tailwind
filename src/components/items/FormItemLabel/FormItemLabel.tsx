import React, { useMemo } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import { FieldInputProps } from "react-final-form";
import TextItem from "../TextItems/TextItem";

export type FormItemLabelProps<FieldValue = any> = {
  input?: FieldInputProps<FieldValue>;
  className?: string;
  // Label
  label?: string;
  // Label icon
  labelIcon?: string;
  labelStyle?: any;
  labelClassName?: string;
  labelIconStyle?: any;
  labelIconClassName?: string;
  labelImage?: string;
  star?: boolean;
  notRequired?: string;
  tooltipClassName?: string;
  tooltipContentClassName?: string;
  labelInfoClassName?: string;
  labelInfoHtml?: string;
  starClassName?: string;
  labelHtml?: string;
  labelInfo?: string;
  labelTooltip?: string;
  noFontSize?: boolean;
  iconInfo?: any;
} & ContentProps;

export const FormItemLabel = (props: FormItemLabelProps) => {
  const {
    className,
    label,
    labelClassName,
    labelStyle,
    labelIcon,
    labelImage,
    labelIconClassName,
    tooltipClassName,
    tooltipContentClassName,
    labelIconStyle,
    star,
    labelInfoClassName,
    labelInfoHtml,
    input,
    starClassName,
    labelHtml,
    labelInfo,
    notRequired,
    labelTooltip,
    noFontSize,
    iconInfo,
    // content props
    lg,
    defaultLanguage,
    content,
    localeContent,
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

  const renderedLabel = useMemo(() => {
    const info = labelInfo || notRequired;

    return (
      <label
        htmlFor={input && input.name}
        className={`block text-input-label uppercase fontSize-label fontWeight-formLabel ${
          noFontSize ? "fontSize-default" : ""
        } ${star ? "required" : ""} ${className} ${labelClassName} ${
          labelTooltip ? "has-tooltip" : ""
        }`}
        style={labelStyle}
      >
        {labelIcon && (
          <div
            className={`label-icon ${labelIconClassName} mr-1`}
            style={labelIconStyle}
          >
            {typeof labelIcon === "string" ? (
              <CustomIcon icon={labelIcon} />
            ) : (
              labelIcon
            )}
          </div>
        )}
        {labelImage && (
          <img
            className={`label-icon ${labelIconClassName} mr-1`}
            style={labelIconStyle}
            src={labelImage}
            alt={label}
          />
        )}
        <TextItem {...contentProps} path={label} isHtml={!!labelHtml} />
        {star && <span className={`star ${starClassName} text-error`}>*</span>}
        {info && (
          <TextItem
            {...contentProps}
            className={`info ${labelInfoClassName} text-xs ml-2 italic`}
            path={info}
            isHtml={!!labelInfoHtml}
          />
        )}
        {labelTooltip &&
          (iconInfo || (
            <AiOutlineExclamationCircle className="icon-label-tooltip ml-1" />
          ))}
      </label>
    );
  }, [
    contentProps,
    label,
    className,
    labelClassName,
    iconInfo,
    labelTooltip,
    labelImage,
    labelHtml,
    labelIconClassName,
    labelIconStyle,
    labelIcon,
    labelInfoHtml,
    input,
    labelInfo,
    labelInfoClassName,
    labelStyle,
    noFontSize,
    notRequired,
    star,
    starClassName,
  ]);

  if (!label) return null;

  if (labelTooltip) {
    return (
      <Tooltip
        {...contentProps}
        item={renderedLabel}
        direction="right"
        className={tooltipClassName}
        contentClassName={tooltipContentClassName}
      >
        <TextItem {...contentProps} path={labelTooltip} />
      </Tooltip>
    );
  }

  return renderedLabel;
};

export default FormItemLabel;
