import { sample } from "lodash";
import socketio from "socket.io";
import * as uuid from "uuid";
import { allNames } from "./allNames";
import {
  Note,
  SessionIdPayload,
  SetNameRequest,
  Text,
  Token,
} from "./interface";
import { createNotesStore } from "./store/notes";
import { createTextsStore } from "./store/texts";
import { createTokensStore } from "./store/tokens";

let port = 1234;
console.log(`Hosting on port ${port}`);
const io = socketio(port);
const usedNames = new Set<string>();

const generateUniqueName = () => {
  let name = "";
  do {
    if (usedNames.size === allNames.length) {
      usedNames.clear();
    }
    name = sample(allNames)!;
  } while (usedNames.has(name));
  usedNames.add(name);
  return name;
};

io.on("connection", (socket) => {
  const id = uuid.v4();
  const name = generateUniqueName();

  const user = {
    id,
    name,
  };

  socket.emit("hello", user);

  socket.on("session/create/request", () => {
    const sessionId = uuid.v4();
    createRetroSession(sessionId);
    socket.emit("session/create/accept", { sessionId });
  });

  socket.on("session/join/request", ({ sessionId }: SessionIdPayload) => {
    socket.emit("session/join/accept", { sessionId });
  });
});

const createRetroSession = (sessionId: string) => {
  const notes = createNotesStore();
  const texts = createTextsStore();
  const tokens = createTokensStore();

  const nameSpace = sessionId;
  io.of(nameSpace).on("connection", (socket) => {
    const id = uuid.v4();
    const name = generateUniqueName();

    const user = {
      id,
      name,
    };
    socket.emit("hello", user);

    tokens.Tokens.forEach((t) => socket.emit("update-token", t));
    notes.notes.forEach((n) => socket.emit("update-note", n));
    texts.texts.forEach((t) => socket.emit("update-text", t));

    socket.on("session/user/set-name", ({ name }: SetNameRequest) => {
      user.name = name;
    });

    socket.on("mouse", (event) => {
      const { x, y } = event;
      socket.broadcast.volatile.emit("mouse", { x, y, id, name });
    });

    socket.on("create-token", (event) => {
      const newToken = tokens.createToken(event);

      io.of(nameSpace).emit("update-token", newToken);
    });

    socket.on("update-token", (token: Token) => {
      const newToken = tokens.updateToken(token.id, token);
      if (newToken) {
        io.of(nameSpace).emit("update-token", newToken);
      }
    });

    socket.on("move-token", (token: Token) => {
      const newToken = tokens.updateToken(token.id, token);
      if (newToken) {
        socket.broadcast.volatile.emit("update-token", newToken);
      }
    });

    socket.on("drop-token", (token: Token) => {
      const newToken = tokens.updateToken(token.id, token);
      if (newToken) {
        io.of(nameSpace).emit("drop-token", newToken);
      }
    });

    socket.on("delete", ({ id }: { id: string }) => {
      if (tokens.deleteToken(id)) {
        io.of(nameSpace).emit("delete-token", { id });
      } else if (texts.deleteText(id)) {
        io.of(nameSpace).emit("delete-text", { id });
      } else if (notes.deleteNote(id)) {
        io.of(nameSpace).emit("delete-note", { id });
      }
    });

    socket.on("create-text", (event: Text) => {
      const newText = texts.createText(event);
      io.of(nameSpace).emit("update-text", newText);
    });

    socket.on("update-text-content", (updatedText: Text) => {
      const newText = texts.updateText(updatedText.id, updatedText);
      if (newText) {
        io.of(nameSpace).emit("update-text", newText);
      }
    });

    socket.on("move-text", ({ id, x, y }: Text) => {
      const newText = texts.updateText(id, { x, y });
      if (newText) {
        socket.broadcast.volatile.emit("update-text", newText);
      }
    });

    socket.on("create-note", (event: Note) => {
      const newNote = notes.createNote({
        ownedBy: user.id,
        content: `crap\n // ${name} `,
        secret: true,
        ...event,
      });
      socket.broadcast.emit("update-note", newNote);
      socket.emit("create-note", newNote);
    });

    socket.on("move-note", ({ id, x, y }: Note) => {
      const newNote = notes.updateNote(id, { x, y });
      if (newNote) {
        socket.broadcast.volatile.emit("update-note", newNote);
      }
    });

    socket.on("drop-note", ({ id, x, y }: Note) => {
      const newNote = notes.updateNote(id, { x, y });
      if (newNote) {
        io.of(nameSpace).emit("update-note", newNote);
      }
    });
    socket.on("update-note", (note: Note) => {
      const newNote = notes.updateNote(note.id, note);
      if (newNote) {
        io.of(nameSpace).emit("update-note", newNote);
      }
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("remove", { id });
      socket.removeAllListeners();
    });
  });
};
