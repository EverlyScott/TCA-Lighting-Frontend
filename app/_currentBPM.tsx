"use client";

import { Skeleton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import globalsContext from "../contexts/globals";
import wsContext from "../contexts/ws";

interface IProps {
  initialBpm: number;
}

const CurrentBPM: React.FC<IProps> = ({ initialBpm }) => {
  const [bpm, setBpm] = useState(initialBpm);
  const { ws, wsActive } = useContext(wsContext);

  useEffect(() => {
    const handleMessage = (evt: MessageEvent) => {
      const message = JSON.parse(evt.data);

      if (message.op === "bpm") {
        setBpm(message.currentBpm);
      }
    };

    if (ws) {
      ws.addEventListener("message", handleMessage);
    }

    return () => {
      if (ws) {
        ws.removeEventListener("message", handleMessage);
      }
    };
  }, [ws]);

  return <Typography>{Math.round(bpm * 100) / 100} BPM</Typography>;
};

export default CurrentBPM;
