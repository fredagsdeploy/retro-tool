import React, { useRef } from "react";
import Draggable from "react-draggable";

interface Props {
  dragChild: React.ReactNode;
  onStart?: (event: any) => void;
  onDrop: (p: { x: number; y: number }) => void;
}

export const DragDuplicated: React.FC<Props> = ({
  children,
  dragChild,
  onStart,
  onDrop,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {children}
      <Draggable
        onStart={(event: any) => {
          console.log("onStart", event);
          console.log("onStart", event.clientX, event.clientY);
          console.log("onStart", event.pageX, event.pageY);
          const element = ref.current;
          if (element) {
            const { left, top } = element.getBoundingClientRect();
            console.log("element", left, top);
            startPos.current = {
              x: event.clientX - left,
              y: event.clientY - top,
            };
          }

          if (onStart) {
            onStart(event);
          }
        }}
        position={{ x: 0, y: 0 }}
        onStop={(event: any) => {
          console.log("onStop", event);

          onDrop({
            x: (event.pageX - startPos.current.x) / window.innerWidth,
            y: (event.pageY - startPos.current.y) / window.innerHeight,
          });
        }}
      >
        <div style={{ position: "absolute", top: 0 }}>{dragChild}</div>
      </Draggable>
    </div>
  );
};
