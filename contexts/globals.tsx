"use client";

import { Globals } from "@/types";
import React, { createContext, useEffect, useState } from "react";

interface GlobalsContext {
  globals?: Globals;
  setGlobals: React.Dispatch<React.SetStateAction<Globals | undefined>>;
}

const globalsContext = createContext<GlobalsContext>({ globals: undefined, setGlobals: () => undefined });

export default globalsContext;

interface IProps {
  initialValue: Globals;
}

export const GlobalsProvider: React.FC<React.PropsWithChildren<IProps>> = ({ initialValue, children }) => {
  const [globals, setGlobals] = useState<Globals | undefined>(initialValue);

  return <globalsContext.Provider value={{ globals, setGlobals }}>{children}</globalsContext.Provider>;
};
