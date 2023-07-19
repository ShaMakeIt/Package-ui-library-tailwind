import * as React from "react";
import mobileAndTabletCheck from "../../../helpers/browser/mobileAndTableCheck";

export type CustomDropdownProps<Key extends string = string> = {
  decal?: boolean;
  active?: boolean;
  forceClose?: boolean;
  toggleContent?: boolean;
  actionContent?: () => void;
  action?: () => void;
  label?: React.ReactNode;
  item?: React.ReactNode;
  arrowColor?: string;
  className?: string;
  direction?: string;
  arrowStyle?: any;
  dropdownContentStyle?: any;
  children?: React.ReactNode;
  selectorClass?: string;
  contentClass?: string;
  activeClass?: string;
  activeClassName?: string;
  contentClassName?: string;
  selectorClassName?: string;
  selectorContentClassName?: string;
  noArrow: boolean;
  hover?: boolean;
  /** timeout in ms to display the tooltip on hover */
  hoverTimeout?: number;
  spacing?: number;
  fixedMobile?: boolean;
  noCloseClickingOutside?: boolean;
  defaultOpen?: boolean;
} & Record<Key, any>;

interface CustomDropdownState {
  dropdownActive?: boolean;
}

export const CustomDropdown = (ItemComponent) => {
  return class DropdownContainer extends React.Component<
    CustomDropdownProps,
    CustomDropdownState
  > {
    wrapperRef: any;

    constructor(props: CustomDropdownProps) {
      super(props);

      const { active, defaultOpen } = this.props;

      this.state = {
        dropdownActive: active || defaultOpen || false,
      };
    }

    componentDidMount() {
      document.addEventListener("mouseup", this.handleClickOutside);
    }

    componentDidUpdate(prevProps) {
      const { forceClose } = this.props;

      if (forceClose && !prevProps.forceClose) {
        this.toggleClick(false);
      }
    }

    componentWillUnmount() {
      document.removeEventListener("mouseup", this.handleClickOutside);
    }

    handleClickOutside = (event: MouseEvent): void => {
      const { noCloseClickingOutside } = this.props;
      const { target } = event;
      const { dropdownActive } = this.state;

      if (target instanceof HTMLElement && !noCloseClickingOutside) {
        if (
          dropdownActive &&
          this.wrapperRef &&
          !this.wrapperRef.contains(target)
        ) {
          this.setState({ dropdownActive: false });
        }
      }
    };

    setWrapperRef = (node: HTMLElement): void => {
      this.wrapperRef = node;
    };

    toggleClick = (forcedValue?: boolean): void => {
      const { action, hover, hoverTimeout } = this.props;
      const { dropdownActive } = this.state;

      if (forcedValue !== undefined && forcedValue === dropdownActive) return;

      if (!dropdownActive && action) {
        action();
      }

      const targetDropdownActive =
        (forcedValue !== undefined && forcedValue) || !dropdownActive;

      if (targetDropdownActive && hoverTimeout > 0 && hover) {
        setTimeout(() => {
          this.setState({
            dropdownActive: targetDropdownActive,
          });
        }, hoverTimeout);
      } else {
        this.setState({
          dropdownActive: targetDropdownActive,
        });
      }
    };

    actionContent = (): void => {
      const { toggleContent, actionContent } = this.props;
      const { dropdownActive } = this.state;

      if (toggleContent) {
        this.setState({ dropdownActive: !dropdownActive });
      }
      if (actionContent) {
        actionContent();
      }
    };

    render() {
      const {
        className,
        direction,
        arrowColor,
        decal,
        arrowStyle,
        selectorClass,
        selectorClassName,
        selectorContentClassName,
        contentClass,
        contentClassName,
        dropdownContentStyle,
        children,
        noArrow,
        activeClass,
        activeClassName,
        hover,
        spacing,
        center,
        fixedMobile,
      } = this.props;
      const { dropdownActive } = this.state;

      const mobile = typeof navigator === "object" && mobileAndTabletCheck();

      return (
        <div
          className={[
            "relative inline-block focus:outline-none",
            className,
            decal && "decal",
            fixedMobile && "fixed-mobile",
            noArrow && "no-triangle",
            direction || "bottom",
          ].join(" ")}
          onMouseEnter={(): void => hover && !mobile && this.toggleClick(true)}
          onMouseLeave={(): void => hover && !mobile && this.toggleClick(false)}
          ref={this.setWrapperRef}
        >
          <div
            className={[
              "cursor-pointer",
              dropdownActive && "active",
              dropdownActive && activeClass,
              dropdownActive && activeClassName,
              selectorClass,
              selectorClassName,
            ].join(" ")}
            style={
              spacing && {
                marginBottom: `${spacing}px`,
                marginTop: `${spacing}px`,
              }
            }
            onClick={() => this.toggleClick()}
          >
            <div className={["relative", selectorContentClassName].join(" ")}>
              <ItemComponent
                active={dropdownActive}
                {...this.props}
                closeDropdown={() => this.toggleClick(false)}
              />
            </div>
          </div>
          {dropdownActive && (
            <div
              className={[
                "absolute z-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5",
                direction === "right" && "origin-top-right right-0",
                direction === "left" && "origin-top-left left-0",
                contentClass,
                contentClassName,
              ].join(" ")}
              style={dropdownContentStyle}
            >
              {children}
            </div>
          )}
        </div>
      );
    }
  };
};
