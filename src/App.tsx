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
import { DragContextProvider } from "./hooks/useDragContextState";
import { TrashCan } from "./TrashCan";
import { User } from "../backend/interface";

interface Props {}

export const App: React.FC<Props> = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const { socket, cleanup } = connectSocket();
    const callback = ({ id, name }: User) => {
      console.log("hello", { id, name });
      setUser({ id, name });
    };
    socket.on("hello", callback);
    socketRef.current = socket;

    setConnected(true);

    return () => {
      socket.off("hello", callback);
      setConnected(false);
      cleanup();
    };
  }, []);

  if (!connected || !socketRef.current || !user) {
    return null;
  }

  return (
    <SocketContextProvider value={socketRef.current}>
      <DragContextProvider>
        <NoteBlock />
        <AddText />
        <TokensPile />
        <Notes userId={user.id} />
        <Texts />
        <Tokens />
        <MouseCursors />
        <TrashCan />
      </DragContextProvider>
    </SocketContextProvider>
  );
};
