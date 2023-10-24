"use client";

import { useContext } from "react";
import globalsContext from "../contexts/globals";
import { Skeleton, Typography } from "@mui/material";

const CurrentName: React.FC = () => {
  const { globals } = useContext(globalsContext);

  if (globals) {
    return <Typography>{globals.SET.name}</Typography>;
  } else {
    return (
      <Skeleton variant="text">
        <Typography>Example Set Name</Typography>
      </Skeleton>
    );
  }
};

export default CurrentName;
