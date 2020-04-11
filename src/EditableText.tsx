import React, { CSSProperties, useState } from "react";

interface Props {
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  selectAllOnMount?: boolean;
  initialEdit?: boolean;
  onTextChanged: (text: string) => void;
  multiline?: boolean;
  renderEditComponent: (props: EditableComponentProps) => React.ReactNode;
  component: React.ReactNode;
}

export interface EditableComponentProps {
  onDone: (value: string) => void;
  onCancel: () => void;
}

export const EditableText: React.FC<Props> = ({
  onTextChanged,
  style,
  initialEdit = false,
  renderEditComponent,
  component
}) => {
  const [edit, setEdit] = useState(initialEdit);

  if (edit) {
    return (
      <div style={{ ...style, minHeight: 60 }}>
        {renderEditComponent({
          onCancel: () => {
            setEdit(false);
          },
          onDone: (text) => {
            onTextChanged(text);
            setEdit(false);
          },
        })}
      </div>
    );
  } else {
    return (
      <div
        style={{ ...style, minHeight: 60 }}
        onDoubleClick={() => {
          setEdit(true);
        }}
      >
        {component}
      </div>
    );
  }
};
