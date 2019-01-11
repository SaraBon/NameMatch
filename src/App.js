import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./index.scss";
import jwt_decode from "jwt-decode";

//Redux
import { connect } from "react-redux";
import { setCurrentUser, logoutUser } from "./actions/userActions";
import store from "./store";

//Components
import Home from "./Home";
import Menu from "./Menu";
import Register from "./Register";
import Login from "./Login";
import Board from "./Board";
import MyNames from "./MyNames";
import FriendsNames from "./FriendsNames";
import Matches from "./Matches";
import Account from "./Account";
import setAuthToken from "./utils/setAuthToken";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// // Check for token to keep user logged in
// if (localStorage.jwtToken) {
//   // Set auth token header auth
//   const token = localStorage.jwtToken;
//   setAuthToken(token);
//   // Decode token and get user info and exp
//   const decoded = jwt_decode(token);
//   // Set user and isAuthenticated
//   axios.get(`/users/get/${decoded._id}`).then(res => {
//     console.log("full user data: ");
//     console.log(res.data);
//
//     let userData = res.data;
//
//     // if the user has a friend linked, get the friend's data
//     store.dispatch(setCurrentUser(userData));
//   });
//   //  store.dispatch(setCurrentUser(decoded));
//   // Check for expired token
//   const currentTime = Date.now() / 1000; // to get in milliseconds
//   if (decoded.exp < currentTime) {
//     // Logout user
//     store.dispatch(logoutUser());
//     // Redirect to login
//     //window.location.href = "./login"; ------------------------------------------------------------
//   }
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false
    };
  }

  // notify = () => {
  //   toast.success("Name field is required!");
  // };

  renderLogBtn = () => {
    let logout = (
      <div className="btn-wrap">
        <button className="btn btn-light">
          <Link to="/login" onClick={this.props.logoutUser}>
            Logout
          </Link>
        </button>
      </div>
    );

    let loginAndReg = (
      <div className="btn-wrap">
        <button className="btn">
          <Link to="/login">Login</Link>
        </button>
        <button className="btn btn-light">
          <Link to="/register">Register</Link>
        </button>
      </div>
    );

    if (this.props.state.isAuthenticated) {
      return logout;
    } else {
      return loginAndReg;
    }
  };

  // show the burger menu icon only when a user is logged in
  renderMenuBtn = () => {
    if (this.props.state.isAuthenticated) {
      return (
        <div className="clickableArea">
          <div id="menu-icon" onClick={this.toggleMenu}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      );
    }
    // if there is no current user logged in and the menu is open, close the menu
    else if (!this.props.state.isAuthenticated && this.state.menuIsOpen) {
      let menu = document.getElementById("menu");
      menu.classList.remove("isopen");
      this.setState({ menuIsOpen: false });
    }
  };

  //toggle between open and hidden state of menu by adding / removing a css class
  toggleMenu = () => {
    let menuIcon = document.getElementById("menu-icon");
    let menu = document.getElementById("menu");

    console.log(this.props);

    if (!this.state.menuIsOpen) {
      menuIcon.classList.add("isopen");
      menu.classList.add("isopen");
      this.setState({ menuIsOpen: true });
    } else {
      menuIcon.classList.remove("isopen");
      menu.classList.remove("isopen");
      this.setState({ menuIsOpen: false });
    }
  };

  render() {
    return (
      <Router>
        <div id="wrapper">
          <ToastContainer />

          <header>
            {this.renderLogBtn()}
            {this.renderMenuBtn()}
          </header>
          <Menu toggleMenu={this.toggleMenu} />
          <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route
              path="/register"
              render={() => <Register notify={this.notify} />}
            />
            <Route path="/login" render={() => <Login />} />
            <Route path="/Board" render={() => <Board />} />
            <Route path="/MyNames" render={() => <MyNames />} />
            <Route path="/FriendsNames" render={() => <FriendsNames />} />
            <Route path="/Matches" render={() => <Matches />} />
            <Route path="/Account" render={() => <Account />} />
            <Route
              path=""
              render={() => (
                <div className="content">
                  <h3>Not found</h3>
                </div>
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.auth
  };
};

export default connect(
  mapStateToProps,
  { logoutUser }
)(App);
