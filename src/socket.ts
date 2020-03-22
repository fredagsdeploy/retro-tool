import io from "socket.io-client";

export const connectSocket = () => {
  const socket = io(`wss://${window.location.hostname}/ws`);

  return {
    socket,
    cleanup: () => {
      socket.close();
    }
  };
};
