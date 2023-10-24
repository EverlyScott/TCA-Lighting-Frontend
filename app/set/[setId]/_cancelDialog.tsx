import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CancelDialog: React.FC<IProps> = ({ open, setOpen }) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>By selecting "Okay" you will delete any changes made!</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Continue Editing</Button>
        <Button onClick={handleCancel} variant="contained" color="error">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelDialog;
