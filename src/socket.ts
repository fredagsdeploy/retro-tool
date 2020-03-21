import io from "socket.io-client";

export const connectSocket = () => {
  const socket = io(`ws://${window.location.hostname}:1234`);

  return {
    socket,
    cleanup: () => {
      socket.close();
    }
  };
};
