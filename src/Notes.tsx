import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  MouseEventHandler
} from "react";
import styled from "styled-components";
import Draggable from "react-draggable";
import { DraggableEvent, DraggableData } from "react-draggable";
import { Note } from "../backend/interface";
import { throttle } from "lodash-es";
import tinycolor from "tinycolor2";

interface NotesProps {
  socket: SocketIOClient.Socket;
}

interface NotesDivProps {
  color: string;
}

const NotesDiv = styled.div<NotesDivProps>`
  transition: transform 50ms linear;
  background-color: ${props => props.color};
  position: absolute;
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

export const Notes: React.FC<NotesProps> = ({ socket }) => {
  const [notes, setNotes] = useState<Record<string, Note>>({});

  useEffect(() => {
    socket.on("update-note", ({ id, x, y, ...rest }: Note) => {
      setNotes(notes => ({
        ...notes,
        [id]: {
          ...rest,
          id,
          x: x * window.innerWidth,
          y: y * window.innerHeight
        }
      }));
    });
  }, [socket]);

  const handleDrag = useCallback(
    throttle(({ x, y }: DraggableData, noteId: string) => {
      socket.emit("move-note", {
        id: noteId,
        x: x / window.innerWidth,
        y: y / window.innerHeight
      });
    }, 100),
    [socket]
  );

  const handleDrop = ({ x, y }: DraggableData, noteId: string) => {
    setNotes(notes => ({
      ...notes,
      [noteId]: {
        ...notes[noteId],
        x,
        y
      }
    }));
    socket.emit("drop-note", {
      id: noteId,
      x: x / window.innerWidth,
      y: y / window.innerHeight
    });
  };

  return (
    <>
      {Object.values(notes).map(note => (
        <Draggable
          key={note.id}
          handle=".handle"
          position={{ x: note.x, y: note.y }}
          onDrag={(event, pos) => handleDrag(pos, note.id)}
          onStop={(event, pos) => handleDrop(pos, note.id)}
        >
          <NotesDiv color={note.color} style={{ zIndex: note.z }}>
            <GrabBar className="handle">
              <GrabHandle />
              <GrabHandle />
              <GrabHandle />
            </GrabBar>
            <NotesContent
              style={{
                color: tinycolor(note.color).isLight() ? "black" : "white"
              }}
            >
              {note.content.split("\n").map((text, index) => (
                <Fragment key={index}>
                  <span>{text}</span>
                  <br />
                </Fragment>
              ))}
            </NotesContent>
          </NotesDiv>
        </Draggable>
      ))}
    </>
  );
};
