import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { throttle } from "lodash-es";

interface SocketMouseEvent {
  id: string;
  x: number;
  y: number;
}

interface SocketRemoveEvent {
  id: string;
}

export const App = () => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const [cursors, setCursors] = useState<Record<string, SocketMouseEvent>>({});

  useEffect(() => {
    const socket = io(`ws://${window.location.hostname}:1234`);
    socketRef.current = socket;

    socket.on("mouse", ({ x, y, id }: SocketMouseEvent) => {
      setCursors(c => ({
        ...c,
        [id]: { id, x: x * window.innerWidth, y: y * window.innerHeight }
      }));
    });

    socket.on("remove", ({ id }: SocketRemoveEvent) => {
      setCursors(({ [id]: a, ...c }) => c);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const newLocal = throttle((event: MouseEvent): void => {
      const { pageX, pageY } = event;
      const x = pageX / window.innerWidth;
      const y = pageY / window.innerHeight;
      if (socketRef.current) {
        socketRef.current.emit("mouse", { x, y });
      }
    }, 100);

    window.addEventListener("mousemove", newLocal);

    return () => {
      window.removeEventListener("mousemove", newLocal);
    };
  }, []);

  return (
    <>
      {Object.values(cursors).map(c => (
        <svg
          height="30"
          width="30"
          viewBox="0 0 500 500"
          key={c.id}
          style={{
            transition: "transform 100ms linear",
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${c.x}px, ${c.y}px)`
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
