import type { NextPage } from "next";

export type Layout<P = undefined> = (props: { children: React.ReactNode; params?: P }) => JSX.Element;

export interface ErrorPageProps {
  error: Error;
  reset: () => void;
}
export type ErrorPage = NextPage<ErrorPageProps>;

export interface Set {
  name: string;
  id: string;
  order: number;
  initialBPM: number;
  program: Program;
}

export type Program = ProgramItem[];

export interface ProgramItem {
  rgb: [number, number, number];
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
