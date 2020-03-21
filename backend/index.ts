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
    if (usedNames.size === names.length) {
      usedNames.clear();
    }
    name = sample(names)!;
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

  socket.on("create-text", event => {
    const id = uuid.v4();
    const { x, y, color, content } = event;

    const newText: Text = {
      id,
      x,
      y,
      content,
      color
    };
    texts.set(id, newText);
    io.emit("update-text", newText);
  });

  socket.on("update-text-content", (updatedText: Text) => {
    texts.set(updatedText.id, updatedText);
    io.emit("update-text", updatedText);
  });

  socket.on("create-note", (event: Partial<Note>) => {
    const { x, y } = event;

    const newNote = notes.createNote({
      content: `crap\n // ${name} `,
      x,
      y
    });

    io.emit("update-note", newNote);
  });

  socket.on("move-note", event => {
    const { id, x, y } = event;
    const newNote = notes.updateNote(id, { x, y });

    if (!newNote) {
      return;
    }

    socket.broadcast.volatile.emit("update-note", newNote);
  });

  socket.on("drop-note", event => {
    const { id, x, y } = event;
    const newNote = notes.updateNote(id, { x, y });

    if (!newNote) {
      return;
    }

    io.emit("update-note", newNote);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("remove", { id });
  });
});
