import React from "react";
import Draggable from "react-draggable";

interface Props {
  onStart?: () => void;
  onDrop: (p: { x: number; y: number }) => void;
}

export const DragDuplicated: React.FC<Props> = ({
  children,
  onStart,
  onDrop,
}) => {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <Draggable
        onStart={onStart}
        position={{ x: 0, y: 0 }}
        onStop={(event: any) => {
          onDrop({
            x: event.pageX / window.innerWidth,
            y: event.pageY / window.innerHeight,
          });
        }}
      >
        <div style={{ position: "absolute", top: 0 }}>{children}</div>
      </Draggable>
    </div>
  );
};
