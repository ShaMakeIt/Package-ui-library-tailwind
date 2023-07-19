// Handle replace in a string using an object
export const handleReplace = (txt?: string, replaceObj?: any): string => {
  if (!replaceObj || !txt) {
    return txt;
  }

  const keys = replaceObj && Object.keys(replaceObj);
  if (replaceObj && keys && keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // pattern 1 : $variable
      txt = txt.split(`$${key}`).join(replaceObj[key]);
      // pattern 2 : ${variable}
      txt = txt.split(`$\{${key}}`).join(replaceObj[key]);
    }
  }

  return txt;
};
export default handleReplace;
