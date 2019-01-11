import React, { Component } from "react";
import "./index.scss";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderMyNames = () => {
    if (this.props.state.isAuthenticated) {
      return (
        <li>
          <NavLink
            to="/MyNames"
            activeStyle={{
              textDecoration: "underline"
            }}
            onClick={this.props.toggleMenu}
          >
            My Names
          </NavLink>
        </li>
      );
    }
  };

  renderFriendsNames = () => {
    if (this.props.state.isAuthenticated && this.props.state.user.linkedID) {
      return (
        <li>
          <NavLink
            to="/FriendsNames"
            activeStyle={{
              textDecoration: "underline"
            }}
            onClick={this.props.toggleMenu}
          >
            Friend's Names
          </NavLink>
        </li>
      );
    }
  };

  renderMatches = () => {
    if (this.props.state.isAuthenticated && this.props.state.user.linkedID) {
      return (
        <li>
          <NavLink
            to="/Matches"
            activeStyle={{
              textDecoration: "underline"
            }}
            onClick={this.props.toggleMenu}
          >
            Matches
          </NavLink>
        </li>
      );
    }
  };

  renderAccount = () => {
    if (this.props.state.isAuthenticated) {
      return (
        <li>
          <NavLink
            to="/Account"
            activeStyle={{
              textDecoration: "underline"
            }}
            onClick={this.props.toggleMenu}
          >
            Account
          </NavLink>
        </li>
      );
    }
  };

  render() {
    return (
      <div>
        <div id="menu">
          <ul>
            <li>
              <NavLink
                to="/Home"
                activeStyle={{
                  textDecoration: "underline"
                }}
                onClick={this.props.toggleMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Board"
                activeStyle={{
                  textDecoration: "underline"
                }}
                onClick={this.props.toggleMenu}
              >
                Name Board
              </NavLink>
            </li>
            {this.renderMyNames()}
            {this.renderFriendsNames()}
            {this.renderMatches()}
            {this.renderAccount()}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state: state.auth
});
export default connect(mapStateToProps)(Menu);
