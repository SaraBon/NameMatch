import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faAngleLeft,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";

import { Provider } from "react-redux";
import store from "./store";

library.add(faTrash, faAngleLeft, faAngleRight);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
