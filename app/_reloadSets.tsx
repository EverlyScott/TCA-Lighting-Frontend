import useCurrentHostname from "#/useCurrentUrl";
import { IconButton } from "@mui/material";
import axios from "axios";
import config from "@/config.json";
import { Replay } from "@mui/icons-material";
import { useContext, useState } from "react";
import styles from "@/styles/ReloadSets.module.scss";
import getGlobals from "#/getGlobals";
import { Set } from "@/types";
import { useToasts } from "@geist-ui/core";
import globalsContext from "../contexts/globals";

const ReloadSets: React.FC = () => {
  const { globals, setGlobals } = useContext(globalsContext);
  const [loading, setLoading] = useState(false);
  const { setToast } = useToasts();
  const currentHostname = useCurrentHostname();

  const reloadSets = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://${currentHostname}:${config.api.port}/reload-sets`);
      if (res.status === 200) {
        const globals = await getGlobals();
        // Add short timeout so loading doesn't seem too fast (yes this is a thing, look it up)
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
        setGlobals(globals);
        setLoading(false);
        setToast({
          type: "success",
          text: "Successfully reloaded sets",
        });
      } else {
        setLoading(false);
        setToast({
          type: "error",
          text: "Failed to reload sets!",
        });
      }
    } catch (err) {
      setLoading(false);
      setToast({
        type: "error",
        text: "Failed to reload sets!",
      });
    }
  };

  return (
    <div>
      <IconButton onClick={reloadSets} disabled={loading}>
        <Replay className={loading ? styles.loading : ""} />
      </IconButton>
    </div>
  );
};

export default ReloadSets;
