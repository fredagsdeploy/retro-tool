import React, { useState } from "react";
import { Button, Section, SectionTitle } from "./index";
import { useSocketEvent } from "../hooks/useSocketEvent";
import { SessionIdPayload } from "../../backend/interface";
import { useSocket } from "../SocketContext";

interface Props {
  setSessionId: (sessionId: string) => void;
}
export const CreateSessionSection: React.FC<Props> = ({ setSessionId }) => {
  const [sessionId, _setSessionId] = useState<null | string>(null);
  const socket = useSocket();
  useSocketEvent("session/create/accept", ({ sessionId }: SessionIdPayload) => {
    _setSessionId(sessionId);
  });

  return (
    <Section>
      <SectionTitle>Create new session</SectionTitle>
      <Button
        title="create"
        onPress={() => {
          socket.emit("session/create/request");
        }}
      />
      {sessionId !== null && (
        <>
          <h3>{sessionId ?? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}</h3>
          <div style={{ display: "flex" }}>
            <Button
              title="Go to session"
              onPress={() => {
                if (sessionId) {
                  setSessionId(sessionId);
                }
              }}
            />
            <Button
              title="copy session link"
              onPress={() => {
                if (sessionId) {
                  navigator.clipboard.writeText(
                    `${window.location}#sessionId=${sessionId}`
                  );
                }
              }}
            />
          </div>
        </>
      )}
    </Section>
  );
};
