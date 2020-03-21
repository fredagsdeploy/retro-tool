import React, { CSSProperties, useState, useEffect, useRef } from "react";

interface Props {
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  value: string;
  selectAllOnMount?: boolean;
  initialEdit?: boolean;
  onTextChanged: (text: string) => void;
  multiline?: boolean;
}

export const EditableText: React.FC<Props> = ({
  value,
  onTextChanged,
  style,
  selectAllOnMount = false,
  multiline = false,
  initialEdit = false,
  inputStyle
}) => {
  const [edit, setEdit] = useState(initialEdit);
  const [innerValue, setInnerValue] = useState(value);
  const ref = useRef<any>();

  useEffect(() => {
    const elem = ref.current;
    if (elem && selectAllOnMount) {
      elem.select();
    }
  }, [selectAllOnMount]);

  return (
    <div
      style={{ ...style, minHeight: 60 }}
      onDoubleClick={
        edit
          ? undefined
          : () => {
              setEdit(true);
              setInnerValue(value);
            }
      }
    >
      {edit ? (
        !multiline ? (
          <input
            ref={ref}
            autoFocus
            style={inputStyle}
            onChange={e => {
              setInnerValue(e.target.value);
            }}
            onBlur={() => {
              setEdit(false);
              onTextChanged(innerValue);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                setEdit(false);
                onTextChanged(innerValue);
              } else if (e.key === "Escape") {
                setEdit(false);
              }
            }}
            value={innerValue}
          />
        ) : (
          <textarea
            ref={ref}
            autoFocus
            style={inputStyle}
            onChange={e => {
              setInnerValue(e.target.value);
            }}
            onBlur={() => {
              setEdit(false);
              onTextChanged(innerValue);
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                setEdit(false);
                onTextChanged(innerValue);
              } else if (e.key === "Escape") {
                setEdit(false);
              }
            }}
            value={innerValue}
          />
        )
      ) : (
        value
      )}
    </div>
  );
};
