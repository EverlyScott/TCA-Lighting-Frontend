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
import { FadeProgramItem as IFadeProgramItem, RGB, Set, SolidProgramItem as ISolidProgramItem } from "@/types";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { Delete, Menu } from "@mui/icons-material";

interface IProps {
  programItem: IFadeProgramItem;
  i: number;
  set: Set;
  setSet: React.Dispatch<React.SetStateAction<Set | undefined>>;
  dragged?: number;
  setDragged: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const FadeProgramItem: React.FC<IProps> = ({ programItem, i, set, setSet, dragged, setDragged }) => {
  const [type, setType] = useState<"solid" | "fade">(programItem.type);
  const [delayedLength, setDelayedLength] = useState(programItem.length.toString());
  const [delayedFromColor, setDelayedFromColor] = useState<RGB>(programItem.from);
  const [delayedToColor, setDelayedToColor] = useState<RGB>(programItem.to);

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

  const handleColorChange = (value: string, setValue: React.Dispatch<React.SetStateAction<RGB>>) => {
    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);

    setValue([r, g, b]);
  };

  const handleFromPopoverClose = () => {
    const newProgram = set.program;
    (newProgram[i] as IFadeProgramItem).from = delayedFromColor;
    setSet({
      ...set,
      program: newProgram,
    });
  };

  const handleToPopoverClose = () => {
    const newProgram = set.program;
    (newProgram[i] as IFadeProgramItem).to = delayedToColor;
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
    const newProgramItem: ISolidProgramItem = {
      type: "solid",
      length: parseFloat(delayedLength),
      rgb: delayedFromColor,
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
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormControl>
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
          sx={{ flexGrow: 1, height: "100%" }}
        />
      </div>
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <ColorInput
          label="Fade From"
          isAlphaHidden
          format="hex"
          fallbackValue="#ffffff"
          PopoverProps={{ onClose: handleFromPopoverClose }}
          InputProps={{ onBlur: handleFromPopoverClose }}
          value={`#${delayedFromColor[0].toString(16).padStart(2, "0")}${delayedFromColor[1]
            .toString(16)
            .padStart(2, "0")}${delayedFromColor[2].toString(16).padStart(2, "0")}`}
          onChange={(value) => {
            handleColorChange(value, setDelayedFromColor);
          }}
          sx={{ flexGrow: 1 }}
        />
        <ColorInput
          label="Fade To"
          isAlphaHidden
          format="hex"
          fallbackValue="#ffffff"
          PopoverProps={{ onClose: handleToPopoverClose }}
          InputProps={{ onBlur: handleToPopoverClose }}
          value={`#${delayedToColor[0].toString(16).padStart(2, "0")}${delayedToColor[1]
            .toString(16)
            .padStart(2, "0")}${delayedToColor[2].toString(16).padStart(2, "0")}`}
          onChange={(value) => {
            handleColorChange(value, setDelayedToColor);
          }}
          sx={{ flexGrow: 1 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <IconButton onClick={handleDelete} color="error" sx={{ aspectRatio: 1 / 1 }}>
          <Delete />
        </IconButton>
      </div>
    </Paper>
  );
};

export default FadeProgramItem;
