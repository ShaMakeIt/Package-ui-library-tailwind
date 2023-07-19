import testPrimitive from "./testPrimitive";

export const transformValue = (
  item: any | string | number | boolean,
  key?: string
): boolean => {
  let itemValue;
  const label = key || "value";

  if (item && item[label] !== undefined) itemValue = item[label];
  else itemValue = item;

  if (itemValue === undefined || itemValue === null) return undefined;

  // to be sure
  if (testPrimitive(itemValue)) itemValue = itemValue.toString();

  return itemValue;
};

export default transformValue;
