import React, { useEffect, useRef, useState } from "react";
import { MouseCursors } from "./MouseCursors";
import { connectSocket } from "./socket";
import { Notes } from "./Notes";
import { Texts } from "./Texts";
import { Tokens } from "./Tokens";
import { NoteBlock } from "./NoteBlock";
import { AddText } from "./AddText";
import { TokensPile } from "./TokensPile";
import { SocketContextProvider, useSocket } from "./SocketContext";
import { FaTrash } from "react-icons/fa";
import styled from "styled-components";
import {
  DragContextProvider,
  useDragContextState,
} from "./hooks/useDragContextState";
import { TrashCan } from "./TrashCan";

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
      <DragContextProvider>
        <NoteBlock />
        <AddText />
        <TokensPile />
        <Notes />
        <Texts />
        <Tokens />
        <MouseCursors />
        <TrashCan />
      </DragContextProvider>
    </SocketContextProvider>
  );
};
