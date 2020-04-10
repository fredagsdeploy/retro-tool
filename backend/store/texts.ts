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
      ...newParams,
    };

    texts.set(id, newText);

    return newText;
  };

  const createText = ({
    x,
    y,
    content,
    size,
  }: Pick<Text, "x" | "y" | "size" | "content" | "color">) => {
    const id = uuid.v4();

    const newText: Text = {
      content,
      color: generateRandomColor(),
      id,
      x,
      y,
      size: size || 30,
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
    deleteText,
  };
};
