import axios from "axios";
import config from "../src/config.json";
import type GLOBALS from "../../TCA-Lighting/src/globals";
import useCurrentHostname from "./useCurrentUrl";

const getGlobals = async () => {
  const currentHostname = useCurrentHostname();

  const globals = await axios.get<typeof GLOBALS>(`http://${currentHostname}:${config.api.port}/globals`);

  if (globals.status === 200) {
    return globals.data;
  } else {
    throw new Error(globals.statusText);
  }
};

export default getGlobals;
