import socketio from "socket.io";
import * as uuid from "uuid";
import { sample } from "lodash";
import { Note, Text } from "./interface";
import { allNames } from "./allNames";
import { createNotesStore } from "./store/notes";
import { createTextsStore } from "./store/texts";

const io = socketio(1234);
const usedNames = new Set<string>();

const notes = createNotesStore();
const texts = createTextsStore();

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

io.on("connection", socket => {
  const id = uuid.v4();
  const name = generateUniqueName();

  socket.on("mouse", event => {
    const { x, y } = event;
    socket.broadcast.volatile.emit("mouse", { x, y, id, name });
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
      ...event
    });
    io.emit("update-note", newNote);
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

  socket.on("disconnect", () => {
    socket.broadcast.emit("remove", { id });
  });
});
