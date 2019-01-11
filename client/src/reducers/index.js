import { combineReducers } from "redux";
import userReducer from "./userReducers";
//import nameReducer from "./nameReducers";
import errorReducer from "./errorReducers";
export default combineReducers({
  auth: userReducer,
  //names: nameReducer
  errors: errorReducer
});
