import { sample } from "lodash";
import socketio from "socket.io";
import * as uuid from "uuid";
import { allNames } from "./allNames";
import { Note, Text, Token } from "./interface";
import { createNotesStore } from "./store/notes";
import { createTextsStore } from "./store/texts";
import { createTokensStore } from "./store/tokens";

const io = socketio(1234);
const usedNames = new Set<string>();

const notes = createNotesStore();
const texts = createTextsStore();
const tokens = createTokensStore();

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

  socket.on("mouse", (event) => {
    const { x, y } = event;
    socket.broadcast.volatile.emit("mouse", { x, y, id, name });
  });

  socket.on("create-token", (event) => {
    const newToken = tokens.createToken(event);
    io.emit("update-token", newToken);
  });

  socket.on("update-token", (token: Token) => {
    const newToken = tokens.updateToken(token.id, token);
    if (newToken) {
      io.emit("update-token", newToken);
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
      io.emit("drop-token", newToken);
    }
  });

  socket.on("delete-token", (token: Token) => {
    if (tokens.deleteToken(token.id)) {
      io.emit("delete-token", token.id);
    }
  });

  socket.on("create-text", (event: Text) => {
    const newText = texts.createText(event);
    io.emit("update-text", newText);
  });

  socket.on("update-text-content", (updatedText: Text) => {
    const newText = texts.updateText(updatedText.id, updatedText);
    if (newText) {
      io.emit("update-text", newText);
    }
  });

  socket.on("create-note", (event: Note) => {
    const newNote = notes.createNote({
      content: `crap\n // ${name} `,
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
      io.emit("update-note", newNote);
    }
  });
  socket.on("update-note-content", ({ id, content }: Note) => {
    const newNote = notes.updateNote(id, { content });
    if (newNote) {
      io.emit("update-note", newNote);
    }
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("remove", { id });
  });
});
