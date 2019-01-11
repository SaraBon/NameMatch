//const isEmpty = require("is-empty");
const initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        //isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case "USER_LOADING":
      return {
        ...state,
        loading: true
      };
    case "GET_CURRENT_USER":
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
