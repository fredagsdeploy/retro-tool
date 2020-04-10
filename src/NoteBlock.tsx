import React from "react";
import styled from "styled-components";
import { useSocket } from "./SocketContext";
import { DragDuplicated } from "./DragDuplicated";
import { Pushpin } from "./Pushpin";

interface StyledProps {
  color: string;
  rotate?: string;
}

const NoteBlockContainer = styled.div`
  height: 100px;
  width: 140px;
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 8px 2px rgba(0,0,0,0.2);
  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

const NoteBlockNote = styled.div<StyledProps>`
  position: absolute;
  background-color: ${props => props.color};
  transform: ${props => props.rotate && `rotate(${props.rotate})`};
  height: 100%;
  width: 100%;
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
      <NoteBlockContainer>
        <NoteBlockNote color={"#8bc34a"} rotate={"5deg"} />
        <NoteBlockNote color={"#2196f3"} rotate={"-5deg"} />
        <NoteBlockNote color={"#ffeb3b"} />
        <Pushpin color={"#ffeb3b"} />
      </NoteBlockContainer>
    </DragDuplicated>
  );
};
