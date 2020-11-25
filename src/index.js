import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import ResetStyles from "./styles/reset.styles";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ResetStyles />
    <App />
  </React.StrictMode>,
  rootElement
);
