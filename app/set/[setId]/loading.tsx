import useColorScheme from "#/useColorScheme";
import { Add, Code, Delete, Menu } from "@mui/icons-material";
import { Skeleton, TextField, Typography, IconButton, Paper, CircularProgress, Button } from "@mui/material";
import { NextPage } from "next";

const Loading: NextPage = () => {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Skeleton variant="text" sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h2">
                Editing Example Set Name
              </Typography>
            </Skeleton>
            <IconButton disabled>
              <Code />
            </IconButton>
          </div>
          <Paper sx={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column" }}>
            <Skeleton variant="rounded" style={{ height: 56, flexGrow: 1 }}></Skeleton>

            <br />
            <Skeleton variant="rounded" style={{ height: 56, flexGrow: 1 }}></Skeleton>
            <br />
            <Skeleton variant="rounded" style={{ height: 56, flexGrow: 1 }}></Skeleton>
            <Typography sx={{ marginTop: "2rem" }} variant="h5" component="h3">
              Notes
            </Typography>
            {new Array(16).fill("").map((_, i) => {
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
                  <div
                    style={{ marginLeft: "0.5rem", display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <Menu color="disabled" />
                  </div>
                  <Skeleton variant="rounded" style={{ height: 56, flexGrow: 1 }}></Skeleton>
                  <Skeleton variant="rounded" style={{ height: 56, flexGrow: 1 }}></Skeleton>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton color="error" sx={{ aspectRatio: 1 / 1 }} disabled>
                      <Delete />
                    </IconButton>
                  </div>
                </Paper>
              );
            })}
            <IconButton
              sx={{
                alignSelf: "flex-end",
                backgroundColor: `rgba(255, 255, 255, 0.2)`,
              }}
              disabled
            >
              <Add />
            </IconButton>
          </Paper>
        </div>
        <div style={{ flex: 1, width: "50%", minHeight: "500px", display: "flex", flexDirection: "column-reverse" }}>
          <Paper
            sx={{ backgroundColor: "#ffffff", padding: "1rem", position: "sticky", bottom: 0, aspectRatio: 5 / 6 }}
          >
            <div
              style={{
                display: "flex",
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
      </div>
      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
        <Button disabled>Cancel</Button>
        <Button variant="contained" disabled>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Loading;
