import tinycolor from "tinycolor2";

export const backgroundColor = "#222";

export const getTextColorForBackground = (
  backgroundColor: string,
  lightColor: string = "#eee",
  darkColor: string = "#333"
) => (tinycolor(backgroundColor).isLight() ? darkColor : lightColor);
