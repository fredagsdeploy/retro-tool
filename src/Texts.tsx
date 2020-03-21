import React from "react";
import styled from "styled-components";

export interface Text {
  content: string;
  id: string;
  x: number;
  y: number;
}

interface TextsProps {
  texts: Record<string, Text>;
  socket: SocketIOClient.Socket;
}

interface TextsDivProps {
  x: number;
  y: number;
}

const TextsDiv = styled.div<TextsDivProps>`
  position: absolute;
  top: ${(props: TextsDivProps) => props.y}px;
  left: ${(props: TextsDivProps) => props.x}px;
  color: #333;
  font-family: "Patrick Hand", cursive;
  font-size: 30px;
`;

export const Texts: React.FC<TextsProps> = ({ texts }) => (
  <>
    {Object.values(texts).map(text => (
      <TextsDiv key={text.id} x={text.x} y={text.y}>
        {text.content}
      </TextsDiv>
    ))}
  </>
);
