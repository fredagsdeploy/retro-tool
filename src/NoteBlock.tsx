import React from "react";
import styled from "styled-components";
import { useSocket } from "./SocketContext";
import { DragDuplicated } from "./DragDuplicated";

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
    <DragDuplicated
      onDrop={({ x, y }) => {
        socket.emit("create-note", {
          x,
          y
        });
      }}
    >
      <NoteBlockStyle />
    </DragDuplicated>
  );
};
