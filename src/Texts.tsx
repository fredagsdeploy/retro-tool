import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { getTextColorForBackground } from "./colors";
import { EditableText } from "./EditableText";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { useSocket } from "./SocketContext";
import Draggable, { DraggableData } from "react-draggable";
import { throttle } from "lodash-es";
import { useDragContextState } from "./hooks/useDragContextState";

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
  const { setItem: setDragItem } = useDragContextState();
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

  const handleDrag = useCallback(
    throttle(({ x, y }: DraggableData, textId: string) => {
      socket.emit("move-text", {
        id: textId,
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      });
    }, 100),
    [socket]
  );

  const handleDrop = ({ x, y }: DraggableData, textId: string) => {
    setTexts((texts) => ({
      ...texts,
      [textId]: {
        ...texts[textId],
        x,
        y,
      },
    }));
    socket.emit("drop-text", {
      id: textId,
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    });
  };

  return (
    <>
      {Object.values(texts).map((text) => (
        <Draggable
          key={text.id}
          handle=".handle"
          position={{ x: text.x, y: text.y }}
          onStart={() => setDragItem(text)}
          onDrag={(event, pos) => handleDrag(pos, text.id)}
          onStop={(event, pos) => handleDrop(pos, text.id)}
        >
          <TextsDiv className="handle">
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
        </Draggable>
      ))}
    </>
  );
};
