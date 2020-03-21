import React from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { useSocket } from "./SocketContext";

const NoteBlockStyle = styled.div`
  background-color: yellowgreen;
  height: 100px;
  width: 120px;
  border-bottom: 10px solid #80af20;
  position: absolute;
  top: 10px;
  left: 10px;
  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

export const NoteBlock = () => {
  const socket = useSocket();

  return (
    <>
      <NoteBlockStyle />
      <Draggable
        position={{ x: 0, y: 0 }}
        onStop={(event: any, { x, y }) => {
          socket.emit("create-note", {
            x: x / window.innerWidth,
            y: y / window.innerHeight
          });
        }}
      >
        <NoteBlockStyle />
      </Draggable>
    </>
  );
};
