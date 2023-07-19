import React, { useCallback, useMemo } from "react";
import getContent from "../../../helpers/content/getContent";
import handleReplace from "../../../helpers/content/handleReplace";
import compareItems from "../../../helpers/utils/compareItems";
import testPrimitive from "../../../helpers/utils/testPrimitive";
import getTranslatedContent from "../../../helpers/content/getTranslatedContent";
import HtmlTextItem, { HtmlTextItemProps } from "../HtmlTextItem/HtmlTextItem";
import find from "lodash/find";

// Exemple usage
// <TextItem lg={lg} defaultLanguage={defaultLanguage} content={content} localeContent={localeContent} path="lists.genders" item={value} />
// => take the list genders (from content) et retrieve the right element using
// item (= value = key in the list genders)
// and then return the value in the appropriate language
// <TextItem lg={lg} defaultLanguage={defaultLanguage} content={content} localeContent={localeContent} path="path.to.direct.content" />
// => take the object into the path and then return the value in the appropriate language
// <TextItem lg={lg} defaultLanguage={defaultLanguage} content={content} localeContent={localeContent} path="something" /> : return 'something'

// You can also provide a replace object so that the key prefixed by a dollars
// into the returned value a replaced with the value replace[key]
// Ex: <TextItem lg={lg} defaultLanguage={defaultLanguage} content={content} localeContent={localeContent} path"path.to.direct.content" replace={{'value':'cool'}} />
// without replace TextItem could return "This car is $value"
// with the replace object => "This car is cool"

interface TextElementProps {
  id?: string;
  text?: string;
  dataCta?: string;
  dataCtaValue?: string;
  style?: any;
  action?: () => void;
  onClick?: () => void;
  className?: string;
  tag?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "strong"
    | "i"
    | "div"
    | "span"
    | "none";
}

export type TextItemProps = TextElementProps &
  HtmlTextItemProps & {
    path?: string | string[] | any;
    item?: number | boolean | string | any;
    isHtml?: boolean;
    replace?: any;
    list?: string[] | any[];
    lg?: string;
    defaultLanguage?: string;
    content?: any;
    localeContent?: any;
    defaultContent?: any;
    compareKey?: string;
    labelKey?: string;
    debug?: boolean;
    idKey?: string;
    warningEmptyContent?: boolean;
    sync?: boolean;
    syncAction?: (...args) => any;
  };

export const TextElement = ({
  id,
  text,
  dataCta,
  dataCtaValue,
  style,
  action,
  onClick,
  className,
  tag,
  forwardRef,
}: TextElementProps) => {
  const itemProps = {
    onClick: action || onClick,
    "data-cta": dataCta,
    id,
    className,
    style,
    "data-cta-value": dataCtaValue,
    suppressHydrationWarning: true,
    ref: forwardRef,
  };

  const CustomTag = `${tag}`;

  if (!tag) {
    return <span {...itemProps}>{text}</span>;
  }
  if (tag === "none") {
    // Usage of Fragment to have a correct typing for HtmlTextItem although string should be fine
    // eslint-disable-next-line
    return <>{text}</>;
  }

  return <CustomTag {...itemProps}>{text}</CustomTag>;
};

/**
 * TextItem is meant to be connected to the content
 * @param props
 * @returns
 */
export const TextItem = (props: TextItemProps) => {
  const {
    isHtml,
    item,
    list,
    path,
    replace,
    defaultContent,
    compareKey,
    labelKey,
    debug,
    highlight,
    idKey,
    warningEmptyContent,
    content,
    lg,
    defaultLanguage,
    localeContent,
    sync = false,
    syncAction,
  } = props;

  // eslint-disable-next-line
  const syncContent = useCallback(
    (contentPath) => {
      if (
        typeof contentPath === "string" &&
        contentPath.indexOf(".") >= 0 &&
        !contentPath.match(/\s/)
      )
        if (typeof syncAction === "function") {
          console.warn("TODO: add in content", contentPath);
          syncAction(contentPath);
        }
    },
    [syncAction]
  );

  // Extract text from content
  const handleContent = useCallback(
    (contentPath: string | string[], noDefault = false) => {
      let contentItem = content
        ? getContent(content, contentPath, lg, null, defaultLanguage)
        : undefined;

      if (!contentItem && localeContent) {
        contentItem = getContent(
          localeContent,
          contentPath,
          lg,
          null,
          defaultLanguage
        );
      }

      if (!contentItem && sync) {
        syncContent(contentPath);
      }

      if (!contentItem && !noDefault && defaultContent) {
        return defaultContent;
      }

      return contentItem;
    },
    [
      content,
      defaultContent,
      localeContent,
      lg,
      defaultLanguage,
      sync,
      syncContent,
    ]
  );

  // Handle replacement in text and return final value
  const replaceInTxt = useCallback(
    (txt?: string) => {
      if (txt === undefined) {
        return "";
      }

      // For keys in replace : replace key = handleContent (replace key)
      if (replace) {
        const replaceObj = {};
        const keys = Object.keys(replace);

        keys.forEach(function (key) {
          const replacePath = replace[key];

          const replaceValue = handleContent(replacePath, true);

          if (typeof replaceValue === "string") replaceObj[key] = replaceValue;
          else replaceObj[key] = replacePath;
        });

        txt = handleReplace(txt, replaceObj);
      }

      return txt;
    },
    [handleContent, replace]
  );

  const getValueFromList = useCallback(
    (listItems: any[], value: any) => {
      const val = find(listItems, (listItem) => {
        if (compareKey) {
          // override default compare keys
          return compareItems(listItem, value, compareKey);
        }
        return (
          // for api data
          compareItems(listItem, value, idKey) ||
          // for admin list
          compareItems(listItem, value, "value") ||
          // for content
          compareItems(listItem, value, "label")
        );
      });

      // send textual value
      if (labelKey) return val?.[labelKey] || val;

      return val?.label || val;
    },
    [compareKey, idKey, labelKey]
  );

  const extractText = useCallback((): string => {
    let contentItem;
    // path to find a single object in the content gathering everything
    // if a list is at the end of the path =>
    // an additional value is provided to retrieve to right object

    if (debug) console.log("path", path);

    if (path !== undefined) {
      // If no path found in the getContent => contentResult become path
      const contentResult = handleContent(path);

      // item given is a string
      if (Array.isArray(contentResult) && item) {
        contentItem = getValueFromList(contentResult, item);
        if (!contentItem) contentItem = item;
      }
      // Content result can still be a list or a string
      else if (typeof contentResult === "object" && item) {
        // Test 1 : get the object
        contentItem = contentResult[item];
        // Test 2 : (case object with { 0: ..., 1: ..., ... })
        if (!contentItem) {
          const values = Object.values(contentResult);
          contentItem = getValueFromList(values, item);
        }
        if (!contentItem) contentItem = item;
      } else if (contentResult !== undefined) {
        contentItem = contentResult;
      } else {
        // no longer used if path is in the form of path.to.something
        // eslint-disable-next-line no-lonely-if
        if (Array.isArray(path) && item) {
          contentItem = item;
        } else {
          contentItem = Array.isArray(path) ? path.join && path.join() : path;
        }
      }
    }
    // list is directly provided and item is a value
    else if (list && item !== undefined) {
      contentItem = getValueFromList(list, item);

      // Display something if no matching
      if (!contentItem && testPrimitive(item)) {
        contentItem = item;
      }
    }
    // Item with content is directly provided (as object) (for custom select)
    else if (item !== undefined) {
      contentItem = item;
    }
    // At this point, contentItem is an object with languages keys (key can be precise as a parameter) or direct a string
    // Ex: {
    //  'fr':...,
    //  'en':...
    // }

    if (debug) console.log("contentItem", contentItem);

    if (contentItem !== undefined) {
      // if no key or lg or defaultLg value in the object, test : text, value, name and val
      let contentTxt = "";
      if (testPrimitive(contentItem)) contentTxt = contentItem;
      else {
        contentItem = getTranslatedContent(contentItem, lg, defaultLanguage);
        if (testPrimitive(contentItem)) contentTxt = contentItem;
        else if (typeof contentItem === "object") {
          contentTxt =
            contentItem.text ||
            contentItem.description ||
            contentItem.name ||
            contentItem.label ||
            contentItem.value ||
            contentItem.val;

          // here we have the field in the content but it is empty
          // We avoid displaying the label because it can be on purpose
          if (contentItem.label && contentItem.type === "input") {
            if (warningEmptyContent)
              console.warn("Empty content", path, contentItem.label);
            contentTxt = "";
          }
        }
      }
      if (testPrimitive(contentTxt)) {
        contentTxt = contentTxt && contentTxt.toString();
        return contentTxt;
      }
    }
    return "";
  }, [
    debug,
    defaultLanguage,
    getValueFromList,
    handleContent,
    item,
    lg,
    list,
    path,
    warningEmptyContent,
  ]);

  const txt = useMemo(() => {
    const extractedText = extractText();

    if (extractedText === undefined) return undefined;

    const replacedText = replaceInTxt(extractedText);

    return replacedText;
  }, [extractText, replaceInTxt]);

  if (isHtml || highlight) return <HtmlTextItem {...props} text={txt} />;

  return <TextElement {...props} text={txt} />;
};

export default TextItem;
