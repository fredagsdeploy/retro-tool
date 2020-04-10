import React, { CSSProperties, useEffect, useRef, useState } from "react";

interface EditTextInputProps {
  style?: CSSProperties;
  selectAllOnMount?: boolean;
  multiline?: boolean;
  onCancel: () => void;
  onDone: (text: string) => void;
  onBlur?: () => void;
  defaultValue: string;
  renderControls?: (props: {
    onDone: () => void;
    onCancel: () => void;
  }) => React.ReactNode;
}

export const EditTextInput: React.FC<EditTextInputProps> = ({
  style,
  selectAllOnMount = false,
  multiline = false,
  onCancel,
  onDone,
  onBlur,
  defaultValue,
  renderControls,
}) => {
  const ref = useRef<any>();
  const [innerValue, setInnerValue] = useState(defaultValue);

  useEffect(() => {
    const elem = ref.current;
    if (elem && selectAllOnMount) {
      elem.select();
    }
  }, [selectAllOnMount]);

  const Tag = multiline ? "textarea" : "input";

  return (
    <>
      {renderControls?.({ onDone: () => onDone(innerValue), onCancel })}
      <Tag
        ref={ref}
        autoFocus
        style={style}
        onChange={(e: any) => {
          setInnerValue(e.target.value);
        }}
        onBlur={() => {
          if (onBlur) {
            onBlur();
          } else {
            onDone(innerValue);
          }
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
            onDone(innerValue);
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        value={innerValue}
      />
    </>
  );
};
