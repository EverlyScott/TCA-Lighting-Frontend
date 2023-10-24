"use client";

import { Skeleton, Typography, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import config from "@/config.json";
import useCurrentHostname from "#/useCurrentUrl";
import wsContext from "../contexts/ws";

type Color = [number, number, number];

const CurrentStatus: React.FC = () => {
  const [rgb, setRgb] = useState<Color>();
  const { wsActive, errorConnecting, setErrorConnecting, ws } = useContext(wsContext);

  useEffect(() => {
    const handleMessage = (evt: MessageEvent) => {
      const message = JSON.parse(evt.data);

      if (message.op === "light-change") {
        setRgb(message.data);
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

  const handleManualReconnect = () => {
    setErrorConnecting(false);
  };

  if (errorConnecting) {
    return (
      <>
        <Typography>Failed to connect to WebSocket server!</Typography>
        <Button variant="contained" color="error" onClick={handleManualReconnect}>
          Retry
        </Button>
      </>
    );
  } else if (wsActive && rgb) {
    return (
      <div
        style={{
          border: "1px solid #000000",
          width: 100,
          aspectRatio: 1 / 1,
          backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        }}
      ></div>
    );
  } else {
    return <Skeleton variant="rectangular" sx={{ width: 100, height: 100 }} />;
  }
};

export default CurrentStatus;
