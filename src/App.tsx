import React, { useState, useEffect, useRef } from "react";
import { MouseCursors } from "./MouseCursors";
import { connectSocket } from "./socket";
import { Notes } from "./Notes";
import { Texts } from "./Texts";
import { Tokens } from "./Tokens";
import { NoteBlock } from "./NoteBlock";
import { AddText } from "./AddText";
import { TokensPile } from "./TokensPile";
import { SocketContextProvider } from "./SocketContext";

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
      <div>
        <NoteBlock />
        <AddText />
        <TokensPile />
        <Notes />
        <Texts />
        <Tokens />
        <MouseCursors />
      </div>
    </SocketContextProvider>
  );
};
