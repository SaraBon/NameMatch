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
import Matches from "./Matches";
import Account from "./Account";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
// styled components
import styled from "styled-components";

const StyledNavLink = styled(NavLink)`
  &:active {
    color: "#f57075";
  }
`;

class App extends Component {
  state = {
    isMenuOpen: false
  };

  componentDidMount = () => {
    document.addEventListener("click", this.handleDocumentClick);
  };

  // close menu if clicked anywhere outside
  handleDocumentClick = evt => {
    const menuArea = ReactDOM.findDOMNode(this.refs.menuArea);
    const menuButton = ReactDOM.findDOMNode(this.refs.menuButton);

    if (this.state.isMenuOpen) {
      if (!menuArea.contains(evt.target) && !menuButton.contains(evt.target)) {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
      }
    }
  };

  toggleMenu = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  render() {
    const menuItems = [
      { path: "/Board", name: "Name Board" },
      { path: "/MyNames", name: "My Names" },
      { path: "/Matches", name: "Matches" },
      { path: "/Account", name: "Account" },
      { path: "/About", name: "About" }
    ];
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
              <div
                id="menu-icon"
                className={this.state.isMenuOpen ? "is-open" : "is-closed"}
                onClick={this.toggleMenu}
              >
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </header>
          <div>
            <div
              id="menu"
              className={this.state.isMenuOpen ? "is-open" : "is-closed"}
              ref="menuArea"
            >
              <ul>
                {menuItems.map(item => (
                  <li>
                    <StyledNavLink
                      exact
                      to={item.path}
                      onClick={this.toggleMenu}
                    >
                      {item.name}
                    </StyledNavLink>
                  </li>
                ))}
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
