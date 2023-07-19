import getTranslatedContent from "./getTranslatedContent";
import handleReplace from "./handleReplace";
import get from "lodash/get";

export const getContent = (
  contentObj: any,
  path: string | string[],
  lg?: string,
  replaceObj?: any,
  defaultLanguage = "en"
): string | undefined | any[] => {
  if (!contentObj) {
    return false;
  }

  let txt = get(contentObj, path);

  txt = txt ? getTranslatedContent(txt, lg, defaultLanguage) : txt;
  txt =
    typeof txt === "string" && replaceObj
      ? handleReplace(txt, replaceObj)
      : txt;
  return txt;
};

export default getContent;
