import { GET_ERRORS } from "../actions/types";
const initialState = {
  deleteError: false
};
export default function(state = initialState, action) {
  switch (action.type) {
    case "DELETE_ERRORS":
      return {
        deleteError: action.payload
      };
    default:
      return state;
  }
}
