import useColorScheme from "#/useColorScheme";
import useCurrentHostname from "#/useCurrentUrl";
import { Set } from "@/types";
import { BeforeMount, Editor, OnChange, useMonaco } from "@monaco-editor/react";
import { KeyboardEventHandler, useEffect, useState } from "react";
import config from "@/config.json";
import { useMediaQuery, useTheme } from "@mui/material";
import { useToasts } from "@geist-ui/core";
import { languages } from "monaco-editor";

interface IProps {
  value: Set;
  setValue: React.Dispatch<React.SetStateAction<Set | undefined>>;
  initialLoad: boolean;
  setInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  allowModeSwitching: boolean;
}

const MonacoEditor: React.FC<IProps> = ({ value, setValue, initialLoad, setInitialLoad, allowModeSwitching }) => {
  const [[_, colorScheme]] = useColorScheme();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const [windowWidth, setWindowWidth] = useState(0);
  const { setToast, removeAll } = useToasts();
  const monaco = useMonaco();
  const currentHostname = useCurrentHostname();

  const handleWindowResize = () => {
    setWindowWidth(document.body.clientWidth);
  };

  useEffect(() => {
    if (window) {
      setWindowWidth(document.body.clientWidth);

      window.addEventListener("resize", handleWindowResize);

      return () => {
        window.removeEventListener("resize", handleWindowResize);
      };
    }
  }, []);

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({ enableSchemaRequest: true });

    if (!initialLoad) {
      monaco.languages.registerColorProvider("json", {
        provideColorPresentations: (_, colorInfo) => {
          return [
            {
              label: `"rgb": [${colorInfo.color.red * 255}, ${colorInfo.color.green * 255}, ${
                colorInfo.color.blue * 255
              }]`,
            },
          ];
        },

        provideDocumentColors(model, token) {
          const matches = model.findMatches(
            `"rgb":[\\s]*\\[[\\s\\n]*[0-9]{1,3}[\\s]?,[\\S\\n]*[\\s\\n]*[0-9]{1,3}[\\s]?,[\\S\\n]*[\\s\\n]*[0-9]{1,3}[\\s]*[\\S\\n]*\\]`,
            true,
            true,
            true,
            null,
            true
          );

          let colors: languages.ProviderResult<languages.IColorInformation[]> = [];

          for (let i = 0; i < matches.length; i++) {
            const match = matches[i];

            const { rgb }: { rgb: [number, number, number] } = JSON.parse(`{${match.matches?.[0] ?? `[0, 0, 0]`}}`);

            colors.push({
              color: {
                red: rgb[0] / 255,
                green: rgb[1] / 255,
                blue: rgb[2] / 255,
                alpha: 1,
              },
              range: match.range,
            });
          }

          return colors;
        },
      });

      monaco.languages.registerColorProvider("json", {
        provideColorPresentations: (_, colorInfo) => {
          return [
            {
              label: `"from": [${colorInfo.color.red * 255}, ${colorInfo.color.green * 255}, ${
                colorInfo.color.blue * 255
              }]`,
            },
          ];
        },

        provideDocumentColors(model, token) {
          const matches = model.findMatches(
            `"from":[\\s]*\\[[\\s\\n]*[0-9]{1,3}[\\s]?,[\\S\\n]*[\\s\\n]*[0-9]{1,3}[\\s]?,[\\S\\n]*[\\s\\n]*[0-9]{1,3}[\\s]*[\\S\\n]*\\]`,
            true,
            true,
            true,
            null,
            true
          );

          let colors: languages.ProviderResult<languages.IColorInformation[]> = [];

          for (let i = 0; i < matches.length; i++) {
            const match = matches[i];

            const { from: rgb }: { from: [number, number, number] } = JSON.parse(
              `{${match.matches?.[0] ?? `[0, 0, 0]`}}`
            );

            colors.push({
              color: {
                red: rgb[0] / 255,
                green: rgb[1] / 255,
                blue: rgb[2] / 255,
                alpha: 1,
              },
              range: match.range,
            });
          }

          return colors;
        },
      });

      monaco.languages.registerColorProvider("json", {
        provideColorPresentations: (_, colorInfo) => {
          return [
            {
              label: `"to": [${colorInfo.color.red * 255}, ${colorInfo.color.green * 255}, ${
                colorInfo.color.blue * 255
              }]`,
            },
          ];
        },

        provideDocumentColors(model, token) {
          const matches = model.findMatches(
            `"to":[\\s]*\\[[\\s\\n]*[0-9]{1,3}[\\s]?,[\\S\\n]*[\\s\\n]*[0-9]{1,3}[\\s]?,[\\S\\n]*[\\s\\n]*[0-9]{1,3}[\\s]*[\\S\\n]*\\]`,
            true,
            true,
            true,
            null,
            true
          );

          let colors: languages.ProviderResult<languages.IColorInformation[]> = [];

          for (let i = 0; i < matches.length; i++) {
            const match = matches[i];

            const { to: rgb }: { to: [number, number, number] } = JSON.parse(`{${match.matches?.[0] ?? `[0, 0, 0]`}}`);

            colors.push({
              color: {
                red: rgb[0] / 255,
                green: rgb[1] / 255,
                blue: rgb[2] / 255,
                alpha: 1,
              },
              range: match.range,
            });
          }

          return colors;
        },
      });

      setInitialLoad(true);
    }
  };

  const handleChange: OnChange = (value, evt) => {
    if (value) {
      try {
        const newValue: Set = JSON.parse(value);

        let invalid = false;

        if ((newValue as any).$schema !== "./_schema.json") {
          (newValue as any).$schema = "./_schema.json";
        }
        if (newValue.name && typeof newValue.name !== "string") invalid = true;
        if (newValue.id && typeof newValue.id !== "string") invalid = true;
        if (newValue.order && typeof newValue.order !== "number") invalid = true;
        if (newValue.initialBPM && (typeof newValue.initialBPM !== "number" || newValue.initialBPM < 0)) invalid = true;
        if (newValue.program && (typeof newValue.program !== "object" || newValue.program.length <= 0)) invalid = true;
        for (let i = 0; i < newValue.program.length; i++) {
          const programItem = newValue.program[i];

          if ((programItem.length && typeof programItem.length !== "number") || programItem.length < 0) {
            invalid = true;
            break;
          }
          if (programItem.type === "solid") {
            if (programItem.rgb && (typeof programItem.rgb !== "object" || programItem.rgb.length <= 0)) {
              invalid = true;
              break;
            }

            for (let c = 0; c < programItem.rgb.length; c++) {
              const color = programItem.rgb[c];

              if (typeof color !== "number" || color > 255 || color < 0) {
                invalid = true;
                break;
              }
            }
            if (invalid) {
              break;
            }
          }
          if (programItem.type === "fade") {
            if (programItem.from && (typeof programItem.from !== "object" || programItem.from.length <= 0)) {
              invalid = true;
              break;
            }

            for (let c = 0; c < programItem.from.length; c++) {
              const color = programItem.from[c];

              if (typeof color !== "number" || color > 255 || color < 0) {
                invalid = true;
                break;
              }
            }
            if (invalid) {
              break;
            }

            if (programItem.to && (typeof programItem.to !== "object" || programItem.to.length <= 0)) {
              invalid = true;
              break;
            }

            for (let c = 0; c < programItem.to.length; c++) {
              const color = programItem.to[c];

              if (typeof color !== "number" || color > 255 || color < 0) {
                invalid = true;
                break;
              }
            }
            if (invalid) {
              break;
            }
          }
        }

        if (invalid) {
          removeAll();
          setToast({
            type: "error",
            text: "Failed to update: Invalid JSON",
          });
        }

        setValue(newValue);
      } catch (err) {
        removeAll();
        setToast({
          type: "error",
          text: "Failed to update: Invalid JSON",
        });
      }
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === "s") {
      evt.preventDefault();
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }} onKeyDown={handleKeyDown}>
      <Editor
        theme={colorScheme === "light" ? "vs" : "vs-dark"}
        language="json"
        width={
          allowModeSwitching
            ? isMdDown
              ? windowWidth - 64 + "px"
              : windowWidth * 0.5 - 40 + "px"
            : windowWidth - 64 + "px"
        }
        height={allowModeSwitching ? undefined : "100%"}
        beforeMount={handleBeforeMount}
        defaultValue={JSON.stringify(value, null, 2)}
        options={{ tabSize: 2, minimap: { enabled: false }, wordWrap: "on" }}
        onChange={handleChange}
        path={`http://${currentHostname}:${config.api.port}`}
      />
    </div>
  );
};

export default MonacoEditor;
