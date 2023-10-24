"use client";

import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import CreateSetDialog from "./_createSetDialog";
import { useState } from "react";

const CreateSet: React.FC = () => {
  const [createSetDialogOpen, setCreateSetDialogOpen] = useState(false);

  const router = useRouter();

  const handleAddSet = () => {
    setCreateSetDialogOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: ".5rem" }}>
      <IconButton onClick={handleAddSet}>
        <Add />
      </IconButton>
      <CreateSetDialog open={createSetDialogOpen} setOpen={setCreateSetDialogOpen} />
    </div>
  );
};

export default CreateSet;
