import axios from "axios";
import config from "../src/config.json";
import type { Globals } from "@/types";
import useCurrentHostname from "./useCurrentUrl";

const getGlobals = async () => {
  const currentHostname = useCurrentHostname();

  const globals = await axios.get<Globals>(`http://${currentHostname}:${config.api.port}/globals`);

  if (globals.status === 200) {
    return globals.data;
  } else {
    throw new Error(globals.statusText);
  }
};

export default getGlobals;
