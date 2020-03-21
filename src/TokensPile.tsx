import React from "react";
import { TokensDiv } from "./Tokens";
import { useSocket } from "./SocketContext";

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
        display: "flex"
      }}
    >
      <TokensDiv
        onClick={() => sendCreateNewSocket("tomato", 0, 0)}
        x={0}
        y={0}
        color="tomato"
        position="relative"
      />
      <TokensDiv
        onClick={() => sendCreateNewSocket("green", 0, 0)}
        x={0}
        y={0}
        color="green"
        position="relative"
      />
      <TokensDiv
        onClick={() => sendCreateNewSocket("blue", 0, 0)}
        x={0}
        y={0}
        color="blue"
        position="relative"
      />
      <TokensDiv
        onClick={() => sendCreateNewSocket("yellowgreen", 0, 0)}
        x={0}
        y={0}
        color="yellowgreen"
        position="relative"
      />
      <TokensDiv
        onClick={() => sendCreateNewSocket("goldenrod", 0, 0)}
        x={0}
        y={0}
        color="goldenrod"
        position="relative"
      />
      <TokensDiv
        onClick={() => sendCreateNewSocket("rebeccapurple", 0, 0)}
        x={0}
        y={0}
        color="rebeccapurple"
        position="relative"
      />
      <TokensDiv
        onClick={() => sendCreateNewSocket("orangered", 0, 0)}
        x={0}
        y={0}
        color="orangered"
        position="relative"
      />
    </div>
  );
};
