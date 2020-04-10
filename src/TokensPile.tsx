import React from "react";
import { TokensDiv } from "./Tokens";
import { useSocket } from "./SocketContext";
import { DragDuplicated } from "./DragDuplicated";
import { noteColors } from "./colors";

export const TokensPile = () => {
  const socket = useSocket();

  const sendCreateNewSocket = (color: string, x: number, y: number) => {
    socket.emit("create-token", { color, x, y });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "10px",
        top: "150px",
        display: "flex",
      }}
    >
      {noteColors.map((color) => (
        <DragDuplicated
          dragChild={<TokensDiv color={color} position="relative" />}
          key={color}
          onDrop={({ x, y }) => sendCreateNewSocket(color, x, y)}
        >
          <TokensDiv color={color} position="relative" />
        </DragDuplicated>
      ))}
    </div>
  );
};
