import React, { useState } from "react";
import styled from "styled-components";
import Draggable, { DraggableData } from "react-draggable";
import tinycolor from "tinycolor2";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { useSocket } from "./SocketContext";
import { useDragContextState } from "./hooks/useDragContextState";

export interface Token {
  color: string;
  id: string;
  x: number;
  y: number;
}

interface TokensDivProps {
  color: string;
  position?: string;
}

export const TokensDiv = styled.div<TokensDivProps>`
  background-color: ${(props: TokensDivProps) => props.color};
  box-shadow: inset 0 0 4px 0 rgba(0,0,0,0.5);
  position: ${(props: TokensDivProps) => props.position || "absolute"};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid
    ${(props: TokensDivProps) => tinycolor(props.color).brighten().toString()};
  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

export const Tokens: React.FC = () => {
  const [tokens, setTokens] = useState<Record<string, Token>>({});
  const socket = useSocket();
  const { setItem } = useDragContextState();

  useSocketEvent("update-token", ({ id, x, y, ...rest }: Token) => {
    setTokens((tokens) => ({
      ...tokens,
      [id]: {
        ...rest,
        id,
        x: x * window.innerWidth,
        y: y * window.innerHeight,
      },
    }));
  });

  useSocketEvent("delete-token", ({ id }: Token) => {
    setTokens(({ [id]: a, ...tokens }) => tokens);
  });

  return (
    <>
      {Object.values(tokens).map((token) => (
        <Draggable
          key={token.id}
          position={{ x: token.x, y: token.y }}
          onStart={() => setItem(token)}
          onDrag={(e, { x, y }: DraggableData) => {
            socket.emit("move-token", {
              id: token.id,
              x: x / window.innerWidth,
              y: y / window.innerHeight,
            });
          }}
          onStop={(e, { x, y }: DraggableData) => {
            setTokens((tokens) => ({
              ...tokens,
              [token.id]: {
                ...tokens[token.id],
                x,
                y,
              },
            }));

            socket.emit("drop-token", {
              id: token.id,
              x: x / window.innerWidth,
              y: y / window.innerHeight,
            });
          }}
        >
          <TokensDiv color={token.color} />
        </Draggable>
      ))}
    </>
  );
};
