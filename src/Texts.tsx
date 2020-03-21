import React, { useState, useEffect } from "react";
import styled from "styled-components";
import tinycolor from "tinycolor2";

export interface Text {
  content: string;
  id: string;
  x: number;
  y: number;
}

interface TextsProps {
  socket: SocketIOClient.Socket;
}

const TextsDiv = styled.div`
  position: absolute;
  color: ${tinycolor("#222").isLight() ? "#333" : "#eee"};
  font-family: "Patrick Hand", cursive;
  font-size: 30px;
`;

const initialTextState: Record<string, Text> = {
  text1: {
    content: "Hello my peepedipoops",
    id: "text1",
    x: 200,
    y: 50
  }
};

export const Texts: React.FC<TextsProps> = ({ socket }) => {
  const [texts, setTexts] = useState<Record<string, Text>>(initialTextState);

  useEffect(() => {
    socket.on("update-text", ({ id, x, y, ...rest }: Text) => {
      console.log("Got update text", id, x, y, rest);

      setTexts(texts => ({
        ...texts,
        [id]: {
          ...rest,
          id,
          x: x * window.innerWidth,
          y: y * window.innerHeight
        }
      }));
    });
  }, [socket]);

  return (
    <>
      {Object.values(texts).map(text => (
        <TextsDiv
          key={text.id}
          style={{
            top: text.y,
            left: text.x
          }}
        >
          {text.content}
        </TextsDiv>
      ))}
    </>
  );
};
