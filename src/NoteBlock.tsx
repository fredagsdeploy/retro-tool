import React, { useState } from "react";
import styled from "styled-components";
import { useSocket } from "./SocketContext";
import { DragDuplicated } from "./DragDuplicated";
import { Pushpin } from "./Pushpin";
import { padStart, range, drop } from "lodash-es";

interface StyledProps {
  color: string;
  rotate?: string;
}

const NoteBlockContainer = styled.div`
  height: 100px;
  width: 140px;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.2);
  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

const NoteBlockNote = styled.div<StyledProps>`
  position: absolute;
  background-color: ${(props) => props.color};
  transform: ${(props) => props.rotate && `rotate(${props.rotate})`};
  height: 100%;
  width: 100%;
`;

export const generateRandomColor = () =>
  "#" + padStart(Math.random().toString(16).substr(2, 6), 6, "0");

export const NoteBlock = () => {
  const socket = useSocket();

  const [colors, setColors] = useState(
    range(10).map(() => generateRandomColor())
  );

  return (
    <div style={{ position: "absolute", top: 20, left: 20 }}>
      <DragDuplicated
        dragChild={
          <NoteBlockContainer>
            <NoteBlockNote color={colors[0]} />

            <Pushpin color={colors[0]} />
          </NoteBlockContainer>
        }
        onDrop={({ x, y }) => {
          setColors((colors) => [...drop(colors), generateRandomColor()]);
          socket.emit("create-note", {
            x,
            y,
            color: colors[0],
          });
        }}
      >
        <NoteBlockContainer>
          {drop(colors)
            .concat()
            .reverse()
            .map((color, index, arr) => {
              return (
                <NoteBlockNote
                  key={index}
                  color={color}
                  rotate={index % 2 === 0 ? `5deg` : `-5deg`}
                />
              );
            })}
        </NoteBlockContainer>
      </DragDuplicated>
    </div>
  );
};
