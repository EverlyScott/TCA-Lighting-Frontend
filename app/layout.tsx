import { Layout } from "@/types";
import type { Metadata } from "next";
import ThemeRegistry from "$/ThemeRegistry";
import AppBar from "$/AppBar";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import AppBarMargin from "$/AppBar/margin";
import RecoilRoot from "$/RecoilRoot";
import GeistProvider from "$/GeistProdivder";

export const metadata: Metadata = {
  title: "TCA Lighting System",
};

const Layout: Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <GeistProvider>
          <RecoilRoot>
            <ThemeRegistry>
              <div id="root">
                <AppBar pageTitle={metadata.title!.toString()} />
                <AppBarMargin />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "32px 16px 32px 16px",
                  }}
                >
                  <noscript>
                    <Typography sx={{ textAlign: "center" }} variant="h3" component="h2">
                      Please enable JavaScript!
                    </Typography>
                  </noscript>
                  {children}
                </div>
              </div>
            </ThemeRegistry>
          </RecoilRoot>
        </GeistProvider>
      </body>
    </html>
  );
};

export default Layout;
