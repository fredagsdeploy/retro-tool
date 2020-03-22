import * as uuid from "uuid";
import { generateRandomColor } from "./notes";
import { Token } from "../interface";

export const createTokensStore = () => {
  const Tokens = new Map<string, Token>();

  const updateToken = (
    id: string,
    newParams: Partial<Token>
  ): Token | undefined => {
    const oldToken = Tokens.get(id);

    if (!oldToken) {
      return undefined;
    }

    const newToken: Token = {
      ...oldToken,
      ...newParams
    };

    Tokens.set(id, newToken);

    return newToken;
  };

  const createToken = ({ x, y, color }: Pick<Token, "x" | "y" | "color">) => {
    const id = uuid.v4();

    const newToken: Token = {
      color,
      id,
      x,
      y
    };

    Tokens.set(id, newToken);

    return newToken;
  };

  const deleteToken = (id: string) => {
    return Tokens.delete(id);
  };

  return {
    createToken,
    updateToken,
    deleteToken
  };
};
