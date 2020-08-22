import React, { useState } from "react";
import { Button, Section, SectionTitle, Space, TextInput } from "./index";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { SessionIdPayload } from "../../backend/interface";
import { useSocket } from "../SocketContext";

interface Props {
  setSessionId: (sessionId: string) => void;
}
export const JoinSessionSection: React.FC<Props> = ({ setSessionId }) => {
  const [sessionId, _setSessionId] = useState<string | null>(null);
  const socket = useSocket();
  useSocketEvent("session/join/accept", ({ sessionId }: SessionIdPayload) =>
    setSessionId(sessionId)
  );

  return (
    <Section>
      <SectionTitle>Join an existing session</SectionTitle>
      <div style={{ marginTop: 30 }}>
        <TextInput
          type="text"
          onChange={(e) => _setSessionId(e.target.value)}
        />
        <Space />
        <Button
          title="join"
          onPress={() => {
            socket.emit("session/join/request", { sessionId });
          }}
        />
      </div>
    </Section>
  );
};
