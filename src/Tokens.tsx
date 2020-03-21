import React from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

export interface Token {
  color: string;
  id: string;
  x: number;
  y: number;
}

interface TokensProps {
  tokens: Record<string, Token>;
  socket: SocketIOClient.Socket;
}

interface TokensDivProps {
  color: string;
  x: number;
  y: number;
}

const TokensDiv = styled.div<TokensDivProps>`
  background-color: ${(props: TokensDivProps) => props.color};
  position: absolute;
  top: ${(props: TokensDivProps) => props.y}px;
  left: ${(props: TokensDivProps) => props.x}px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  :hover {
    cursor: move;
  }
  :active {
    cursor: grab;
  }
`;

export const Tokens: React.FC<TokensProps> = ({ tokens }) => (
  <>
    {Object.values(tokens).map(token => (
      <Draggable key={token.id}>
        <TokensDiv color={token.color} x={token.x} y={token.y} />
      </Draggable>
    ))}
  </>
);
