import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./index.scss";
import { NavLink } from "react-router-dom";

//Redux
import { connect } from "react-redux";
import { logoutUser } from "./actions/userActions";

//Components
import About from "./About";
import Register from "./Register";
import Login from "./Login";
import Board from "./Board";
import MyNames from "./MyNames";
import FriendsNames from "./FriendsNames";
import Matches from "./Matches";
import Account from "./Account";

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
    console.log(menuArea);
    const menuButton = ReactDOM.findDOMNode(this.refs.menuButton);
    let menuIcon = document.getElementById("menu-icon");
    let menu = document.getElementById("menu");

    if (this.state.menuIsOpen) {
      if (!menuArea.contains(evt.target) && !menuButton.contains(evt.target)) {
        menuIcon.classList.remove("isopen");
        menu.classList.remove("isopen");
        this.setState({ menuIsOpen: false });
      }
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
            {this.props.state.isAuthenticated ? (
              <div className="btn-wrap">
                <button className="btn btn-light">
                  <Link to="/login" onClick={this.props.logoutUser}>
                    Logout
                  </Link>
                </button>
              </div>
            ) : (
              <div className="btn-wrap">
                <button className="btn">
                  <Link to="/login">Login</Link>
                </button>
                <button className="btn btn-light">
                  <Link to="/register">Register</Link>
                </button>
              </div>
            )}
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
                    to="/Board"
                    activeStyle={{
                      color: "#f57075"
                    }}
                    onClick={this.toggleMenu}
                  >
                    Name Board
                  </NavLink>
                </li>
                {this.props.state.isAuthenticated && (
                  <li>
                    <NavLink
                      exact
                      to="/MyNames"
                      activeStyle={{
                        color: "#f57075"
                      }}
                      onClick={this.toggleMenu}
                    >
                      My Names
                    </NavLink>
                  </li>
                )}
                {this.props.state.isAuthenticated &&
                  this.props.state.user.linkedID && (
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
                  )}
                {this.props.state.isAuthenticated && (
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
                )}

                <li>
                  <NavLink
                    exact
                    to="/About"
                    activeStyle={{
                      color: "#f57075"
                    }}
                    onClick={this.toggleMenu}
                  >
                    About
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
            <Route exact path="/" render={() => <Board />} />
            <Route exact path="/About" render={() => <About />} />
            <Route path="/register" render={() => <Register />} />
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
