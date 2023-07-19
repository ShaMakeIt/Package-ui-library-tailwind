// import React, { useCallback, useRef, useEffect, useMemo } from "react";

// import getContent from "@makeit-studio/helpers/dist/content/getContent";

// export const Textarea = (props: TextareaProps) => {
//   // existing code...

//   return (
//     <FormElement
//       {...props}
//       className={`className ${oneLine ? "one-line" : ""}`}
//     >
//       <FieldWrapper isTextarea {...props}>
//         <textarea
//           className={`textareaClass ${resize ? "resize-y" : ""} ${
//             autoResize ? "auto-resize" : ""
//           } ${small ? "text-xs" : ""}`}
//           ref={inputRef}
//           id={id}
//           disabled={disabled}
//           rows={rows || (autoResize ? 1 : 3)}
//           name={name || input.name}
//           placeholder={
//             (!effect &&
//               typeof textPlaceholder === "string" &&
//               textPlaceholder) ||
//             ""
//           }
//           {...input}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           onChange={handleChange}
//           maxLength={maxChar}
//         />
//         {!noMaxCharDisplay && maxChar && (
//           <div className="text-xs text-right mb-1 mt-1">{`${input?.value?.length} / ${maxChar}`}</div>
//         )}
//         {children}
//       </FieldWrapper>
//     </FormElement>
//   );
// };
// export default Textarea;
