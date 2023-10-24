import axios from "axios";
import config from "../src/config.json";
import type { Globals } from "@/types";
import useCurrentHostname from "./useCurrentUrl";

const getGlobals = async () => {
  const currentHostname = useCurrentHostname();

  const globals: Globals = await fetch(`http://${currentHostname}:${config.api.port}/globals`, {
    cache: "no-cache",
  }).then((res) => res.json());

  return globals;
};

export default getGlobals;
