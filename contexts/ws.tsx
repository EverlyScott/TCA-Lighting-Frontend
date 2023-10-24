"use client";

import useCurrentHostname from "#/useCurrentUrl";
import { createContext, useEffect, useState } from "react";
import config from "@/config.json";

interface WSContext {
  wsActive: boolean;
  errorConnecting: boolean;
  setErrorConnecting: React.Dispatch<React.SetStateAction<boolean>>;
  ws: WebSocket | undefined;
}

const wsContext = createContext<WSContext>({
  wsActive: false,
  errorConnecting: false,
  setErrorConnecting: (value: React.SetStateAction<boolean>) => {},
  ws: undefined,
});

export default wsContext;

export const WSProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket>();
  const [wsActive, setWsActive] = useState(false);
  const [errorConnecting, setErrorConnecting] = useState(false);
  const currentHostname = useCurrentHostname();

  useEffect(() => {
    let failedAmount = 0;

    const handleWsOpen = () => {
      console.info("WS Connected");
      setWsActive(true);
      failedAmount = 0;
    };

    const handleWsClose = () => {
      if (failedAmount >= 3) {
        console.error("Failed to connect to WS.");
        setErrorConnecting(true);
      } else {
        failedAmount++;
        console.warn(`WS closed. Retrying in ${5 * failedAmount} seconds...`);
        setWsActive(false);
        setTimeout(startWs, 5000 * failedAmount);
      }
    };

    const startWs = () => {
      console.info("Connecting to WS...");

      setWs(undefined);

      if (errorConnecting === false && currentHostname) {
        const ws = new WebSocket(`ws://${currentHostname}:${config.api.webSocketPort}`);

        ws.addEventListener("open", handleWsOpen);
        ws.addEventListener("close", handleWsClose);

        setWs(ws);
      }
    };

    startWs();

    return () => {
      ws?.removeEventListener?.("open", handleWsOpen);
      ws?.removeEventListener?.("close", handleWsClose);
    };
  }, [errorConnecting, currentHostname]);

  return (
    <wsContext.Provider value={{ ws, wsActive, errorConnecting, setErrorConnecting }}>{children}</wsContext.Provider>
  );
};
