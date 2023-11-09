"use client";

import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  useTheme,
} from "@mui/material";
import { MuiColorInput as ColorInput } from "mui-color-input";
import { RGB, Set, SolidProgramItem as ISolidProgramItem, FadeProgramItem as IFadeProgramItem } from "@/types";
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { Delete, Menu } from "@mui/icons-material";

interface IProps {
  programItem: ISolidProgramItem;
  i: number;
  set: Set;
  setSet: React.Dispatch<React.SetStateAction<Set | undefined>>;
  dragged?: number;
  setDragged: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const SolidProgramItem: React.FC<IProps> = ({ programItem, i, set, setSet, dragged, setDragged }) => {
  const [type, setType] = useState<"solid" | "fade">(programItem.type);
  const [delayedLength, setDelayedLength] = useState(programItem.length.toString());
  const [delayedColor, setDelayedColor] = useState<RGB>(programItem.rgb);

  const handleLengthChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setDelayedLength(evt.target.value);
  };

  const handleLengthUnfocus = () => {
    const newProgram = set.program;
    newProgram[i].length = parseFloat(delayedLength);
    setSet({
      ...set,
      program: newProgram,
    });
  };

  const handleColorChange = (value: string) => {
    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);

    setDelayedColor([r, g, b]);
  };

  const handlePopoverClose = () => {
    const newProgram = set.program;
    (newProgram[i] as ISolidProgramItem).rgb = delayedColor;
    setSet({
      ...set,
      program: newProgram,
    });
  };

  const handleDelete = () => {
    const newProgram = set.program;
    newProgram.splice(i, 1);
    setSet({
      ...set,
      program: newProgram,
    });
  };

  const handleTypeChange = (evt: SelectChangeEvent<"solid" | "fade">) => {
    const newProgramItem: IFadeProgramItem = {
      type: "fade",
      length: parseFloat(delayedLength),
      from: delayedColor,
      to: [0, 0, 0],
    };
    const newProgram = set.program;
    newProgram[i] = newProgramItem;
    setSet({
      ...set,
      program: newProgram,
    });
  };

  const handleDrag: MouseEventHandler<SVGSVGElement> = (evt) => {
    evt.preventDefault();
    setDragged(i);
  };

  return (
    <Paper
      sx={{
        padding: "8px",
        margin: "8px",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
        display: "flex",
        gap: "1rem",
      }}
    >
      <div style={{ marginLeft: ".5rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Menu sx={{ cursor: "grab" }} onMouseDown={handleDrag} color="disabled" />
      </div>
      <FormControl sx={{ flex: "1 1 0" }}>
        <InputLabel>Type</InputLabel>
        <Select value={type} label="Type" onChange={handleTypeChange}>
          <MenuItem value="solid">Solid</MenuItem>
          <MenuItem value="fade">Fade</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Length"
        value={delayedLength}
        type="number"
        inputProps={{ inputMode: "decimal" }}
        onChange={handleLengthChange}
        onBlur={handleLengthUnfocus}
        sx={{ flex: "1 1 0" }}
      />
      <ColorInput
        label="Color"
        isAlphaHidden
        format="hex"
        fallbackValue="#ffffff"
        PopoverProps={{ onClose: handlePopoverClose }}
        InputProps={{ onBlur: handlePopoverClose }}
        value={`#${delayedColor[0].toString(16).padStart(2, "0")}${delayedColor[1]
          .toString(16)
          .padStart(2, "0")}${delayedColor[2].toString(16).padStart(2, "0")}`}
        onChange={handleColorChange}
        sx={{ flex: "1 1 0" }}
      />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <IconButton onClick={handleDelete} color="error" sx={{ aspectRatio: 1 / 1 }}>
          <Delete />
        </IconButton>
      </div>
    </Paper>
  );
};

export default SolidProgramItem;
