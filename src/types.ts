import type { NextPage } from "next";

export type Layout<P = undefined> = (props: { children: React.ReactNode; params?: P }) => JSX.Element;

export interface ErrorPageProps {
  error: Error;
  reset: () => void;
}
export type ErrorPage = NextPage<ErrorPageProps>;

export type RGB = [number, number, number];

export interface Set {
  name: string;
  id: string;
  order: number;
  initialBPM: number;
  program: Program;
}

export type Program = ProgramItem[];

export type ProgramItem = FadeProgramItem | SolidProgramItem;

export interface FadeProgramItem {
  type: "fade";
  from: RGB;
  to: RGB;
  length: number;
}

export interface SolidProgramItem {
  type: "solid";
  rgb: RGB;
  length: number;
}

export interface Globals {
  SETS: Set[];
  SET: Set;
  BPM: number;
  BOARD: any;
  WSS: any;
  LIGHTS_STOPPED: boolean;
  INITIALIZED_LIGHTS_FIRST_BOOT: boolean;
}
