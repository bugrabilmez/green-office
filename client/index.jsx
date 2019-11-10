import React from "react";
import { render } from "react-dom";
import Root from "./Root";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import "babel-polyfill";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  }
});

const WebFont = require('webfontloader');

  WebFont.load({
    google: {
      families: ['Roboto']
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
