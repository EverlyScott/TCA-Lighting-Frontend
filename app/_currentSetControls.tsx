"use client";

import { Button, Divider } from "@mui/material";
import type { Set } from "@/types";
import { useToasts } from "@geist-ui/core";
import axios from "axios";
import useCurrentHostname from "#/useCurrentUrl";
import config from "@/config.json";
import { useContext, useEffect, useState } from "react";
import globalsContext from "../contexts/globals";
import getGlobals from "#/getGlobals";

const CurrentSetControls: React.FC = () => {
  const currentHostname = useCurrentHostname();
  const { setToast } = useToasts();
  const { globals, setGlobals } = useContext(globalsContext);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  useEffect(() => {
    if (globals) {
      setCurrentSetIndex(globals.SETS.findIndex((set) => set.id === globals.SET.id));
    }
  }, [globals]);

  const setCurrentSetId = async (id: string) => {
    try {
      await axios.put(`http://${currentHostname}:${config.api.port}/current-set-id`, {
        id,
      });
      setGlobals(await getGlobals());
    } catch (err) {
      setToast({
        type: "error",
        text: "Failed to update current set!",
      });
    }
  };

  const handlePrevious = async () => {
    if (globals) {
      if (globals.SETS[currentSetIndex - 1]) {
        await setCurrentSetId(globals.SETS[currentSetIndex - 1].id);
      } else {
        setToast({
          type: "warning",
          text: "Set not found",
        });
      }
    }
  };

  const handleNext = async () => {
    if (globals) {
      if (globals.SETS[currentSetIndex + 1]) {
        await setCurrentSetId(globals.SETS[currentSetIndex + 1].id);
        setCurrentSetIndex(currentSetIndex + 1);
      } else {
        setToast({
          type: "warning",
          text: "Set not found",
        });
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Button
        disabled={!globals?.SETS[currentSetIndex - 1]}
        variant="contained"
        onClick={handlePrevious}
        sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        Previous
      </Button>
      <Divider orientation="vertical" sx={{ margin: 0 }} />
      <Button
        disabled={!globals?.SETS[currentSetIndex + 1]}
        variant="contained"
        onClick={handleNext}
        sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        Next
      </Button>
    </div>
  );
};

export default CurrentSetControls;
