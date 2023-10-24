"use client";

import { Button } from "@mui/material";
import { useContext, useEffect } from "react";
import wsContext from "../contexts/ws";

const TapBPM: React.FC = () => {
  const { ws, wsActive } = useContext(wsContext);

  const handleTapBPM = () => {
    if (ws) {
      ws.send(JSON.stringify({ op: "bpm" }));
    }
  };

  return (
    <Button disabled={!wsActive} variant="contained" onClick={handleTapBPM}>
      Tap BPM
    </Button>
  );
};

export default TapBPM;
