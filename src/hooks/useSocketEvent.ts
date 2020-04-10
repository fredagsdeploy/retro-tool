import { useSocket } from "../SocketContext";
import { useLatest } from "./useLatest";
import { useEffect } from "react";

export const useSocketEvent = <T extends Function>(
  event: string,
  callback: T
) => {
  const socket = useSocket();
  const latestCallback = useLatest(callback);
  useEffect(() => {
    const cb = (...args: any[]) => {
      latestCallback.current(...args);
    };
    socket.on(event, cb);
    return () => {
      socket.off(event, cb);
    };
  }, [event, socket, latestCallback]);
};
