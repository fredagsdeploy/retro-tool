export const createTextsStore = () => {
  let largestZ = 0;
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
      z: largestZ++
    };

    texts.set(id, newText);

    return newText;
  };

  const createText = ({ x, y, content }: Pick<Text, "x" | "y" | "content">) => {
    const id = uuid.v4();

    const newText: Text = {
      content,
      color: generateRandomColor(),
      id,
      x,
      y,
      z: largestZ++
    };

    texts.set(id, newText);

    return newText;
  };

  return {
    createText,
    updateText
  };
};
