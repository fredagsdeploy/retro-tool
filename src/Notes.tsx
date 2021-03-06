import { throttle } from "lodash-es";
import React, { useCallback, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";
import styled from "styled-components";
import { Note } from "../backend/interface";
import { getTextColorForBackground } from "./colors";
import { Pushpin } from "./Pushpin";
import { EditableText } from "./EditableText";
import { useSocket } from "./SocketContext";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { useDragContextState } from "./hooks/useDragContextState";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { EditTextInput } from "./EditTextInput";

interface Props {
  userId: string;
}

export const Notes: React.FC<Props> = ({ userId }) => {
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
        z: 9999999999,
      },
    }));
    socket.emit("drop-note", {
      id: noteId,
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    });
  };

  const togglePrivate = (noteId: string, secret: boolean) => {
    setNotes((notes) => ({
      ...notes,
      [noteId]: {
        ...notes[noteId],
        secret: !secret,
      },
    }));
    socket.emit("update-note", {
      id: noteId,
      secret: !secret,
    });
  };

  return (
    <>
      {Object.values(notes).map((note) => {
        const ownedByMe = note.ownedBy === userId;
        const shouldShowText = ownedByMe || !note.secret;

        const visibleText = {
          color: getTextColorForBackground(note.color),
        };
        const blurryText = {
          color: "transparent",
          textShadow: `0 0 10px ${getTextColorForBackground(note.color)}`,
        };
        const textStyle = shouldShowText ? visibleText : blurryText;

        return (
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
                color={note.color}
                className={note.secret ? "private" : "public"}
              >
                <NotesContent style={textStyle}>
                  <EditableText
                    renderEditComponent={({ onDone, onCancel }) => (
                      <EditTextInput
                        multiline={true}
                        selectAllOnMount
                        style={{
                          ...textStyle,
                          maxWidth: "100%",
                          margin: 0,
                          padding: 0,
                          backgroundColor: "transparent",
                          border: 0,
                          fontSize: "inherit",
                          fontFamily: '"Patrick Hand", cursive',
                        }}
                        defaultValue={note.content}
                        onDone={onDone}
                        onCancel={onCancel}
                      />
                    )}
                    style={{
                      wordBreak: "break-word",
                      padding: "0 1rem 1rem",
                    }}
                    initialEdit={noteCreatedId === note.id}
                    onTextChanged={(content) => {
                      setNotes((notes) => ({
                        ...notes,
                        [note.id]: {
                          ...notes[note.id],
                          content,
                        },
                      }));
                      socket.emit("update-note", {
                        id: note.id,
                        content,
                      });
                    }}
                    component={note.content}
                  />
                </NotesContent>
                {note.ownedBy === userId && (
                  <div onClick={() => togglePrivate(note.id, note.secret)}>
                    <div className="eye-icon">
                      <NotVisibleIcon className="notVisibleIcon" />
                      <VisibleIcon className="visibleIcon" />
                    </div>
                  </div>
                )}
              </NoteDiv>
            </div>
          </Draggable>
        );
      })}
    </>
  );
};

interface NoteProps {
  color: string;
  className?: string;
}

export const NoteDiv: React.FC<NoteProps> = ({
  color,
  className,
  children,
}) => (
  <NoteDivStyle
    style={{
      backgroundColor: color,
    }}
    className={className}
  >
    <Pushpin className="handle" color={color} />
    {children}
  </NoteDivStyle>
);

export const NoteDivStyle = styled.div`
  transition: transform 50ms linear;
  color: white;
  min-height: 100px;
  width: 140px;
  box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.2);
  font-family: "Patrick Hand", cursive;
  font-size: 18px;
  align-items: center;
  display: flex;
  flex-direction: column;

  .visibleIcon,
  .notVisibleIcon {
    transition: opacity 200ms ease-in-out;
  }

  &.private .notVisibleIcon {
    opacity: 1;
  }

  &.public .eye-icon:hover .visibleIcon {
    opacity: 0;
  }

  &.public .eye-icon:hover .notVisibleIcon {
    opacity: 1;
  }

  &.public:hover .visibleIcon {
    opacity: 1;
  }
`;

const NotesContent = styled.div`
  width: 100%;
`;

const VisibleIcon = styled(FaEye)`
  opacity: 0;
  color: black;
  position: absolute;
  top: 3px;
  right: 3px;
  cursor: pointer;
`;

const NotVisibleIcon = styled(FaEyeSlash)`
  opacity: 0;
  color: black;
  position: absolute;
  top: 3px;
  right: 3px;
  cursor: pointer;
`;
