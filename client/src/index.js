import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// Redux
import { Provider } from "react-redux";
import store from "./store";
// FontAwesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faLaughBeam, faMeh } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faLaughBeam, faMeh);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
