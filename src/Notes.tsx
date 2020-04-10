import { throttle } from "lodash-es";
import React, { CSSProperties, useCallback, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";
import styled from "styled-components";
import { Note } from "../backend/interface";
import { getTextColorForBackground } from "./colors";
import { EditableText } from "./EditableText";
import { useSocket } from "./SocketContext";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { useDragContextState } from "./hooks/useDragContextState";

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [noteCreatedId, setNoteCreatedId] = useState<string | null>(null);

  useSocketEvent("update-note", ({ id, x, y, ...rest }: Note) => {
    setNotes((notes) => ({
      ...notes,
      [id]: {
        ...rest,
        id,
        x: x * window.innerWidth,
        y: y * window.innerHeight,
      },
    }));
  });

  useSocketEvent("create-note", ({ id, x, y, ...rest }: Note) => {
    setNoteCreatedId(id);
    setNotes((notes) => ({
      ...notes,
      [id]: {
        ...rest,
        id,
        x: x * window.innerWidth,
        y: y * window.innerHeight,
      },
    }));
  });

  useSocketEvent("delete-note", ({ id }: Note) => {
    setNotes(({ [id]: a, ...notes }) => notes);
  });

  const socket = useSocket();
  const { setItem } = useDragContextState();

  const handleDrag = useCallback(
    throttle(({ x, y }: DraggableData, noteId: string) => {
      socket.emit("move-note", {
        id: noteId,
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      });
    }, 100),
    [socket]
  );

  const handleDrop = ({ x, y }: DraggableData, noteId: string) => {
    setNotes((notes) => ({
      ...notes,
      [noteId]: {
        ...notes[noteId],
        x,
        y,
      },
    }));
    socket.emit("drop-note", {
      id: noteId,
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    });
  };

  return (
    <>
      {Object.values(notes).map((note) => (
        <Draggable
          key={note.id}
          handle=".handle"
          position={{ x: note.x, y: note.y }}
          onStart={() => setItem(note)}
          onDrag={(event, pos) => handleDrag(pos, note.id)}
          onStop={(event, pos) => handleDrop(pos, note.id)}
        >
          <div style={{ position: "absolute", zIndex: note.z }}>
            <NoteDiv
              style={{
                backgroundColor: note.color,
              }}
            >
              <NotesContent
                style={{
                  color: getTextColorForBackground(note.color),
                }}
              >
                <EditableText
                  multiline={true}
                  style={{
                    wordBreak: "break-all",
                  }}
                  initialEdit={noteCreatedId === note.id}
                  inputStyle={{
                    maxWidth: "100%",
                    margin: 0,
                    padding: 0,
                    backgroundColor: "transparent",
                    border: 0,
                    fontSize: "inherit",
                    color: getTextColorForBackground(note.color),
                    fontFamily: '"Patrick Hand", cursive',
                  }}
                  onTextChanged={(content) => {
                    socket.emit("update-note-content", {
                      id: note.id,
                      content,
                    });
                  }}
                  value={note.content}
                />
              </NotesContent>
            </NoteDiv>
          </div>
        </Draggable>
      ))}
    </>
  );
};

interface NoteProps {
  style?: CSSProperties;
  className?: string;
}

export const NoteDiv: React.FC<NoteProps> = ({
  style,
  className,
  children,
}) => (
  <NoteDivStyle style={style} className={className}>
    <GrabBar className="handle">
      <GrabHandle />
      <GrabHandle />
      <GrabHandle />
    </GrabBar>
    {children}
  </NoteDivStyle>
);

export const NoteDivStyle = styled.div`
  transition: transform 50ms linear;
  color: white;
  width: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
`;

const NotesContent = styled.div`
  padding: 0 20px 20px 20px;
  width: 120px;
`;

const GrabHandle = styled.div`
  height: 4px;
  margin-bottom: 2px;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
`;

const GrabBar = styled.div`
  padding: 5px 10px;
  :hover {
    cursor: move;
  }
  :active {
    cursor: grab;
  }
`;
