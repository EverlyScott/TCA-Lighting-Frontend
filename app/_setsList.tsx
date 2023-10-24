"use client";

import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import type { Set } from "@/types";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import ReloadSets from "./_reloadSets";
import globalsContext from "../contexts/globals";
import { Delete, Edit, EditOutlined, Menu } from "@mui/icons-material";
import axios from "axios";
import useCurrentHostname from "#/useCurrentUrl";
import config from "@/config.json";
import { useToasts } from "@geist-ui/core";
import getGlobals from "#/getGlobals";
import DeleteSetDialog from "./_deleteSetDialog";

const SetsList: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number>();
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  const [activeDropZone, setActiveDropZone] = useState<number>();
  const { globals, setGlobals } = useContext(globalsContext);
  const { setToast } = useToasts();
  const currentHostname = useCurrentHostname();
  const theme = useTheme();

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleMouseMove = (evt: MouseEvent) => {
    setMousePosition([evt.x, evt.y]);
  };

  const _reorderListForwards = <T,>(l: T[], start: number, end: number) => {
    const temp = l[start];

    for (let i = start; i < end; i++) {
      l[i] = l[i + 1];
    }
    l[end - 1] = temp;

    return l;
  };

  const _reorderListBackwards = <T,>(l: T[], start: number, end: number) => {
    const temp = l[start];

    for (let i = start; i > end; i--) {
      l[i] = l[i - 1];
    }

    l[end] = temp;

    return l;
  };

  const reorderList = <T,>(l: T[], start: number, end: number) => {
    if (start < end) return _reorderListForwards(l, start, end);
    else if (start > end) return _reorderListBackwards(l, start, end);

    return l;
  };

  useEffect(() => {
    if (document) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (document) {
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseUp = async (evt: MouseEvent) => {
      console.log(!!globals, draggedIndex, activeDropZone);

      if (globals && draggedIndex !== undefined && activeDropZone !== undefined) {
        evt.preventDefault();
        const reorderedList = reorderList([...globals.SETS], draggedIndex, activeDropZone);

        const updatedOrders = reorderedList.map((set, i) => {
          return {
            ...set,
            order: i,
          };
        });

        try {
          await axios.put(`http://${currentHostname}:${config.api.port}/sets`, {
            sets: updatedOrders,
          });
          const globals = await getGlobals();
          setGlobals(globals);
        } catch (err) {
          setToast({
            type: "error",
            text: "Failed to update order of sets!",
          });
        }
      }

      setDraggedIndex(undefined);
    };

    if (document) {
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (document) {
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [globals, draggedIndex, activeDropZone]);

  useEffect(() => {
    if (draggedIndex !== undefined) {
      const elements = Array.from(document.getElementsByClassName("dropZone"));

      const positions = elements.map((e) => e.getBoundingClientRect().top);

      const absDifferences = positions.map((v) => Math.abs(v - mousePosition[1]));

      let result = absDifferences.indexOf(Math.min(...absDifferences));

      if (result > draggedIndex) result += 1;

      setActiveDropZone(result);
    } else {
      setActiveDropZone(undefined);
    }
  }, [draggedIndex, mousePosition]);

  if (globals) {
    return (
      <>
        {draggedIndex !== undefined && (
          <Paper
            style={{
              zIndex: 999,
              position: "fixed",
              width: "calc(100vw - 2rem)",
              maxWidth: 1000,
              left: mousePosition[0] - 28,
              top: mousePosition[1] - 24,
            }}
          >
            <SetsListItem
              set={globals.SETS[draggedIndex]}
              editMode={editMode}
              draggedIndex={draggedIndex}
              setDraggedIndex={setDraggedIndex}
              i={draggedIndex}
            />
          </Paper>
        )}

        <div style={{ display: "flex", marginTop: "2rem" }}>
          <Typography sx={{ flexGrow: 1 }} variant="h4" component="h2">
            Sets
          </Typography>
          <IconButton color={editMode ? "warning" : "default"} onClick={toggleEditMode}>
            {editMode ? <Edit /> : <EditOutlined />}
          </IconButton>
          <ReloadSets />
        </div>
        <Paper>
          <List>
            <ListItem
              className="dropZone"
              sx={{
                transition: theme.transitions.create(["height", "padding"]),
                height: draggedIndex !== undefined && activeDropZone === 0 ? 48 : 0,
                padding: draggedIndex !== undefined && activeDropZone === 0 ? "initial" : 0,
              }}
            />
            {globals.SETS.map((set, i) => {
              if (draggedIndex !== i)
                return (
                  <>
                    <SetsListItem
                      set={set}
                      key={set.id}
                      editMode={editMode}
                      draggedIndex={draggedIndex}
                      setDraggedIndex={setDraggedIndex}
                      i={i}
                    />
                    <ListItem
                      className="dropZone"
                      sx={{
                        transition: theme.transitions.create(["height", "padding"]),
                        height: draggedIndex !== undefined && activeDropZone === i + 1 ? 48 : 0,
                        padding: draggedIndex !== undefined && activeDropZone === i + 1 ? "initial" : 0,
                      }}
                    />
                  </>
                );
            })}
            {globals.SETS.length <= 0 && (
              <Typography variant="h4" component="p" sx={{ textAlign: "center" }}>
                No Sets Found
              </Typography>
            )}
          </List>
        </Paper>
      </>
    );
  } else {
  }
};

interface ISetItemProps {
  set: Set;
  editMode: boolean;
  draggedIndex: number | undefined;
  setDraggedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  i: number;
}

const SetsListItem: React.FC<ISetItemProps> = ({ set, editMode, draggedIndex, setDraggedIndex, i }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(`/set/${set.id}`);
  };

  const handleShowDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleDragStart: MouseEventHandler<SVGSVGElement> = (evt) => {
    evt.preventDefault();
    setDraggedIndex(i);
  };

  return (
    <>
      <ListItem disablePadding>
        {editMode && (
          <Menu
            onMouseDown={handleDragStart}
            color="disabled"
            sx={{ marginLeft: 2, marginRight: 1, cursor: draggedIndex === i ? "grabbing" : "grab" }}
          />
        )}
        <ListItemButton sx={{ marginLeft: 1, marginRight: 1 }} onMouseEnter={handleMouseEnter} href={`/set/${set.id}`}>
          <ListItemIcon>{set.order + 1}.</ListItemIcon>
          <ListItemText>{set.name}</ListItemText>
        </ListItemButton>
        {editMode && (
          <IconButton sx={{ marginRight: 2 }} onClick={handleShowDeleteDialog} color="error">
            <Delete />
          </IconButton>
        )}
      </ListItem>
      <DeleteSetDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} set={set} />
    </>
  );
};

export default SetsList;
