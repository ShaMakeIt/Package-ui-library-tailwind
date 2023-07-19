import React, { Component, ReactNode } from "react";

import { FieldInputProps, FieldMetaState } from "react-final-form";
import CustomIcon from "../../items/CustomIcon/CustomIcon";
import FormItemLabel from "../../items/FormItemLabel/FormItemLabel";
import TextItem from "../../items/TextItems/TextItem";
import classNames from "classnames";

export type FieldWrapperOwnProps<FieldValue = any> = {
  input?: FieldInputProps<FieldValue>;
  meta?: FieldMetaState<FieldValue>;
  // say if the input has a value
  hasValue?: boolean;
  // Additional className to add
  className?: string;
  // Custom styling for the global field
  fieldWrapperClassName?: string;
  fieldWrapperStyle?: any;
  // Add border to the input
  withBorder?: boolean;
  // Add border to the field value
  withValueBorder?: boolean;
  // Custom styling for the content wrapper ( = content without icons)
  contentWrapperClassName?: string;
  contentWrapperStyle?: any;
  // Custom styling for the value
  valueClassName?: string;
  valueStyle?: any;
  // Center the value (not always applicable)
  centerValue?: boolean;
  // Decrease padding for the types with-border and with-value-border
  small?: boolean;
  // Remove all padding for types with-value-border
  noPadding?: boolean;
  // effect if active/focused
  effect?: boolean;
  // disabled or not
  disabled?: boolean;
  // shadow style for field
  shadow?: boolean;
  // Right icon
  iconRight?: string;
  iconRightStyle?: any;
  iconRightClassName?: string;
  iconRightAction?: () => void;
  // Left icon
  iconLeft?: string;
  iconLeftStyle?: any;
  iconLeftClassName?: string;
  iconLeftAction?: () => void;
  // Children to append
  children?: ReactNode;
  // Other children to display outside of the value
  secondChildren?: ReactNode;
  // Add class name on active effect
  effectActiveClassName?: string;
  // Overwrite bar color for active - error - valid
  activeBarColor?: string;
  errorBarColor?: string;
  validBarColor?: string;
  // add not string near label in italic
  notRequired?: string;
  // tabIndex
  tabIndex?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  ignoreTouched?: boolean;
  noShadow?: boolean;
  // for info message between label and input
  extraInfo?: string;
  extraInfoClassName?: string;
  isTextarea?: boolean;
};

export type FieldWrapperProps = FormItemLabelProps & FieldWrapperOwnProps;

interface FieldWrapperState {
  ();
}

export class FieldWrapper extends Component<
  FieldWrapperProps,
  FieldWrapperState
> {
  iconLeft = () => {
    const { iconLeft, iconLeftAction, iconLeftStyle, iconLeftClassName } =
      this.props;

    if (!iconLeft) return false;

    return (
      iconLeft && (
        <div
          onClick={iconLeftAction}
          className={classNames(
            "h-full absolute flex top-0 aligns-items-center justify-center left-0 width-form-lateralIcon",
            iconLeftAction && "cursor-pointer",
            iconLeftClassName
          )}
          style={iconLeftStyle}
        >
          {typeof iconLeft === "string" ? (
            <CustomIcon icon={iconLeft} />
          ) : (
            iconLeft
          )}
        </div>
      )
    );
  };

  iconRight = () => {
    const { iconRight, iconRightAction, iconRightStyle, iconRightClassName } =
      this.props;

    if (!iconRight) return false;

    return (
      iconRight && (
        <div
          onClick={iconRightAction}
          className={classNames(
            "h-full absolute flex top-0 aligns-items-center justify-center right-0 w-form-lateralIcon",
            iconRightAction && "cursor-pointer",
            iconRightClassName
          )}
          style={iconRightStyle}
        >
          {typeof iconRight === "string" ? (
            <CustomIcon icon={iconRight} />
          ) : (
            iconRight
          )}
        </div>
      )
    );
  };

  renderLabel = (noFontSize) => {
    const {
      extraInfo,
      extraInfoClassName,
      // content props
      lg,
      defaultLanguage,
      content,
      localeContent,
    } = this.props;

    const contentProps = {
      lg,
      content,
      defaultLanguage,
      localeContent,
    };

    return (
      <>
        <FormItemLabel
          {...this.props}
          noFontSize={noFontSize}
          className={classNames(
            !noFontSize && "color-success text-align-left margin-y-item"
          )}
        />
        {extraInfo && (
          <div
            className={classNames(
              "color-success text-align-left margin-y-item",
              extraInfoClassName
            )}
          >
            <TextItem {...contentProps} path={extraInfo} />
          </div>
        )}
      </>
    );
  };

  renderContent = (borderType: string) => {
    const {
      // value,
      contentWrapperClassName,
      contentWrapperStyle,
      statusBarClassName,
      disabledClassName,
      centerValue,
      valueClassName,
      valueStyle,
      children,
      secondChildren,
      // color
      errorBarColor,
      activeBarColor,
      validBarColor,
      disabled,
      effect,
      label,
      labelClassName,
      fieldsetClassName,
    } = this.props;

    if (borderType === "with-border") {
      return (
        <>
          {effect && label && (
            <fieldset className={classNames(fieldsetClassName)}>
              <legend className={classNames(labelClassName)}>
                {this.renderLabel(true)}
              </legend>
            </fieldset>
          )}
          {this.iconLeft()}
          <div
            className={classNames(
              "w-full relative",
              centerValue && "text-align-center justify-center",
              contentWrapperClassName,
              disabled && "opacity-80",
              disabled && disabledClassName
            )}
            style={contentWrapperStyle}
          >
            {this.renderLabel()}
            <div
              className={classNames("w-full", valueClassName)}
              style={valueStyle}
            >
              {children}
            </div>
            {secondChildren}
          </div>
          {this.iconRight()}
        </>
      );
    }
    if (borderType === "with-value-border") {
      return (
        <>
          {this.renderLabel()}
          <div
            className={classNames(
              "border-radius-default p-y-form p-y-formInput p-x-form",
              contentWrapperClassName,
              centerValue && "text-align-center justify-center",
              disabled && "colors-input-disabled",
              disabled && disabledClassName
            )}
            style={contentWrapperStyle}
          >
            {this.iconLeft()}
            <div
              className={classNames(
                "padding-y-form padding-x-form",
                valueClassName
              )}
              style={valueStyle}
            >
              {children}
            </div>
            {this.iconRight()}
          </div>
          {secondChildren}
        </>
      );
    }
    if (borderType === "with-border-bottom") {
      return (
        <>
          {this.iconLeft()}
          <div
            className={classNames(
              "w-full relative border-[1px] border-dark",
              contentWrapperClassName,
              centerValue && "text-center justify-center",
              disabled && "opacity-80",
              disabled && disabledClassName
            )}
            style={contentWrapperStyle}
          >
            {!effect && this.renderLabel()}
            <div
              className={classNames("w-full", valueClassName)}
              style={valueStyle}
            >
              {effect && this.renderLabel()}
              {children}
            </div>
          </div>
          {this.iconRight()}
          {secondChildren}
          <div
            className={classNames(
              "relative z-30 w-0 h-px bottom-0 left-0",
              statusBarClassName
            )}
            style={
              validBarColor
                ? { backgroundColor: validBarColor }
                : { backgroundColor: "bg-green-600" }
            }
          />
          <div
            className={classNames(
              "relative z-10 w-0 h-px bottom-0 left-0",
              statusBarClassName
            )}
            style={
              errorBarColor
                ? { backgroundColor: errorBarColor }
                : { backgroundColor: "bg-red-600" }
            }
          />
          <div
            className={classNames(
              "relative z-20 w-0 h-px bottom-0 left-0",
              statusBarClassName
            )}
            style={
              activeBarColor
                ? { backgroundColor: activeBarColor }
                : { backgroundColor: "bg-blue-600" }
            }
          />
        </>
      );
    }
    return false;
  };

  /**
   * Important consideration about structure
   *
   * 1. with border bottom (default)
   *
   * fieldWrapper => border bottom here
   *  iconLeft
   *  contentWrapper
   *    label
   *    value
   *  iconRight
   *
   * 2. with border
   *
   * fieldWrapper => border here
   *  iconLeft
   *  contentWrapper
   *    label
   *    value
   *  iconRight
   *
   * 3. with border bottom
   *
   * fieldWrapper
   *  label
   *  contentWrapper => border here
   *    iconLeft
   *    value
   *    iconRight
   */

  render() {
    const {
      input,
      hasValue,
      label,
      tabIndex,
      meta = {},
      effect,
      withBorder,
      withValueBorder,
      small,
      noPadding,
      shadow,
      noShadow,
      // Styling
      // global
      fieldWrapperClassName,
      fieldWrapperStyle,
      iconLeft,
      iconRight,
      effectActiveClassName,
      beforeInputText,
      disabled,
      ignoreTouched,
      onClick,
      flex,
      isTextarea,
    } = this.props;
    const { active, valid, error, touched } = meta;
    let borderType;
    if (withBorder) {
      borderType = "with-border";
    } else if (withValueBorder) borderType = "with-value-border";
    else borderType = "with-border-bottom";

    let inputHasValue = hasValue;
    if (inputHasValue === undefined) {
      inputHasValue = input && input.value;
    }

    return (
      <section
        className={classNames(
          "FieldWrapper",
          borderType,
          noShadow && "boxShadow-field-active",
          !label && "pt-0",
          small && "p-y-formInput pb-0",
          noPadding && "p-0",
          shadow && "",
          // meta related
          active && "",
          touched && valid && "",
          (touched || ignoreTouched) && error && !disabled && "",
          // effect
          effect && "",
          effect && (active || inputHasValue) && "",
          effect && (active || inputHasValue) && effectActiveClassName,
          iconLeft && "pl-width-form-lateralIcon",
          iconRight && "pr-width-form-lateralIcon",
          isTextarea && "",
          fieldWrapperClassName,
          beforeInputText && "flex aligns-items-center",
          flex && "flex aligns-items-center px-0"
        )}
        style={fieldWrapperStyle}
        tabIndex={tabIndex}
        onClick={onClick}
      >
        {this.renderContent(borderType)}
      </section>
    );
  }
}

export default FieldWrapper;
