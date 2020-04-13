import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { SessionIdPayload } from "../backend/interface";
import { useSocket } from "./SocketContext";

interface Props {
  sessionId: string | null;
  setValidatedSessionId: (sessionId: string) => void;
}

export const CreateOrJoinPage: React.FC<Props> = ({
  setValidatedSessionId,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const socket = useSocket();
  useSocketEvent("session/join/accept", ({ sessionId }: SessionIdPayload) => {
    console.log("join-accept", sessionId);
    document.location.hash = `sessionId=${sessionId}`;
  });

  useSocketEvent("session/create/accept", ({ sessionId }: SessionIdPayload) => {
    setValidatedSessionId(sessionId);
    document.location.hash = `sessionId=${sessionId}`;
  });

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
          onChange={(e) => setSessionId(e.target.value)}
        />
        <Button
          title="join"
          onPress={() => {
            socket.emit("session/join/request", { sessionId });
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
