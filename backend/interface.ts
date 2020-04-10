export interface Note {
  ownedBy: string;
  secret: boolean;
  content: string;
  color: string;
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface Text {
  content: string;
  color: string;
  id: string;
  x: number;
  y: number;
}

export interface Token {
  color: string;
  id: string;
  x: number;
  y: number;
}

export interface User {
  id: string;
  name: string;
}
