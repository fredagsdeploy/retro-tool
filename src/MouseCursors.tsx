import React, { useEffect, useState } from "react";

import { throttle } from "lodash-es";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { useSocket } from "./SocketContext";

interface SocketMouseEvent {
  id: string;
  x: number;
  y: number;
  name: string;
}

interface SocketRemoveEvent {
  id: string;
}

export const MouseCursors: React.FC = () => {
  const [cursors, setCursors] = useState<Record<string, SocketMouseEvent>>({});

  useSocketEvent("mouse", ({ x, y, id, name }: SocketMouseEvent) => {
    setCursors(c => ({
      ...c,
      [id]: { id, x: x * window.innerWidth, y: y * window.innerHeight, name }
    }));
  });
  useSocketEvent("remove", ({ id }: SocketRemoveEvent) => {
    setCursors(({ [id]: a, ...c }) => c);
  });

  const socket = useSocket();

  useEffect(() => {
    const newLocal = throttle((event: MouseEvent): void => {
      const { pageX, pageY } = event;
      const x = pageX / window.innerWidth;
      const y = pageY / window.innerHeight;
      socket.emit("mouse", { x, y });
    }, 100);

    window.addEventListener("mousemove", newLocal);

    return () => {
      window.removeEventListener("mousemove", newLocal);
    };
  }, [socket]);

  return (
    <>
      {Object.values(cursors).map(c => (
        <svg
          height="30"
          width="30"
          className="mouse-cursor"
          viewBox="0 0 500 500"
          key={c.id}
          style={{
            transition: "transform 100ms linear",
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${c.x}px, ${c.y}px)`,
            fontFamily: "'Patrick Hand'",
            fontWeight: 300,
            fontSize: 500,
            letterSpacing: 4,
            overflow: "visible",
            userSelect: "none"
          }}
          fill="none"
          strokeWidth={"50"}
          stroke={"#" + c.id.substr(0, 6)}
        >
          <polygon points="100,60 100,450 400,400" />
          <text y={1000}>{c.name}</text>
        </svg>
      ))}
    </>
  );
};
