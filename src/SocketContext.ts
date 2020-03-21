import { createContext, useContext } from "react";

const SocketContext = createContext<SocketIOClient.Socket>({} as any);

export const SocketContextProvider = SocketContext.Provider;
export const useSocket = () => useContext(SocketContext);
