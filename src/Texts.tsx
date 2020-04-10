import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Text } from "../backend/interface";
import { FaCheck, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { getTextColorForBackground } from "./colors";
import { EditableText } from "./EditableText";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { useSocket } from "./SocketContext";
import Draggable, { DraggableData } from "react-draggable";
import { throttle } from "lodash-es";
import { useDragContextState } from "./hooks/useDragContextState";
import { EditTextInput } from "./EditTextInput";

const TextsDiv = styled.div`
  position: absolute;
  color: ${getTextColorForBackground("#222")};
  font-family: "Patrick Hand", cursive;
  font-size: 30px;
  display: flex;
  flex-direction: row;

  &:active,
  &:hover {
    .handle {
      border-color: white;
    }
  }

  .handle {
    position: absolute;
    left: -15px;
    cursor: move;
    color: white;
    border-right: 10px solid transparent;
    border-radius: 5px;
    height: 40px;
    width: 1px;
  }
`;

const EditControls = styled.div`
  display: flex;
  position: absolute;
  top: -50px;
`;

export const Texts: React.FC = () => {
  const [texts, setTexts] = useState<Record<string, Text>>({});
  const { setItem: setDragItem } = useDragContextState();
  const socket = useSocket();

  const deleteText = (id: string) => {
    setTexts(({ [id]: a, ...texts }) => texts);
    socket.emit("delete", {
      id,
    });
  };

  useSocketEvent("update-text", ({ id, x, y, size, ...rest }: Text) => {
    setTexts((texts) => ({
      ...texts,
      [id]: {
        ...rest,
        id,
        x: x * window.innerWidth,
        y: y * window.innerHeight,
        size: size,
      },
    }));
  });

  useSocketEvent("delete-text", ({ id }: Text) => {
    deleteText(id);
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

  const plusAction = (text: Text) => {
    setTexts((texts) => ({
      ...texts,
      [text.id]: {
        ...texts[text.id],
        size: text.size + 5,
      },
    }));
    socket.emit("update-text-content", {
      id: text.id,
      size: text.size + 5,
    });
  };

  const minusAction = (text: Text) => {
    setTexts((texts) => ({
      ...texts,
      [text.id]: {
        ...texts[text.id],
        size: text.size - 5,
      },
    }));
    socket.emit("update-text-content", {
      id: text.id,
      size: text.size - 5,
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
          <TextsDiv>
            <div className="handle" />
            <EditableText
              component={
                <div style={{ fontSize: text.size }}>{text.content}</div>
              }
              renderEditComponent={({ onDone, onCancel }) => (
                <>
                  <EditTextInput
                    selectAllOnMount
                    style={{
                      margin: 0,
                      padding: 0,
                      backgroundColor: "transparent",
                      border: 0,
                      color: getTextColorForBackground("#222"),
                      fontSize: text.size,
                      transition: "font-size 100ms ease-in-out",
                      fontFamily: '"Patrick Hand", cursive',
                    }}
                    defaultValue={text.content}
                    renderControls={({ onDone, onCancel }) => (
                      <EditControls>
                        <div
                          onClick={onDone}
                          style={{
                            color: "lightGrey",
                          }}
                        >
                          <FaCheck
                            style={{
                              color: "green",
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </div>
                        <div
                          onClick={() => {
                            deleteText(text.id);
                          }}
                        >
                          <FaTrash
                            style={{
                              color: "tomato",
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </div>
                        <div
                          onClick={(event: any) => {
                            event.preventDefault();
                            plusAction(text);
                          }}
                        >
                          <FaPlus
                            style={{
                              color: "white",
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </div>
                        <div
                          onClick={(event: any) => {
                            event.preventDefault();
                            minusAction(text);
                          }}
                        >
                          <FaMinus
                            style={{
                              color: "white",
                              width: "40px",
                              height: "40px",
                            }}
                          />
                        </div>
                      </EditControls>
                    )}
                    onDone={onDone}
                    onCancel={onCancel}
                    onBlur={() => {}}
                  />
                </>
              )}
              onTextChanged={(content: string) => {
                setTexts((texts) => ({
                  ...texts,
                  [text.id]: {
                    ...texts[text.id],
                    content,
                  },
                }));
                socket.emit("update-text-content", {
                  id: text.id,
                  content,
                });
              }}
            />
          </TextsDiv>
        </Draggable>
      ))}
    </>
  );
};
