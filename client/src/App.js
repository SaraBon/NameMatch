import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./index.scss";

//Redux
import { connect } from "react-redux";
import { logoutUser } from "./actions/userActions";

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
import Info from "./Info";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false
    };
  }

  //depending on if a user is logged in or not, render different buttons
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

  //toggle between open and hidden state of menu by adding / removing a css class
  toggleMenu = () => {
    let menuIcon = document.getElementById("menu-icon");
    let menu = document.getElementById("menu");

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
            <div className="clickable-area">
              <div id="menu-icon" onClick={this.toggleMenu}>
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </header>
          <Menu toggleMenu={this.toggleMenu} />
          <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/home" render={() => <Home />} />
            <Route path="/register" render={() => <Register />} />
            <Route path="/login" render={() => <Login />} />
            <Route path="/Board" render={() => <Board />} />
            <Route path="/MyNames" render={() => <MyNames />} />
            <Route path="/FriendsNames" render={() => <FriendsNames />} />
            <Route path="/Matches" render={() => <Matches />} />
            <Route path="/Account" render={() => <Account />} />
            <Route path="/Info" render={() => <Info />} />
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
