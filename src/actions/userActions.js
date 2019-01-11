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
            console.log("full friend's user data: ");
            console.log(res.data);

            let friendsNames = res.data.names;

            dispatch({
              type: "UPDATE_FRIENDS_NAMES",
              payload: friendsNames
            });
            // if the friend has names on his list, dispatch action to calculate
            //the new names (which the current user hasn't seen yet)
            if (res.data.names.length > 0) {
              dispatch({
                type: "CALC_UNSEEN_NAMES"
              });
            }
          });
        }
      });
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: "VALIDATION_ERROR",
        payload: err.response.data
      });
    });
};

export const setCurrentUser = userData => {
  return {
    type: "SET_CURRENT_USER",
    payload: userData
  };
};

export const registerUser = userData => dispatch => {
  axios
    .post("/users/register", userData)
    .then(() => {
      toast.success(`Welcome ${userData.name}`);
      dispatch({
        type: "REGISTRATION_SUCCESS"
      });
    })
    .catch(err => {
      dispatch({
        type: "VALIDATION_ERROR",
        payload: err.response.data
      });
    });
};

// Get current user
export const getCurrentUser = () => dispatch => {
  dispatch(setUserLoading());
  axios
    .get("/api/user/currentuser")
    .then(res =>
      dispatch({
        type: "GET_CURRENT_USER",
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: "GET_ERRORS",
        payload: err.response.data
      })
    );
};

export const getFriendsNames = friendsID => dispatch => {
  dispatch(setUserLoading());
  axios
    .get(`/users/get/${friendsID}`)
    .then(res => {
      console.log("full friend's user data: ");
      console.log(res.data);

      let friendsNames = res.data.names;

      dispatch({
        type: "UPDATE_FRIENDS_NAMES",
        payload: friendsNames
      });
    })

    .catch(err => console.log(err));
};

//set USER_LOADING
export const setUserLoading = () => {
  return {
    type: "USER_LOADING"
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

export const deleteName = (userID, index) => dispatch => {
  axios
    .post(`/users/delete/${userID}`, { index: index })
    .then(res => {
      dispatch({
        type: "UPDATE_NAMES",
        payload: res.data.names
      });
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: "DELETE_ERRORS",
        payload: err.response.data
      });
      toast.error(`${err.response.data.error}`);
    });
};

export const deleteNameByName = (userID, name) => dispatch => {
  axios
    .post(`/users/delete/${userID}`, { name: name })
    .then(res => {
      dispatch({
        type: "UPDATE_NAMES",
        payload: res.data.names
      });
      //as this function is used in the context of the matches component
      //we now recalculate the matches
    })
    .then(() => {
      dispatch({
        type: "FIND_MATCHES"
      });
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: "DELETE_ERRORS",
        payload: err.response.data
      });
      toast.error(`${err.response.data.error}`);
    });
};

export const addName = (userID, name) => dispatch => {
  axios
    .put(`/users/update/${userID}`, { name: name })
    .then(res => {
      console.log(res);
      console.log(res.data.names);
      dispatch({
        type: "UPDATE_NAMES",
        payload: res.data.names
      });
    })
    .catch(
      err => {
        console.log(err);
      }
      // dispatch({
      //   type: "GET_ERRORS",
      //   payload: err.response.data
      // })
    );
};

export const addSeenName = (userID, name) => dispatch => {
  axios
    .put(`/users/update/seen/${userID}`, { name: name })
    .then(res => {
      dispatch({
        type: "UPDATE_SEEN_NAMES",
        payload: res.data.seenFriendsNames
      });
    })
    .catch(
      err => {
        console.log(err);
      }
      // dispatch({
      //   type: "GET_ERRORS",
      //   payload: err.response.data
      // })
    );
};

export const linkAccounts = (userID, userData) => dispatch => {
  //link the 2 accounts
  console.log("linkUsers");
  axios
    .put(`/users/linkUsers/${userID}`, userData)
    .then(res => {
      console.log(res.data);
      dispatch({
        type: "LINK_ACCOUNTS",
        payload: res.data
      });
      toast.success(`You are now linked with ${res.data.name}`);
      // also load the friend's names
      dispatch({
        type: "UPDATE_FRIENDS_NAMES",
        payload: res.data.names
      });

      return res;
    })
    //finally calculate the
    .then(res => {
      dispatch({
        type: "CALC_UNSEEN_NAMES"
      });
    });
};

export const calcUnseenNames = () => {
  console.log("calc unseen names");
  return {
    type: "CALC_UNSEEN_NAMES"
  };
};

export const updateUnseenNames = () => {
  return {
    type: "UPDATE_UNSEEN_NAMES"
  };
};

export const findMatches = () => {
  return {
    type: "FIND_MATCHES"
  };
};

export const clearErrors = () => dispatch => {
  dispatch({
    type: "CLEAR_ERRORS"
  });
};

export const deleteAccount = userID => dispatch => {
  console.log(userID);
  axios.delete(`/users/delete/${userID}`).then(() => {
    toast.success("Your account is deleted");
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
  });
  dispatch({
    type: "DELETE_ACCOUNT"
  });
};
