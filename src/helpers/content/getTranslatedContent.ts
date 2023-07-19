export const getTranslatedContent = (
  obj: any | string,
  lg?: string,
  defaultLanguage?: string
): string => {
  if (typeof obj === "object") {
    return obj[lg] || (defaultLanguage && obj[defaultLanguage]) || obj;
  }
  return obj;
};

export default getTranslatedContent;
