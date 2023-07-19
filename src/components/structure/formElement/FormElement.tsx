import React, { ReactNode, useMemo } from "react";
import classNames from "classnames/bind";
import { FieldInputProps, FieldMetaState } from "react-final-form";
import { ContentProps } from "../../../types/common";
import CustomIcon from "../../items/CustomIcon/CustomIcon";
import TextItem from "../../items/TextItems/TextItem";

export type FormElementProps<FieldValue = any> = ContentProps & {
  input?: FieldInputProps<FieldValue>;
  meta?: FieldMetaState<FieldValue>;
  // Additional className
  className?: string;
  childClassName?: string;
  // Class for the error to override the error style
  errorClassName?: string;
  // Object for the error to override the error style
  errorStyle?: any;
  // Add basic margin or not
  noMargin?: boolean;
  // Hide error
  noError?: boolean;
  // Display error
  showError?: boolean;
  // Meta to about the input form
  // Rest of the form
  children?: ReactNode;
  outsideIconLeft?: string;
  outsideIconLeftClassName?: string;

  // warning
  warning?: string;
  warningClassName?: string;
  warningStyle?: object;

  // info
  info?: string;
  infoClassName?: string;
  infoStyle?: any;
};

export const FormElement = (props: FormElementProps) => {
  const {
    label,
    className,
    children,
    childClassName,
    errorClassName,
    errorStyle,
    noMargin,
    noError,
    showError,
    outsideIconLeft,
    outsideIconLeftClassName,
    outsideIconRight,
    outsideIconRightClassName,
    meta: { error, touched },
    ignoreTouched,
    warning,
    warningClassName,
    warningStyle,
    // info
    info,
    infoClassName,
    infoStyle,
    style,
    disabled,
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

  return (
    <section
      className={classNames(
        "FormElement",
        className,
        noMargin && "no-margin",
        !label && "no-label",
        outsideIconLeft && "with-icon-left",
        outsideIconRight && "with-icon-right"
      )}
      style={style}
    >
      {outsideIconLeft && (
        <div
          className={classNames("outside-icon-left", outsideIconLeftClassName)}
        >
          {typeof outsideIconLeft === "string" ? (
            <CustomIcon icon={outsideIconLeft} />
          ) : (
            outsideIconLeft
          )}
        </div>
      )}
      <div className={classNames("child-form-element", childClassName)}>
        {children}
        {!disabled &&
          (!noError || showError) &&
          error &&
          (touched || ignoreTouched) && (
            <div
              className={classNames("error-message", errorClassName)}
              style={errorStyle}
            >
              <TextItem
                {...contentProps}
                path={error?.error || error}
                defaultContent={error?.default}
                replace={error?.replace}
              />
            </div>
          )}
        {info && (
          <div
            className={classNames("info-message", infoClassName)}
            style={infoStyle}
          >
            <TextItem
              {...contentProps}
              path={info}
              defaultContent={info?.default}
              replace={info?.replace}
            />
          </div>
        )}
        {warning && (
          <div
            className={classNames("warning-message", warningClassName)}
            style={warningStyle}
          >
            <TextItem
              {...contentProps}
              path={warning}
              defaultContent={warning?.default}
              replace={warning?.replace}
            />
          </div>
        )}
      </div>
      {outsideIconRight && (
        <div
          className={classNames(
            "outside-icon-right",
            outsideIconRightClassName
          )}
        >
          {typeof outsideIconRight === "string" ? (
            <CustomIcon icon={outsideIconRight} />
          ) : (
            outsideIconRight
          )}
        </div>
      )}
    </section>
  );
};

export default FormElement;
