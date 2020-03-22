import * as uuid from "uuid";
import { generateRandomColor } from "./notes";
import { Text } from "../interface";

export const createTextsStore = () => {
  const texts = new Map<string, Text>();

  const updateText = (
    id: string,
    newParams: Partial<Text>
  ): Text | undefined => {
    const oldText = texts.get(id);

    if (!oldText) {
      return undefined;
    }

    const newText: Text = {
      ...oldText,
      ...newParams
    };

    texts.set(id, newText);

    return newText;
  };

  const createText = ({
    x,
    y,
    content
  }: Pick<Text, "x" | "y" | "content" | "color">) => {
    const id = uuid.v4();

    const newText: Text = {
      content,
      color: generateRandomColor(),
      id,
      x,
      y
    };

    texts.set(id, newText);

    return newText;
  };

  const deleteText = (id: string) => {
    return texts.delete(id);
  };

  return {
    createText,
    updateText,
    deleteText
  };
};
