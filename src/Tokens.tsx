import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import tinycolor from "tinycolor2";
import { useSocketEvent } from "./hooks/useSocketEvent";

export interface Token {
  color: string;
  id: string;
  x: number;
  y: number;
}

interface TokensDivProps {
  color: string;
  x: number;
  y: number;
  position?: string;
}

export const TokensDiv = styled.div<TokensDivProps>`
  background-color: ${(props: TokensDivProps) => props.color};
  position: ${(props: TokensDivProps) => props.position || "absolute"};
  top: ${(props: TokensDivProps) => props.y}px;
  left: ${(props: TokensDivProps) => props.x}px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid
    ${(props: TokensDivProps) =>
      tinycolor(props.color)
        .brighten()
        .toString()};
  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

const initialTokenState: Record<string, Token> = {
  "tomato-token": {
    color: "tomato",
    id: "tomato-token2",
    x: 800,
    y: 50
  },
  "yellowgreen-token": {
    color: "yellowgreen",
    id: "yellowgreen-token1",
    x: 120,
    y: 190
  }
};

export const Tokens: React.FC = () => {
  const [tokens, setTokens] = useState<Record<string, Token>>(
    initialTokenState
  );

  useSocketEvent("update-token", ({ id, x, y, ...rest }: Token) => {
    setTokens(tokens => ({
      ...tokens,
      [id]: {
        ...rest,
        id,
        x: x * window.innerWidth,
        y: y * window.innerHeight
      }
    }));
  });

  return (
    <>
      {Object.values(tokens).map(token => (
        <Draggable key={token.id}>
          <TokensDiv color={token.color} x={token.x} y={token.y} />
        </Draggable>
      ))}
    </>
  );
};
