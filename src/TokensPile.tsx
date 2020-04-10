import React from "react";
import { TokensDiv } from "./Tokens";
import { useSocket } from "./SocketContext";
import { DragDuplicated } from "./DragDuplicated";

export const TokensPile = () => {
  const socket = useSocket();

  const sendCreateNewSocket = (color: string, x: number, y: number) => {
    socket.emit("create-token", { color, x, y });
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "30px",
        display: "flex",
      }}
    >
      <DragDuplicated
        onDrop={({ x, y }) => sendCreateNewSocket("tomato", x, y)}
      >
        <TokensDiv color="tomato" position="relative" />
      </DragDuplicated>
      <DragDuplicated onDrop={({ x, y }) => sendCreateNewSocket("green", x, y)}>
        <TokensDiv color="green" position="relative" />
      </DragDuplicated>
      <DragDuplicated onDrop={({ x, y }) => sendCreateNewSocket("blue", x, y)}>
        <TokensDiv color="blue" position="relative" />
      </DragDuplicated>
      <DragDuplicated
        onDrop={({ x, y }) => sendCreateNewSocket("yellowgreen", x, y)}
      >
        <TokensDiv color="yellowgreen" position="relative" />
      </DragDuplicated>
      <DragDuplicated
        onDrop={({ x, y }) => sendCreateNewSocket("goldenrod", x, y)}
      >
        <TokensDiv color="goldenrod" position="relative" />
      </DragDuplicated>
      <DragDuplicated
        onDrop={({ x, y }) => sendCreateNewSocket("rebeccapurple", x, y)}
      >
        <TokensDiv color="rebeccapurple" position="relative" />
      </DragDuplicated>
      <DragDuplicated
        onDrop={({ x, y }) => sendCreateNewSocket("orangered", x, y)}
      >
        <TokensDiv color="orangered" position="relative" />
      </DragDuplicated>
    </div>
  );
};
