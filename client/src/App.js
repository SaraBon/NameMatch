import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./index.scss";
import { NavLink } from "react-router-dom";

//Redux
import { connect } from "react-redux";
import { logoutUser } from "./actions/userActions";

//Components
import Home from "./Home";
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
import Loader from "react-loader-spinner";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false
    };
  }

  componentDidMount = () => {
    document.addEventListener("click", this.handleDocumentClick);
  };

  // function to close menu if clicked anywhere outside
  handleDocumentClick = evt => {
    const menuArea = ReactDOM.findDOMNode(this.refs.menuArea);
    const menuButton = ReactDOM.findDOMNode(this.refs.menuButton);

    let menuIcon = document.getElementById("menu-icon");
    let menu = document.getElementById("menu");

    if (
      !menuArea.contains(evt.target) &&
      !menuButton.contains(evt.target) &&
      this.state.menuIsOpen
    ) {
      menuIcon.classList.remove("isopen");
      menu.classList.remove("isopen");
      this.setState({ menuIsOpen: false });
    }
  };

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

  // render names list only if user logged in
  renderMyNames = () => {
    if (this.props.state.isAuthenticated) {
      return (
        <li>
          <NavLink
            exact
            to="/MyNames"
            activeStyle={{
              color: "#f57075"
            }}
            onClick={this.props.toggleMenu}
          >
            My Names
          </NavLink>
        </li>
      );
    }
  };

  // render matches list only if user logged in & has another user linked
  renderMatches = () => {
    if (this.props.state.isAuthenticated && this.props.state.user.linkedID) {
      return (
        <li>
          <NavLink
            exact
            to="/Matches"
            activeStyle={{
              color: "#f57075"
            }}
            onClick={this.toggleMenu}
          >
            Matches
          </NavLink>
        </li>
      );
    }
  };

  // render account only if user logged in
  renderAccount = () => {
    if (this.props.state.isAuthenticated) {
      return (
        <li>
          <NavLink
            exact
            to="/Account"
            activeStyle={{
              color: "#f57075"
            }}
            onClick={this.toggleMenu}
          >
            Account
          </NavLink>
        </li>
      );
    }
  };

  render() {
    return (
      <Router>
        <div id="wrapper">
          <ToastContainer />
          <header>
            {this.renderLogBtn()}
            <div className="clickable-area" ref="menuButton">
              <div id="menu-icon" onClick={this.toggleMenu}>
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </header>
          <div>
            <div id="menu" ref="menuArea">
              <ul>
                <li>
                  <NavLink
                    exact
                    to="/Home"
                    activeStyle={{
                      color: "#f57075"
                    }}
                    onClick={this.toggleMenu}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    exact
                    to="/Board"
                    activeStyle={{
                      color: "#f57075"
                    }}
                    onClick={this.toggleMenu}
                  >
                    Name Board
                  </NavLink>
                </li>
                {this.renderMyNames()}
                {this.renderMatches()}
                {this.renderAccount()}
                <li>
                  <NavLink
                    exact
                    to="/Info"
                    activeStyle={{
                      color: "#f57075"
                    }}
                    onClick={this.toggleMenu}
                  >
                    Info
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <Switch>
            {this.props.state.loading && (
              <div className="content">
                <div className="card-container">
                  <Loader
                    type="Hearts"
                    color="#BFE2E2"
                    height="100"
                    width="100"
                  />
                </div>
              </div>
            )}
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
