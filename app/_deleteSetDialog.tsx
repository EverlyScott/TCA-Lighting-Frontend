import useCurrentHostname from "#/useCurrentUrl";
import { Set } from "@/types";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import axios from "axios";
import config from "@/config.json";
import getGlobals from "#/getGlobals";
import { useContext } from "react";
import globalsContext from "../contexts/globals";
import { useToasts } from "@geist-ui/core";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  set: Set;
}

const DeleteSetDialog: React.FC<IProps> = ({ open, setOpen, set }) => {
  const { setGlobals } = useContext(globalsContext);
  const { setToast } = useToasts();
  const currentHostname = useCurrentHostname();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://${currentHostname}:${config.api.port}/set/${set.id}`);
      const globals = await getGlobals();
      setGlobals(globals);
      setOpen(false);
    } catch {
      setToast({
        type: "error",
        text: "Error deleting set!",
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Set?</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you would like to delete the set with the name {set.name}?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSetDialog;
