
import React from "react";
import { render } from "react-dom";
import Root from "./Root";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

const breakpoints = createBreakpoints({})

import "babel-polyfill";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiCardContent: {
      root: {
        [breakpoints.up('lg')]: {
          padding: 60,
          "&:last-child": {
            paddingBottom: 60
          }
        }
      }
    }
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Root />
    </MuiThemeProvider>
  );
}

render(<App />, document.getElementById("app"));
