import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

interface SocketMouseEvent {
  id: string;
  x: number;
  y: number;
}

export const App = () => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [cursors, setCursors] = useState<Record<string, SocketMouseEvent>>({});

  useEffect(() => {
    const socket = io("ws://localhost:1234");
    socketRef.current = socket;

    socket.on("mouse", ({ x, y, id }: SocketMouseEvent) => {
      setCursors(c => ({ ...c, [id]: { id, x, y } }));
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const newLocal = (event: MouseEvent): void => {
      const { pageX: x, pageY: y } = event;
      if (socketRef.current) {
        socketRef.current.emit("mouse", { x, y });
      }
    };

    window.addEventListener("mousemove", newLocal);

    return () => {
      window.removeEventListener("mousemove", newLocal);
    };
  });

  return (
    <>
      {Object.values(cursors).map(c => (
        <svg
          height="30"
          width="30"
          viewBox="0 0 500 500"
          key={c.id}
          style={{
            position: "absolute",
            top: c.y,
            left: c.x
          }}
          fill="none"
          strokeWidth={"50"}
          stroke={"#" + c.id.substr(0, 6)}
        >
          <polygon points="100,60 100,450 400,400" />
        </svg>
      ))}
    </>
  );
};
