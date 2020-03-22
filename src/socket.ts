import io from "socket.io-client";

export const connectSocket = () => {
  const socket = io(`ws://${window.location.hostname}/ws`);

  return {
    socket,
    cleanup: () => {
      socket.close();
    }
  };
};
