import React, { useState } from "react";
import styled from "styled-components";
import { getTextColorForBackground } from "./colors";
import { EditableText } from "./EditableText";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { useSocket } from "./SocketContext";

export interface Text {
  content: string;
  id: string;
  x: number;
  y: number;
}

const TextsDiv = styled.div`
  position: absolute;
  color: ${getTextColorForBackground("#222")};
  font-family: "Patrick Hand", cursive;
  font-size: 30px;
`;

export const Texts: React.FC = () => {
  const [texts, setTexts] = useState<Record<string, Text>>({});

  const socket = useSocket();

  useSocketEvent("update-text", ({ id, x, y, ...rest }: Text) => {
    setTexts((texts) => ({
      ...texts,
      [id]: {
        ...rest,
        id,
        x: x * window.innerWidth,
        y: y * window.innerHeight,
      },
    }));
  });

  useSocketEvent("delete-text", ({ id }: Text) => {
    setTexts(({ [id]: a, ...texts }) => texts);
  });

  return (
    <>
      {Object.values(texts).map((text) => (
        <TextsDiv
          key={text.id}
          style={{
            top: text.y,
            left: text.x,
          }}
        >
          <EditableText
            inputStyle={{
              margin: 0,
              padding: 0,
              backgroundColor: "transparent",
              border: 0,
              color: getTextColorForBackground("#222"),
              fontSize: 30,
              fontFamily: '"Patrick Hand", cursive',
            }}
            onTextChanged={(content) => {
              socket.emit("update-text-content", {
                id: text.id,
                content,
              });
            }}
            value={text.content}
          />
        </TextsDiv>
      ))}
    </>
  );
};
