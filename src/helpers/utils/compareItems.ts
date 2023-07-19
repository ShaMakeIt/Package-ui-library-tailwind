import transformValue from "./transformValue";

export const compareItems = (
  item1: any | string | number | boolean,
  item2: any | string | number | boolean,
  key?: string
): boolean => {
  const val1 = transformValue(item1, key);
  const val2 = transformValue(item2, key);

  if (val1 === val2 && val1 && val2) {
    return true;
  }

  return false;
};

export default compareItems;
