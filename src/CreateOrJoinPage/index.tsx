import React from "react";
import styled from "styled-components";
import { SessionIdPayload } from "../../backend/interface";
import { CreateSessionSection } from "./CreateSessionSection";
import { JoinSessionSection } from "./JoinSessionSection";

interface Props {
  sessionId: string | null;
  setSessionId: (sessionId: string) => void;
}

export const CreateOrJoinPage: React.FC<Props> = ({ setSessionId }) => {
  // const [name, setName] = useState<string>("");
  // const socket = useSocket();

  const sessionIdReceivedFromBackend = ({ sessionId }: SessionIdPayload) => {
    document.location.hash = `sessionId=${sessionId}`;
    setSessionId(sessionId);
  };

  return (
    <Container>
      <h1>Create a new room or join an existing one</h1>
      <h2>Who are you? So the group can recognize you.</h2>
      <TextInput type="text" />
      <Space />
      <CreateSessionSection
        setSessionId={(sessionId) => {
          sessionIdReceivedFromBackend({ sessionId });
        }}
      />
      <JoinSessionSection
        setSessionId={(sessionId) => {
          sessionIdReceivedFromBackend({ sessionId });
        }}
      />
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

export const Section = styled.div`
  border-radius: 5px;
  border: 3px solid white;
  padding: 30px;
  width: 30%;
  min-width: 300px;
  margin-top: 10px;
`;

interface ButtonProps {
  onPress: () => void;
  title: string;
}

export const TextInput = styled.input`
  background-color: #222222;
  color: white;
  border: 3px solid white;
  border-radius: 10px;
  font-size: 22px;
  max-width: 200px;
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
  min-width: 100px;
  border-radius: 100px;

  :hover {
    background-color: white;
    color: black;
  }

  :active {
    opacity: 0.8;
  }
`;

export const SectionTitle = styled.div`
  font-size: 28px;
  border-bottom: 2px solid white;
  margin-bottom: 30px;
`;

export const Space = styled.div`
  width: 30px;
  height: 30px;
`;
