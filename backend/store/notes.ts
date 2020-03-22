import * as uuid from "uuid";
import { Note } from "../interface";

export const generateRandomColor = () =>
  "#" +
  Math.random()
    .toString(16)
    .substring(9);

export const createNotesStore = () => {
  let largestZ = 0;
  const notes = new Map<string, Note>();

  const updateNote = (
    id: string,
    newParams: Partial<Note>
  ): Note | undefined => {
    const oldNote = notes.get(id);

    if (!oldNote) {
      return undefined;
    }

    const newNote: Note = {
      ...oldNote,
      ...newParams,
      z: largestZ++
    };

    notes.set(id, newNote);

    return newNote;
  };

  const createNote = ({ x, y, content }: Pick<Note, "x" | "y" | "content">) => {
    const id = uuid.v4();

    const newNote: Note = {
      content,
      color: generateRandomColor(),
      id,
      x,
      y,
      z: largestZ++
    };

    notes.set(id, newNote);

    return newNote;
  };

  const deleteNote = (id: string) => {
    return notes.delete(id);
  };

  return {
    createNote,
    updateNote,
    deleteNote
  };
};
