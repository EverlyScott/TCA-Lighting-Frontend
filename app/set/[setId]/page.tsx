"use client";

import {
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
  Paper,
  CircularProgress,
  IconButton,
  Button,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { Set } from "@/types";
import getGlobals from "#/getGlobals";
import { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import Loading from "./loading";
import config from "@/config.json";
import ProgramItem from "./programItem";
import { Add, Brush, Code, CodeOff } from "@mui/icons-material";
import useColorScheme from "#/useColorScheme";
import axios from "axios";
import MonacoEditor from "./monaco";
import { useMonaco } from "@monaco-editor/react";
import { Uri } from "monaco-editor";
import { useToasts } from "@geist-ui/core";
import useCurrentHostname from "#/useCurrentUrl";

interface IProps {
  params: IParams;
}

interface IParams {
  setId: string;
}

const fetchSet = async (setId: string) => {
  const globals = await getGlobals();

  const set = globals.SETS.find((set) => set.id === setId);

  if (set) {
    return set;
  } else {
    throw new Error("Could not find set!");
  }
};

const EditSet: NextPage<IProps> = ({ params }) => {
  const [set, setSet] = useState<Set>();
  const [imageUrl, setImageUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [dragged, setDragged] = useState<number>();
  const [mousePosition, setMousePosition] = useState<[number, number]>([0, 0]);
  const [activeDropZone, setActiveDropZone] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showMonaco, setShowMonaco] = useState(false);
  const [allowModeSwitching, setAllowModeSwitching] = useState(true);
  const [monacoInitialLoad, setMonacoInitialLoad] = useState(false);
  const [[_, colorScheme]] = useColorScheme();
  const { setToast, removeAll } = useToasts();
  const currentHostname = useCurrentHostname();
  const monaco = useMonaco();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

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

  const handleMouseUp = (evt: MouseEvent) => {
    if (dragged !== undefined && set) {
      evt.preventDefault();
      setDragged(undefined);

      const newProgram = reorderList([...set.program], dragged, activeDropZone);
      setSet({
        ...set,
        program: newProgram,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const set = await fetchSet(params.setId);

      setSet(set);

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    })();
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    if (dragged !== undefined) {
      // get all drop-zones
      const elements = Array.from(document.getElementsByClassName("dropZone"));
      // get all drop-zones' y-axis position
      // if we were using a horizontally-scrolling list, we would get the .left property
      const positions = elements.map((e) => e.getBoundingClientRect().top);
      // get the difference with the mouse's y position
      const absDifferences = positions.map((v) => Math.abs(v - mousePosition[1]));

      // get the item closest to the mouse
      let result = absDifferences.indexOf(Math.min(...absDifferences));

      // if the item is below the dragged item, add 1 to the index
      if (result > dragged) result += 1;

      setActiveDropZone(result);
    }
  }, [dragged, mousePosition]);

  useMemo(() => {
    if (window && window.location) {
      if (imageUrl) {
        const oldUrl = new URL(imageUrl);
        const oldSetParam = oldUrl.searchParams.get("set");
        if (set && oldSetParam && oldSetParam !== "undefined") {
          const oldSet: Set = JSON.parse(decodeURIComponent(oldSetParam));

          let isEqual = true;

          if (set.name !== oldSet.name) {
            isEqual = false;
          } else if (set.id !== oldSet.id) {
            isEqual = false;
          } else if (set.program.length !== oldSet.program.length) {
            isEqual = false;
          } else {
            for (let i = 0; i < set.program.length; i++) {
              const programItem = set.program[i];
              const oldProgramItem = oldSet.program[i];

              if (programItem.length !== oldProgramItem.length) {
                isEqual = false;
                break;
              } else {
                for (let c = 0; c < programItem.rgb.length; c++) {
                  const color = programItem.rgb[c];
                  const oldColor = oldProgramItem.rgb[c];

                  if (color !== oldColor) {
                    isEqual = false;
                    break;
                  }
                }
                if (!isEqual) {
                  break;
                }
              }
            }
          }

          if (isEqual) {
            return;
          }
        }
      }

      setImageUrl(
        `http://${currentHostname}:${config.api.port}/generate-notation?set=${encodeURIComponent(JSON.stringify(set))}`
      );
      setLoadingImage(true);
    }

    if (set && set.program.length >= config.frontend.editorLimit) {
      setShowMonaco(true);
      setAllowModeSwitching(false);

      removeAll();
      setToast({
        type: "warning",
        text: (
          <Typography sx={{ lineBreak: "auto" }}>
            This set is too large for our built-in editor!
            <br />
            Disabling built-in editor.
          </Typography>
        ),
      });
    } else {
      setAllowModeSwitching(true);
    }
  }, [set]);

  const handleImageLoaded = () => {
    setLoadingImage(false);
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (set) {
      setSet({
        ...set,
        name: evt.target.value,
      });
    }
  };

  const handleIdChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (set) {
      setSet({
        ...set,
        id: evt.target.value,
      });
    }
  };

  const handleInitialBpmChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (set) {
      setSet({
        ...set,
        initialBPM: parseFloat(evt.target.value),
      });
    }
  };

  const handleAddSetItem = () => {
    if (set) {
      const newProgram = set.program;
      newProgram.push({
        length: 1,
        rgb: [255, 255, 255],
      });
      setSet({
        ...set,
        program: newProgram,
      });
    }
  };

  const handleCancel = () => {
    // Maybe convert to a Dialog in the future
    if (confirm("Are you sure? This will delete any changes made!")) {
      router.push("/");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const res = await axios.patch(`http://${location.hostname}:${config.api.port}/set/${params.setId}`, {
      set,
    });

    if (res.data.success) {
      router.push("/");
    } else {
      setToast({
        type: "error",
        text: `An error occurred: ${res.data.error}`,
      });
      setSubmitting(false);
    }
  };

  const handleToggleMonaco = () => {
    setShowMonaco(!showMonaco);
  };

  const cleanMonaco = () => {
    if (monaco) {
      monaco.editor.getModels()[0].setValue(JSON.stringify(set, null, 2));
    }
  };

  if (set) {
    if (set.program.length < config.frontend.editorLimit || !allowModeSwitching) {
      return (
        <div style={{ width: "100%" }}>
          {dragged !== undefined && (
            <div
              style={{
                backgroundColor: theme.palette.background.default,
                position: "absolute",
                left: mousePosition[0],
                top: mousePosition[1],
                boxShadow: "0px 0px 20px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ProgramItem
                programItem={set.program[dragged]}
                i={dragged}
                set={set}
                setSet={setSet}
                dragged={dragged}
                setDragged={setDragged}
              />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: isMdDown ? "column" : "initial", gap: "1rem" }}>
            <div
              style={
                showMonaco
                  ? {
                      minHeight: "calc(100vh - 8rem)",
                      display: "flex",
                      flexDirection: "column",
                    }
                  : {}
              }
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
                  Editing {set.name}
                </Typography>
                {showMonaco && (
                  <IconButton onClick={cleanMonaco}>
                    <Brush />
                  </IconButton>
                )}
                {allowModeSwitching && (
                  <IconButton onClick={handleToggleMonaco}>{showMonaco ? <CodeOff /> : <Code />}</IconButton>
                )}
              </div>
              <Paper
                sx={{
                  flex: 1,
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {showMonaco ? (
                  <MonacoEditor
                    value={set}
                    setValue={setSet}
                    initialLoad={monacoInitialLoad}
                    setInitialLoad={setMonacoInitialLoad}
                    allowModeSwitching={allowModeSwitching}
                  />
                ) : (
                  <>
                    <TextField label="Name" value={set.name} onChange={handleNameChange} />
                    <br />
                    <TextField
                      label="ID"
                      value={set.id}
                      onChange={handleIdChange}
                      inputProps={{ style: { fontFamily: "monospace" } }}
                    />
                    <br />
                    <TextField
                      label="Initial BPM"
                      value={set.initialBPM}
                      onChange={handleInitialBpmChange}
                      type="number"
                    />
                    <Typography sx={{ marginTop: "2rem" }} variant="h5" component="h3">
                      Notes
                    </Typography>
                    <Paper
                      className="dropZone"
                      style={
                        dragged === undefined || activeDropZone !== 0
                          ? { width: 0, height: 0 }
                          : {
                              padding: "1rem",
                              margin: "8px",
                              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
                              height: 72,
                              overflow: "hidden",
                            }
                      }
                    />
                    {set.program.map((programItem, i) => {
                      if (dragged !== i) {
                        return (
                          <>
                            <ProgramItem
                              key={`${i}${programItem.length}${programItem.rgb.join(",")}`}
                              programItem={programItem}
                              i={i}
                              set={set}
                              setSet={setSet}
                              dragged={dragged}
                              setDragged={setDragged}
                            />
                            <Paper
                              className="dropZone"
                              style={
                                dragged === undefined || activeDropZone !== i + 1
                                  ? { width: 0, height: 0 }
                                  : {
                                      padding: "1rem",
                                      margin: "8px",
                                      backgroundImage:
                                        "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
                                      height: 72,
                                      overflow: "hidden",
                                    }
                              }
                            />
                          </>
                        );
                      } else {
                        return <></>;
                      }
                    })}
                    <IconButton
                      onClick={handleAddSetItem}
                      sx={{
                        alignSelf: "flex-end",
                        backgroundColor: colorScheme === "light" ? `rgba(0, 0, 0, 0.04)` : `rgba(255, 255, 255, 0.2)`,
                        ":hover": {
                          backgroundColor: colorScheme === "light" ? `rgba(0, 0, 0, 0.1)` : undefined,
                        },
                      }}
                    >
                      <Add />
                    </IconButton>
                  </>
                )}
              </Paper>
            </div>
            {allowModeSwitching && (
              <div
                style={{
                  flex: 1,
                  width: isMdDown ? "100%" : "50%",
                  minWidth: isMdDown || showMonaco ? "initial" : "500px",
                  height: isMdDown ? "auto" : "initial",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                <Paper
                  sx={{
                    backgroundColor: "#ffffff",
                    padding: "1rem",
                    position: "sticky",
                    bottom: 0,
                  }}
                >
                  <img
                    src={imageUrl}
                    onLoad={handleImageLoaded}
                    style={{ width: "100%", opacity: loadingImage ? 0.2 : 1 }}
                  />
                  <div
                    style={{
                      display: loadingImage ? "flex" : "none",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    <CircularProgress />
                  </div>
                </Paper>
              </div>
            )}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <Button disabled={submitting} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" disabled={submitting} onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      );
    } else {
      return <Loading />;
    }
  } else {
    return <Loading />;
  }
};

export default EditSet;
