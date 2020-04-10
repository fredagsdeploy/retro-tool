import React, { useEffect, useRef, useState } from "react";
import { MouseCursors } from "./MouseCursors";
import { connectSocket } from "./socket";
import { Notes } from "./Notes";
import { Texts } from "./Texts";
import { Tokens } from "./Tokens";
import { NoteBlock } from "./NoteBlock";
import { AddText } from "./AddText";
import { TokensPile } from "./TokensPile";
import { SocketContextProvider } from "./SocketContext";
import { FaTrash } from "react-icons/fa";
import styled from "styled-components";

interface Props {}

export const App: React.FC<Props> = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const { socket, cleanup } = connectSocket();
    socketRef.current = socket;
    setConnected(true);

    return () => {
      setConnected(false);
      cleanup();
    };
  }, []);

  if (!connected || !socketRef.current) {
    return null;
  }

  return (
    <SocketContextProvider value={socketRef.current}>
      <NoteBlock />
      <AddText />
      <TokensPile />
      <Notes />
      <Texts />
      <Tokens />
      <MouseCursors />
      <TrashCanDiv>
        <FaTrash
          className="trash"
          onMouseUp={() => {
            console.log("TRASH THE CRAP");
          }}
          onMouseMove={() => {
            console.log("Mouse over trash", Math.random());
          }}
        />
      </TrashCanDiv>
    </SocketContextProvider>
  );
};

const TrashCanDiv = styled.div`
  position: fixed;
  z-index: 100;
  bottom: 100px;
  left: 50%;

  .trash {
    z-index: 100;
    width: 72px;
    height: 72px;
    position: relative;
    transition: transform 100ms ease-in-out;
  }

  :hover {
    bottom: 110px;

    .trash {
      transform: scale(1.2) translateY(-30px);
    }
  }
`;
