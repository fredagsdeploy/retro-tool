import React, { CSSProperties, useState } from "react";
import Draggable from "react-draggable";
import { FaCheck, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
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
  done: (text: string, size: number) => void;
  cancel: () => void;
  style: CSSProperties;
}

const InputTextField = ({ done, cancel, style }: InputTextFieldProps) => {
  const [newTextData, setNewTextData] = useState<string>("");
  const [size, setSize] = useState<number>(30);

  return (
    <div style={style}>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "-50px",
        }}
      >
        <div
          onClick={() => done(newTextData, size)}
          style={{
            color: "lightGrey",
          }}
        >
          <FaCheck style={{ color: "green", width: "40px", height: "40px" }} />
        </div>
        <div onClick={cancel}>
          <FaTrash style={{ color: "tomato", width: "40px", height: "40px" }} />
        </div>
        <div onClick={() => setSize((s) => s + 5)}>
          <FaPlus style={{ color: "white", width: "40px", height: "40px" }} />
        </div>
        <div onClick={() => setSize((s) => s - 5)}>
          <FaMinus style={{ color: "white", width: "40px", height: "40px" }} />
        </div>
      </div>
      <input
        autoFocus
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "transparent",
          border: 0,
          color: getTextColorForBackground("#222"),
          fontSize: size,
          fontFamily: '"Patrick Hand", cursive',
        }}
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            done(newTextData, size);
          }
        }}
        onChange={(e) => setNewTextData(e.target.value)}
        value={newTextData}
      />
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
            flexDirection: "column",
          }}
          done={(content, size) => {
            socket.emit("create-text", {
              content,
              size,
              x: pos.x / window.innerWidth,
              y: pos.y / window.innerHeight,
              color: "black",
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
  left: 70px;
  top: 220px;
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
