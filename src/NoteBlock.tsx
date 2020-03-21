import React from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

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

interface Props {
  socket: SocketIOClient.Socket;
}

export const NoteBlock = ({ socket }: Props) => {
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
