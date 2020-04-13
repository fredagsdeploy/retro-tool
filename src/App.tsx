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
import { CreateOrJoinPage } from "./CreateOrJoinPage";

interface Props {}

export const App: React.FC<Props> = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [connectedToRetroSpace, setConnectedToRetroSpace] = useState<boolean>(
    false
  );
  const [user, setUser] = useState<User | null>(null);
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  const retroSpaceSocketRef = useRef<SocketIOClient.Socket | null>(null);

  const urlParams = new URLSearchParams(window.location.hash.substr(1));
  const [sessionId, setSessionId] = useState<string | null>(
    urlParams.get("sessionId")
  );

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

  useEffect(() => {
    if (sessionId === null) {
      return;
    }
    const { socket, cleanup } = connectSocket(sessionId);
    const callback = ({ id, name }: User) => {
      console.log("hello retro space", { id, name });
      setUser({ id, name });
    };
    socket.on("hello", callback);
    retroSpaceSocketRef.current = socket;

    setConnectedToRetroSpace(true);

    return () => {
      socket.off("hello", callback);
      setConnected(false);
      cleanup();
    };
  }, [sessionId]);

  if (!connected || !socketRef.current || !user) {
    return null;
  }

  if (sessionId === null) {
    return (
      <SocketContextProvider value={socketRef.current}>
        <CreateOrJoinPage sessionId={sessionId} setSessionId={setSessionId} />
      </SocketContextProvider>
    );
  }

  if (!connectedToRetroSpace || !retroSpaceSocketRef.current || !user) {
    return null;
  }

  return (
    <SocketContextProvider value={retroSpaceSocketRef.current}>
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
