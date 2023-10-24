import { NextPage } from "next";
import { Typography, Paper, Divider } from "@mui/material";
import LightsDisabledMessage from "./_lightsDisabled";
import CurrentSetControls from "./_currentSetControls";
import TapBPM from "./_tapBPM";
import SetsList from "./_setsList";
import CurrentStatus from "./_currentStatus";
import getGlobals from "#/getGlobals";
import CreateSet from "./_createSet";
import { GlobalsProvider } from "../contexts/globals";
import CurrentName from "./_currentName";
import CurrentBPM from "./_currentBPM";
import { WSProvider } from "../contexts/ws";

const Home: NextPage = async () => {
  const globals = await getGlobals();

  return (
    <GlobalsProvider initialValue={globals}>
      <WSProvider>
        <div style={{ maxWidth: 1000, width: "100%" }}>
          <Typography variant="h4" component="h2">
            Current Status
          </Typography>
          <Paper sx={{ padding: "1rem" }}>
            <CurrentStatus />
            <Divider sx={{ margin: "16px 0" }} />
            <LightsDisabledMessage />
            <Typography variant="h5" component="h3">
              Current Set
            </Typography>
            <CurrentName />
            <CurrentSetControls />
            <Divider sx={{ margin: "16px 0" }} />
            <Typography variant="h5" component="h3">
              Current BPM
            </Typography>
            <CurrentBPM initialBpm={globals.BPM} />
            <TapBPM />
          </Paper>
          <SetsList />
          <CreateSet />
        </div>
      </WSProvider>
    </GlobalsProvider>
  );
};

export default Home;
