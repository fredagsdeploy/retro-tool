import io from "socket.io-client";

const getEndpointUrl = () => {
  const secureProtocol = process.env.REACT_APP_WEBSOCKET_SECURE === "true";
  const portString = process.env.REACT_APP_WEBSOCKET_PORT;

  const protocol = secureProtocol ? "wss" : "ws";
  const port = portString ?? window.location.port;

  return `${protocol}:${window.location.hostname}:${port}`;
};

const endpoint = getEndpointUrl();

export const connectSocket = () => {
  const socket = io(endpoint);

  return {
    socket,
    cleanup: () => {
      socket.close();
    },
  };
};
