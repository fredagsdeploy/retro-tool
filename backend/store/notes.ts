import * as uuid from "uuid";
import { Note } from "../interface";
import { padStart } from "lodash";

export const generateRandomColor = () =>
  "#" + padStart(Math.random().toString(16).substr(2, 6), 6, "0");

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
      z: largestZ++,
    };

    notes.set(id, newNote);

    return newNote;
  };

  const createNote = ({
    x,
    y,
    content,
    ownedBy,
    secret,
    color,
  }: Omit<Note, "id" | "z">) => {
    const id = uuid.v4();

    const newNote: Note = {
      ownedBy,
      content,
      secret,
      color: color || generateRandomColor(),
      id,
      x,
      y,
      z: largestZ++,
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
    deleteNote,
  };
};
