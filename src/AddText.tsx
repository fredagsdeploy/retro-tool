import React, { CSSProperties, useState } from "react";
import Draggable from "react-draggable";
import { FaCheck, FaTrash } from "react-icons/fa";
import styled from "styled-components";
import { getTextColorForBackground } from "./colors";
import { useSocket } from "./SocketContext";

export interface NewTextData {
  x: number;
  y: number;
  content: string;
  color: string;
}

interface InputTextFieldProps {
  done: (text: string) => void;
  cancel: () => void;
  style: CSSProperties;
}

const InputTextField = ({ done, cancel, style }: InputTextFieldProps) => {
  const [newTextData, setNewTextData] = useState<string>("");

  return (
    <div style={style}>
      <input
        autoFocus
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "transparent",
          border: 0,
          color: getTextColorForBackground("#222"),
          fontSize: 30,
          fontFamily: '"Patrick Hand", cursive'
        }}
        type="text"
        onKeyDown={e => {
          if (e.key === "Enter") {
            done(newTextData);
          }
        }}
        onChange={e => setNewTextData(e.target.value)}
        value={newTextData}
      />
      <div
        style={{
          display: "flex"
        }}
      >
        <div
          onClick={() => done(newTextData)}
          style={{
            color: "lightGrey"
          }}
        >
          <FaCheck style={{ color: "green", width: "40px", height: "40px" }} />
        </div>
        <div onClick={cancel}>
          <FaTrash style={{ color: "tomato", width: "40px", height: "40px" }} />
        </div>
      </div>
    </div>
  );
};

export const AddText: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const socket = useSocket();

  return (
    <>
      {pos && (
        <InputTextField
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            display: "flex",
            flexDirection: "column"
          }}
          done={content => {
            socket.emit("create-text", {
              content,
              x: pos.x / window.innerWidth,
              y: pos.y / window.innerHeight,
              color: "black"
            });
            setPos(null);
          }}
          cancel={() => {
            setPos(null);
          }}
        />
      )}
      {TheT}
      <Draggable
        onStart={() => {
          setPos(null);
        }}
        onStop={(e: any) => {
          setPos({ x: e.pageX, y: e.pageY });
        }}
        position={{ x: 0, y: 0 }}
      >
        {TheT}
      </Draggable>
    </>
  );
};

const StyledT = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 72px;
  font-family: Times;
  color: ${getTextColorForBackground("#222")};

  user-select: none;

  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

const TheT = <StyledT>T</StyledT>;
