import React, { useState, useEffect, useRef, useCallback } from "react";
import { MouseCursors } from "./MouseCursors";
import { connectSocket } from "./socket";
import { Notes } from "./Notes";
import { Text, Texts } from "./Texts";
import { Token, Tokens } from "./Tokens";
import { NoteBlock } from "./NoteBlock";
import { AddText } from "./AddText";
import { v4 as uuidv4 } from "uuid";
import { NewTextData } from "./AddText";

const initialTokenState: Record<string, Token> = {
  "tomato-token": {
    color: "tomato",
    id: "tomato-token2",
    x: 800,
    y: 50
  },
  "yellowgreen-token": {
    color: "yellowgreen",
    id: "yellowgreen-token1",
    x: 120,
    y: 190
  }
};

interface Props {}

export const App: React.FC<Props> = () => {
  const [tokens, setTokens] = useState<Record<string, Token>>(
    initialTokenState
  );
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
    <div>
      <NoteBlock />
      <AddText socket={socketRef.current} />
      <Notes socket={socketRef.current} />
      <Texts socket={socketRef.current} />
      <Tokens tokens={tokens} socket={socketRef.current} />
      <MouseCursors socket={socketRef.current} />
    </div>
  );
};
