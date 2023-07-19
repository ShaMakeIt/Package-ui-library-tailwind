import React from "react";
import { CustomDropdown } from "../../enhancers/CustomDropdown/CustomDropdown";

export interface ItemComponentProps {
  label?: string;
  item?: React.ReactNode;
}

const ItemComponent = ({ label, item }: ItemComponentProps) => {
  if (label) {
    return <span>{label}</span>;
  }
  if (item) {
    return item;
  }
  return null;
};

const LocaleDropdown = CustomDropdown(ItemComponent);

export const Dropdown = (props) => {
  return <LocaleDropdown decal {...props} />;
};

export default Dropdown;
