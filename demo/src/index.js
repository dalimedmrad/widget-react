import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./reduxToolkit/Store";
import "bootstrap/dist/css/bootstrap.min.css";

const widgetDivs = document.querySelectorAll(".nicoraynaud-finance-widget");

widgetDivs.forEach((div) => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App symbol={div.dataset.symbol} />
      </Provider>
    </React.StrictMode>,
    div
  );
});
