import React, { useState } from "react";
import styled from "styled-components";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { SessionIdPayload } from "../backend/interface";
import { useSocket } from "./SocketContext";

interface Props {
  sessionId: string | null;
  setSessionId: (sessionId: string) => void;
}

export const CreateOrJoinPage: React.FC<Props> = ({ setSessionId }) => {
  const [sessionIdToJoin, setSessionIdToJoin] = useState<string | null>(null);
  console.log("Create or join page");
  const socket = useSocket();

  const sessionIdReceivedFromBackend = ({ sessionId }: SessionIdPayload) => {
    document.location.hash = `sessionId=${sessionId}`;
    setSessionId(sessionId);
  };

  useSocketEvent("session/join/accept", sessionIdReceivedFromBackend);
  useSocketEvent("session/create/accept", sessionIdReceivedFromBackend);

  return (
    <Container>
      <h1>Create a new room or join an existing one</h1>
      <Button
        title="create"
        onPress={() => {
          socket.emit("session/create/request");
        }}
      />

      <div style={{ marginTop: 30 }}>
        <RoomCodeInput
          type="text"
          onChange={(e) => setSessionIdToJoin(e.target.value)}
        />
        <Button
          title="join"
          onPress={() => {
            socket.emit("session/join/request", { sessionId: sessionIdToJoin });
          }}
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  color: white;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: "Patrick Hand", cursive;
  margin: 30px;
`;

interface ButtonProps {
  onPress: () => void;
  title: string;
}

const RoomCodeInput = styled.input`
  background-color: #222222;
  color: white;
  border: 3px solid white;
  border-radius: 10px;
  font-size: 22px;
`;

export const Button: React.FC<ButtonProps> = ({ onPress, title }) => {
  return <StyledButton onClick={onPress}>{title}</StyledButton>;
};

const StyledButton = styled.div`
  display: flex;
  text-transform: uppercase;
  font-family: "Patrick Hand", cursive;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  border: 3px solid white;
  padding: 10px;
  width: 100px;
  border-radius: 100px;

  :hover {
    background-color: white;
    color: black;
    font-size: 18px;
    padding-bottom: 9px;
    padding-top: 9px;
  }

  :active {
    opacity: 0.8;
  }
`;
