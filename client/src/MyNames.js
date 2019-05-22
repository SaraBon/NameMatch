import React, { Component } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "react-loader-spinner";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { deleteName } from "./actions/userActions";

class MyNames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.renderListItems = this.renderListItems.bind(this);
  }

  //Delete a name from the list
  deleteName = index => {
    this.props.deleteName(this.props.state.user._id, index);
  };

  renderListItems() {
    return this.props.state.user.names.map((name, index) => {
      return (
        <li key={index}>
          {name}
          <button
            className="action-button"
            onClick={() => this.deleteName(index)}
          >
            <FontAwesomeIcon icon="trash" className="icon" />
          </button>
        </li>
      );
    });
  }

  render() {
    if (this.props.state.isAuthenticated && !this.props.state.loading) {
      return (
        <div className="content">
          <h1>My Names</h1>
          <ul className="list" id="list">
            {this.renderListItems()}
          </ul>
        </div>
      );
    } else if (this.props.state.loading) {
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
          <h1>Oups, try again</h1>
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
  { deleteName }
)(MyNames);
