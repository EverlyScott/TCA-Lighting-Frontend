"use client";

import useCurrentHostname from "#/useCurrentUrl";
import { useToasts } from "@geist-ui/core";
import { Typography, Button, Divider } from "@mui/material";
import axios from "axios";
import config from "@/config.json";
import { useContext } from "react";
import globalsContext from "../contexts/globals";
import getGlobals from "#/getGlobals";

const LightsDisabledMessage: React.FC = () => {
  const { globals, setGlobals } = useContext(globalsContext);
  const currentHostname = useCurrentHostname();
  const { setToast } = useToasts();

  const handleRestartLights = async () => {
    try {
      await axios.post(`http://${currentHostname}:${config.api.port}/restart-lights`);
      const globals = await getGlobals();
      setGlobals(globals);
    } catch (err) {
      setToast({
        type: "error",
        text: "Failed to restart lights!",
      });
    }
  };

  if (globals && globals.LIGHTS_STOPPED) {
    return (
      <>
        <Typography>
          <strong>Lights have been disabled due to an issue!</strong>
        </Typography>
        <Button variant="contained" onClick={handleRestartLights}>
          Restart
        </Button>
        <Divider sx={{ margin: "16px 0" }} />
      </>
    );
  }
};

export default LightsDisabledMessage;
