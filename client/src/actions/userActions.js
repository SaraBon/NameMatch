import {
  REGISTRATION_SUCCESS,
  SET_CURRENT_USER,
  USER_LOADING,
  UPDATE_NAMES,
  LINK_ACCOUNTS,
  FIND_MATCHES,
  UPDATE_FRIENDS_NAMES,
  UPDATE_SEEN_NAMES,
  UPDATE_UNSEEN_NAMES,
  CALC_UNSEEN_NAMES,
  // errors
  CLEAR_ERRORS,
  VALIDATION_ERROR,
  DELETE_ERRORS
} from "./types.js";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

// Login - get user token
export const loginUser = userData => dispatch => {
  // get basic user data
  axios
    .post("/users/login", userData)
    .then(res => {
      dispatch(setUserLoading());
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // get extended user data
      axios.get(`/users/get/${decoded._id}`).then(res => {
        let userData = res.data;

        dispatch(setCurrentUser(userData));

        // if the user has a friend linked, get the friend's names
        if (userData.linkedID) {
          axios.get(`/users/get/${userData.linkedID}`).then(res => {
            let friendsNames = res.data.names;

            dispatch({
              type: UPDATE_FRIENDS_NAMES,
              payload: friendsNames
            });
            // if the friend has names on his list, dispatch action to calculate
            //the new names (which the current user hasn't seen yet)
            if (res.data.names.length > 0) {
              dispatch({
                type: CALC_UNSEEN_NAMES
              });
            }
          });
        }
      });
    })
    .catch(err => {
      dispatch({
        type: VALIDATION_ERROR,
        payload: err.response.data
      });
    });
};

// set the current user data in the store
export const setCurrentUser = userData => {
  return {
    type: SET_CURRENT_USER,
    payload: userData
  };
};

//register a new user
export const registerUser = userData => dispatch => {
  //  dispatch(setUserLoading());
  axios
    .post("/users/register", userData)
    .then(() => {
      toast.success(`Welcome ${userData.name}`);
      dispatch({
        type: REGISTRATION_SUCCESS
      });
    })
    .catch(err => {
      dispatch({
        type: VALIDATION_ERROR,
        payload: err.response.data
      });
    });
};

//load the names list of the linked friend
export const getFriendsNames = friendsID => dispatch => {
  dispatch(setUserLoading());
  axios
    .get(`/users/get/${friendsID}`)
    .then(res => {
      let friendsNames = res.data.names;

      dispatch({
        type: UPDATE_FRIENDS_NAMES,
        payload: friendsNames
      });
    })

    .catch(err => console.log(err));
};

//set USER_LOADING
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

//add a name to a user's names list (when swiped right)
export const addName = (userID, name) => dispatch => {
  axios
    .put(`/users/update/${userID}`, { name: name })
    .then(res => {
      dispatch({
        type: UPDATE_NAMES,
        payload: res.data.names
      });
    })
    .catch(err => {
      dispatch({
        type: "GET_ERRORS",
        payload: err.response.data
      });
    });
};

//delete a name from a user's names list
export const deleteName = (userID, index) => dispatch => {
  axios
    .post(`/users/delete/${userID}`, { index: index })
    .then(res => {
      dispatch({
        type: UPDATE_NAMES,
        payload: res.data.names
      });
    })
    .catch(err => {
      dispatch({
        type: DELETE_ERRORS,
        payload: "Error deleting the name, please try again"
      });
      toast.error("Error deleting the name, please try again");
    });
};

// some explanation of the logic:
// in order to increse the chances of name matches between user A and user B (linked)
// the names of user A's list are semi-randomly sprinkled into the names presented to user B
// and vice versa
// to do this, the a state variable containing all names of user A (B)
// which have not yet been presented to user B (A)
// is calculated (client side) after the linking, the login and every loading of the name board

// find a user by his code
export const findUserByCode = (linkCode, myName, myID) => dispatch => {
  axios
    .post("/users/findUserByCode", { linkCode: linkCode })
    .then(res => {
      let userData = {
        userName: res.data.name,
        userID: res.data._id,
        myName: myName
      };
      return userData; //resends the user ID and user name to whom belongs the code
      //    this.setState({ redirect: true })
    })
    .then(res => {
      dispatch(linkAccounts(myID, res));
    });
  //  .catch(err => );
};

// link the 2 accounts
export const linkAccounts = (userID, userData) => dispatch => {
  axios
    .put(`/users/linkUsers/${userID}`, userData)
    .then(res => {
      dispatch({
        type: LINK_ACCOUNTS,
        payload: res.data
      });
      toast.success(`You are now linked with ${res.data.name}`);
      // also load the friend's names
      dispatch({
        type: UPDATE_FRIENDS_NAMES,
        payload: res.data.names
      });

      return res;
    })
    //finally calculate the friend's names which have not yet been presented to the user
    .then(res => {
      dispatch({
        type: CALC_UNSEEN_NAMES
      });
    });
};

// when a friend's name has been shown to a user, add that name to the list of friend's names seen by the user
export const addSeenName = (userID, name) => dispatch => {
  axios
    .put(`/users/update/seen/${userID}`, { name: name })
    .then(res => {
      dispatch({
        type: UPDATE_SEEN_NAMES,
        payload: res.data.seenFriendsNames
      });
    })
    .catch(err => {
      dispatch({
        type: "GET_ERRORS",
        payload: err.response.data
      });
    });
};

// calculate the list of friend's names not yet seen by the user
export const calcUnseenNames = () => {
  return {
    type: CALC_UNSEEN_NAMES
  };
};

// update the list of friend's names not yet seen by the user (after presenting a name)
export const updateUnseenNames = () => {
  return {
    type: UPDATE_UNSEEN_NAMES
  };
};

// calculate the machtes between two linked users
export const findMatches = () => {
  return {
    type: FIND_MATCHES
  };
};

// when a validation error apprears (login, register) and the user navigates
// away from the page, then the errors shall be cleared
export const clearErrors = () => dispatch => {
  dispatch({
    type: CLEAR_ERRORS
  });
};

// delete an account for good
export const deleteAccount = userID => dispatch => {
  axios.delete(`/users/delete/${userID}`).then(() => {
    toast.success("Your account is deleted");
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  });
};

//delete a name from the matches list
export const deleteNameByName = (userID, name, usersNames) => dispatch => {
  // find the name's index in the user's name list
  const index = usersNames.indexOf(name);

  dispatch(deleteName(userID, index));
  //delete it from the user's list
  axios
    .post(`/users/delete/${userID}`, { index: index })
    .then(res => {
      dispatch({
        type: UPDATE_NAMES,
        payload: res.data.names
      });
      //as this function is used in the context of the matches component
      //we now recalculate the matches
    })
    .then(() => {
      dispatch({
        type: FIND_MATCHES
      });
    })
    .catch(err => {
      dispatch({
        type: DELETE_ERRORS,
        payload: err.response.data
      });
      toast.error(`${err.response.data.error}`);
    });
};
