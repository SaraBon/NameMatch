import { combineReducers } from "redux";
import userReducer from "./userReducers";
import errorReducer from "./errorReducers";
export default combineReducers({
  auth: userReducer,
  errors: errorReducer
});
