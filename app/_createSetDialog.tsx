import useCurrentHostname from "#/useCurrentUrl";
import { useToasts } from "@geist-ui/core";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useState } from "react";
import config from "@/config.json";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateSetDialog: React.FC<IProps> = ({ open, setOpen }) => {
  const [name, setName] = useState<string>();
  const [id, setId] = useState<string>();
  const [initialBpm, setInitialBpm] = useState<string>();
  const [loading, setLoading] = useState(false);
  const currentHostname = useCurrentHostname();
  const router = useRouter();
  const { setToast } = useToasts();

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setName(undefined);
    setId(undefined);
    setInitialBpm(undefined);
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setName(evt.target.value);
  };

  const handleIdChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setId(evt.target.value);
  };

  const handleInitialBpmChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setInitialBpm(evt.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`http://${currentHostname}:${config.api.port}/set/${id}`, {
        name,
        id,
        initialBPM: parseFloat(initialBpm ?? ""),
      });

      if (res.status === 200) {
        router.push(`/set/${id}`);
      } else {
        setLoading(false);
        setToast({
          type: "error",
          text: "Error Creating Set!",
        });
      }
    } catch {
      setLoading(false);
      setToast({
        type: "error",
        text: "Error Creating Set!",
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Create Set</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: ".25rem!important" }}>
        <TextField label="Name" value={name} onChange={handleNameChange} disabled={loading} />
        <TextField label="ID" value={id} onChange={handleIdChange} disabled={loading} />
        <TextField
          label="Initial BPM"
          type="text"
          value={initialBpm}
          onChange={handleInitialBpmChange}
          disabled={loading}
          inputProps={{ inputMode: "decimal" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          endIcon={loading ? <CircularProgress size="24.5px" /> : undefined}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSetDialog;
