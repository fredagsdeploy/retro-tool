import React, { useState } from "react";
import Draggable from "react-draggable";

export interface NewTextData {
  x: number;
  y: number;
  content: string;
}

interface AddTextProps {
  textDropped: (e: NewTextData) => void;
}

interface InputTextFieldProps {
  done: (event: NewTextData) => void;
  cancel: () => void;
  newTextData: NewTextData;
}

const InputTextField = ({ done, cancel, newTextData }: InputTextFieldProps) => {
  return (
    <div>
      <div onClick={() => done(newTextData)}>Done</div>
      <div onClick={cancel}>Cancel</div>
      <input
        style={{ borderWidth: "10px" }}
        type="text"
        id="fname"
        name="fname"
      ></input>
    </div>
  );
};

export const AddText = ({ textDropped }: AddTextProps) => {
  const [newTextData, setNewTextData] = useState<NewTextData | null>();

  return (
    <>
      {newTextData && (
        <InputTextField
          done={() => {
            textDropped(newTextData);
            setNewTextData(null);
          }}
          cancel={() => {
            setNewTextData(null);
          }}
          newTextData={newTextData}
        />
      )}
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          fontSize: "72px",
          fontFamily: "Times"
        }}
      >
        T
      </span>
      <Draggable
        onStop={(e: any) => {
          setNewTextData({ x: e.clientX, y: e.clientY, content: "" });
        }}
        position={{ x: 0, y: 0 }}
      >
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: "72px",
            fontFamily: "Times"
          }}
        >
          T
        </span>
      </Draggable>
    </>
  );
};
