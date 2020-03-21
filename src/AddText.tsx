import React, { useState, useEffect, CSSProperties } from "react";
import Draggable from "react-draggable";
import { DraggableData } from "react-draggable";
import { FaCheck, FaTrash } from "react-icons/fa";
import { Text } from "../backend/interface";
import tinycolor from "tinycolor2";
import styled from "styled-components";

export interface NewTextData {
  x: number;
  y: number;
  content: string;
  color: string;
}

interface AddTextProps {
  socket: SocketIOClient.Socket;
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
          color: "#eee",
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

export const AddText = ({ socket }: AddTextProps) => {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

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
  color: ${tinycolor("#222").isLight() ? "black" : "white"};

  user-select: none;

  :hover {
    cursor: grab;
  }
  :active {
    cursor: grabbing;
  }
`;

const TheT = <StyledT>T</StyledT>;
