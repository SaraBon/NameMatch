import {
  CALC_UNSEEN_NAMES,
  SET_CURRENT_USER,
  REGISTRATION_SUCCESS,
  UPDATE_FRIENDS_NAMES,
  USER_LOADING,
  UPDATE_NAMES,
  FIND_MATCHES,
  UPDATE_SEEN_NAMES,
  LINK_ACCOUNTS,
  UPDATE_UNSEEN_NAMES
} from "../actions/types.js";
const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  registration_success: false,
  user: {},
  friendsNames: [],
  unseenNames: [],
  loading: false,
  matches: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };

    case REGISTRATION_SUCCESS:
      return {
        ...state,
        registration_success: true
      };

    case USER_LOADING:
      return {
        ...state,
        loading: true
      };

    case UPDATE_NAMES:
      let tempUsr = Object.assign(state.user);
      tempUsr.names = action.payload;
      return {
        ...state,
        user: tempUsr
      };

    case UPDATE_FRIENDS_NAMES:
      return {
        ...state,
        friendsNames: action.payload,
        loading: false
      };

    case LINK_ACCOUNTS:
      let tempUsr2 = Object.assign(state.user);
      tempUsr2.linkedID = action.payload._id;
      tempUsr2.linkedName = action.payload.name;
      return {
        ...state,
        loading: false
      };

    // calculate the names of the linked user which the current user hasn't seen yet
    case CALC_UNSEEN_NAMES:
      let friendsNames = state.friendsNames.slice();
      let seenFriendsNames = state.user.seenFriendsNames.slice();
      let myNames = state.user.names.slice();
      let unseenNames = [];

      if (!state.user.seenFriendsNames) {
        // if user has no seen Friends names, put all friends names
        //which are not already in the current user's list in the unseen names list
        unseenNames = friendsNames.filter(function(obj) {
          return (
            seenFriendsNames.indexOf(obj) === -1 && myNames.indexOf(obj) === -1
          );
        });

        return {
          ...state,
          unseenNames: unseenNames
        };
      } else {
        // else find all names which the current user hasn't seen yet
        //and does not have on his own list
        unseenNames = friendsNames.filter(function(obj) {
          return (
            seenFriendsNames.indexOf(obj) === -1 && myNames.indexOf(obj) === -1
          );
        });
        return {
          ...state,
          unseenNames: unseenNames
        };
      }

    case UPDATE_SEEN_NAMES:
      let tempUsr3 = Object.assign(state.user);
      tempUsr3.seenFriendsNames = action.payload;

      return {
        ...state,
        user: tempUsr3
      };

    case UPDATE_UNSEEN_NAMES:
      let unseenNames2 = state.unseenNames;
      unseenNames2.splice(0, 1);

      return {
        ...state,
        unseenNames: unseenNames2
      };

    case FIND_MATCHES:
      let myNames2 = state.user.names;
      let friendsNames2 = state.friendsNames;
      let matches = myNames2.filter(function(obj) {
        return friendsNames2.indexOf(obj) !== -1;
      });
      return {
        ...state,
        matches: matches
      };

    default:
      return state;
  }
}
