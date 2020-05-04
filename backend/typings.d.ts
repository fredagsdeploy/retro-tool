declare module "adjective-adjective-animal" {
  export type StringFormat =
    | "upper"
    | "lower"
    | "sentence"
    | "title"
    | "camel"
    | "pascal"
    | "snake"
    | "param"
    | "dot"
    | "path"
    | "constant"
    | "swap"
    | "ucFirst"
    | "lcFirst";

  /***
   * Generates a reasonably secure and unique string with adjectives
   * @param adjectives - the number of adjectives prefixing the animal, default 2
   */
  export default function (adjectives?: number): Promise<string>;
  /***
   * Generates a reasonably secure and unique string with adjectives
   * @param format - the number of adjectives prefixing the animal, default 2
   */
  export default function (format: StringFormat): Promise<string>;

  /***
   * Generates a reasonably secure and unique string with adjectives
   * @param params - an object containing format and/or adjectives specifying the format and number of adjectives to generate
   */
  export default function (params: {
    adjectives?: number;
    format?: StringFormat;
  }): Promise<string>;
}
