const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  registration_success: false,
  user: {},
  friendsNames: [],
  unseenNames: [],
  loading: false,
  errors: {},
  matches: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case "VALIDATION_ERROR":
      return {
        ...state,
        errors: action.payload
      };
    case "REGISTRATION_SUCCESS":
      return {
        ...state,
        registration_success: true
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: action.payload
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
    case "UPDATE_NAMES":
      let tempUsr = Object.assign(state.user);
      tempUsr.names = action.payload;
      return {
        ...state,
        user: tempUsr
      };
    case "UPDATE_FRIENDS_NAMES":
      return {
        ...state,
        friendsNames: action.payload,
        loading: false
      };
    case "LINK_ACCOUNTS":
      let tempUsr2 = Object.assign(state.user);
      tempUsr2.linkedID = action.payload._id;
      tempUsr2.linkedName = action.payload.name;
      console.log(tempUsr2.linkedName);
      console.log(action.payload.name);

      return {
        ...state,
        loading: false
      };
    case "CALC_UNSEEN_NAMES":
      console.log("CALC_UNSEEN_NAMES:");
      console.log("friendsnames:");
      console.log(state.friendsNames);
      let friendsNames = state.friendsNames.slice();
      let seenFriendsNames = state.user.seenFriendsNames.slice();
      let myNames = state.user.names.slice();
      let unseenNames = [];

      if (!state.user.seenFriendsNames) {
        // if user has no seen Friends names, put all friends names
        //which are not already in my list in unseen names
        unseenNames = friendsNames.filter(function(obj) {
          return (
            seenFriendsNames.indexOf(obj) === -1 && myNames.indexOf(obj) === -1
          );
        });

        console.log("unseenNames (no names seen yet)");
        console.log(unseenNames);
        return {
          ...state,
          unseenNames: unseenNames
        };
      } else {
        // else find all names which the current user hasn't seen yet
        //and does not have on his own list

        console.log("seenFriendsNames:");
        console.log(state.user.seenFriendsNames);

        unseenNames = friendsNames.filter(function(obj) {
          return (
            seenFriendsNames.indexOf(obj) === -1 && myNames.indexOf(obj) === -1
          );
        });
        console.log("unseenNames");
        console.log(unseenNames);
        return {
          ...state,
          unseenNames: unseenNames
        };
      }
    case "UPDATE_SEEN_NAMES":
      console.log(
        "reducer UPDATE_SEEN_NAMES = adding the shown name to the array of seen names"
      );

      let tempUsr3 = Object.assign(state.user);
      tempUsr3.seenFriendsNames = action.payload;
      console.log("seenFriendsNames now:");
      console.log(tempUsr3.seenFriendsNames);

      return {
        ...state,
        user: tempUsr3 ////problem
      };
    case "UPDATE_UNSEEN_NAMES":
      console.log(
        "reducer UPDATE_UNSEEN_NAMES = deleting the shown name from the array"
      );
      console.log("unseenFriendsNames now:");

      console.log(state.unseenNames);
      let unseenNames2 = state.unseenNames;
      unseenNames2.splice(0, 1);

      return {
        ...state,
        unseenNames: unseenNames2
      };
    case "FIND_MATCHES":
      console.log("finding matches");

      console.log(state.user.names);
      console.log(state.friendsNames);
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
