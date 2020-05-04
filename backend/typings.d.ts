declare module "adjective-adjective-animal" {
  /***
   * Generates a reasonably secure and unique string with adjectives
   * @param numberOfAdjectives - the number of adjectives prefixing the animal, default 2
   */
  export default function (numberOfAdjectives?: number): Promise<string>;
}
