import tinycolor from "tinycolor2";

export const backgroundColor = "#222";

export const noteColors = [
  "#ffeb3b",
  "#2196f3",
  "#8bc34a",
  "#ff5722",
  "#673ab7",
  "#e91e63",
  "#795548",
];

export const getTextColorForBackground = (
  backgroundColor: string,
  lightColor: string = "#eee",
  darkColor: string = "#333"
) => (tinycolor(backgroundColor).isLight() ? darkColor : lightColor);
