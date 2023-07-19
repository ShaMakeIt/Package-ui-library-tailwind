import React, { ReactElement, useCallback, useMemo } from "react";
import clsx from "clsx";
import sanitizeHtml from "sanitize-html";
import parse from "html-react-parser";

export interface HtmlTextItemProps {
  highlight?: string;
  tag?: string;
  noTargetBlank?: boolean;
  noSanitize?: boolean;
  highlightClassName?: string;
  className?: string;
  text?: string;
}

export const HtmlTextItem = (props: HtmlTextItemProps) => {
  const {
    highlight,
    tag,
    noTargetBlank,
    noSanitize,
    highlightClassName,
    className,
    text,
  } = props;

  const handleHighlight = useCallback(
    (txt) => {
      if (!highlight || !txt) return txt;

      const index = txt.toLowerCase().indexOf(highlight.toLowerCase());

      if (index >= 0) {
        txt = `${txt.substring(0, index)}<span class="${clsx(
          "bg-yellow-500",
          highlightClassName
        )}">${txt.substring(
          index,
          index + highlight.length
        )}</span>${txt.substring(index + highlight.length)}`;
      }

      return txt;
    },
    [highlight, highlightClassName]
  );

  const handleLink = useCallback(
    (txt) => {
      if (noTargetBlank) return txt;

      const regex = "<a([^>]+)>((?:.(?!</a>))*.)</a>";

      let links = [...txt.matchAll(regex)];

      let maxIterations = 50;

      let numOk = 0;

      while (numOk < links.length && maxIterations) {
        for (let i = 0; i < links.length; i += 1) {
          const link = links[i];

          const linkTxt = link[0];

          if (linkTxt.indexOf('target="_blank"') >= 0) {
            numOk++;
            continue;
          }
          txt = txt
            .slice(0, link.index + 3)
            .concat(
              'target="_blank" ',
              txt.slice(link.index + 3, link.index + linkTxt.length),
              txt.slice(link.index + linkTxt.length)
            );
          links = [...txt.matchAll(regex)];
        }
        maxIterations--;
      }

      if (!maxIterations)
        console.warn("href target blank : Infinite loop", txt);

      return txt;
    },
    [noTargetBlank]
  );

  const content = useMemo(() => {
    let txt = text;

    try {
      txt = handleLink(txt);

      txt = noSanitize
        ? txt
        : sanitizeHtml(txt, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
            allowedAttributes: {
              ...sanitizeHtml.defaults.allowedAttributes,
              "*": ["style", "alt"],
            },
            allowedStyles: {
              "*": {
                color: [/.*/],
                "text-align": [/.*/],
                "font-size": [/.*/],
                "font-weight": [/.*/],
                "font-family": [/.*/],
              },
            },
          });

      if (highlight) txt = handleHighlight(txt);

      const parsed = parse(txt);

      if (tag === "none") return <>{parsed}</>;
      return <div className={clsx(className, "bg-yellow-500")}>{parsed}</div>;
    } catch (e) {
      return <span>Invalid content</span>;
    }
  }, [
    text,
    noSanitize,
    highlight,
    handleHighlight,
    tag,
    handleLink,
    className,
  ]);

  return content;
};

export default HtmlTextItem;
