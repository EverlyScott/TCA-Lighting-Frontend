import useColorScheme from "#/useColorScheme";
import { RGB, Set } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  colors,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  set: Set;
}

const PreviewDialog: React.FC<IProps> = ({ open, setOpen, set }) => {
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  const [currentColor, setCurrentColor] = useState<[number, number, number]>([0, 0, 0]);
  const [[_, colorScheme]] = useColorScheme();

  useEffect(() => {
    if (open) {
      let newTotalBeats = 0;

      for (let i = 0; i < set.program.length; i++) {
        newTotalBeats += set.program[i].length;
      }

      setTotalBeats(newTotalBeats);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setCurrentBeat(0);
    setTotalBeats(0);
  };

  const handleIncrementBeatCounter = (currentBeat: number) => {
    currentBeat++;

    setCurrentBeat(currentBeat);

    if (currentBeat > totalBeats) {
      setCurrentBeat(0);
      return;
    }

    setTimeout(() => {
      handleIncrementBeatCounter(currentBeat);
    }, (60 / set.initialBPM) * 1000);
  };

  const handlePlay = async () => {
    setPlaying(true);

    handleIncrementBeatCounter(0);

    for (let i = 0; i < set.program.length; i++) {
      if (open === false) {
        break;
      }
      const programItem = set.program[i];

      if (programItem.type === "solid") {
        setCurrentColor(programItem.rgb);

        await new Promise((resolve) => setTimeout(resolve, programItem.length * ((60 / set.initialBPM) * 1000)));
      } else if (programItem.type === "fade") {
        for (let n = 0; n < programItem.length; n += 0.01) {
          const currentPercent = n / programItem.length;
          const color: RGB = [
            Math.round(programItem.from[0] + (programItem.to[0] - programItem.from[0]) * currentPercent),
            Math.round(programItem.from[1] + (programItem.to[1] - programItem.from[1]) * currentPercent),
            Math.round(programItem.from[2] + (programItem.to[2] - programItem.from[2]) * currentPercent),
          ];
          setCurrentColor(color);
          await new Promise((resolve) => setTimeout(resolve, programItem.length * (60 / set.initialBPM) * 10));
        }
      }
    }

    setPlaying(false);
    setCurrentColor([0, 0, 0]);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Preview</DialogTitle>
      <DialogContent>
        <div
          style={{
            border: `1px ${colorScheme === "light" ? "#000000" : "#ffffff"} solid`,
            width: "100%",
            aspectRatio: 1 / 1,
            backgroundColor: `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`,
          }}
        ></div>
        <DialogContentText>
          Beat {currentBeat}/{totalBeats}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button variant="contained" disabled={playing} onClick={handlePlay}>
          Play
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;
