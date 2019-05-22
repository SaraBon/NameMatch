import React, { Component } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { deleteNameByName, findMatches } from "./actions/userActions";
import Loader from "react-loader-spinner";
import { Redirect } from "react-router-dom";

class Matches extends Component {
  componentDidMount() {
    if (this.props.state.isAuthenticated && this.props.state.user.linkedID) {
      this.props.findMatches();
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.state.matches !== prevProps.state.matches) {
      this.forceUpdate();
    }
  };

  //Delete a name from the list
  deleteName = name => {
    // Update Database
    this.props.deleteNameByName(
      this.props.state.user._id,
      name,
      this.props.state.user.names
    );
  };

  renderListItems = () => {
    return this.props.state.matches.map((name, index) => {
      return (
        <li key={index}>
          {name}
          <button
            className="action-button"
            onClick={() => this.deleteName(name)}
          >
            <FontAwesomeIcon icon="trash" />
          </button>
        </li>
      );
    });
  };

  render() {
    if (
      this.props.state.isAuthenticated &&
      this.props.state.friendsNames.length > 0
    ) {
      return (
        <div className="content">
          <h1>Our Matches</h1>
          <ul className="list" id="list">
            {this.renderListItems()}
          </ul>
        </div>
      );
    } else if (
      this.props.state.isAuthenticated &&
      this.props.state.friendsNames.length === 0
    ) {
      return (
        <div className="content">
          <h1>Our Matches</h1>
          <p>There are no names on your friend's list yet</p>
        </div>
      );
    } else if (this.props.state.isAuthenticated && this.props.state.loading) {
      return (
        <div className="content">
          <Loader type="Hearts" color="#BFE2E2" height="100" width="100" />
        </div>
      );
    } else if (!this.props.state.isAuthenticated) {
      return <Redirect to="/Login" />;
    } else {
      return (
        <div className="content">
          <h1>Oups, please try again</h1>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    state: state.auth
  };
};

export default connect(
  mapStateToProps,
  { findMatches, deleteNameByName }
)(Matches);
