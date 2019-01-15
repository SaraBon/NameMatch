import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  findUserByCode,
  linkAccounts,
  getFriendsNames,
  calcUnseenNames,
  deleteAccount
} from "./actions/userActions";

class Account extends Component {
  constructor() {
    super();
    this.state = {
      linkUser: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.findUserByCode(
      this.state.linkUser,
      this.props.state.user.name,
      this.props.state.user._id
    );
  };

  //render a different UI depending on if the user is already linked to another user or not
  renderLinkAccount = () => {
    if (this.props.state.user.linkedID) {
      return (
        <div>
          <h3>Link Your Account</h3>

          <p>Your Account is linked to {this.props.state.user.linkedName}</p>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Link Your Account</h3>
          <div>
            Your Code:{" "}
            <span className="code"> {this.props.state.user.linkCode} </span>{" "}
          </div>
          <div>To link your account, share your Code with a friend.</div>

          <div>Or insert here your friend's code: </div>

          <form onSubmit={this.onSubmit}>
            <div className="">
              <label htmlFor="code">Your Friend's Code</label>

              <input
                onChange={this.onChange}
                value={this.state.findUserByCode}
                id="linkUser"
                type="code"
              />
            </div>

            <div>
              <button type="submit" className="btn btn-light">
                Link
              </button>
            </div>
          </form>
        </div>
      );
    }
  };

  render() {
    if (!this.props.state.isAuthenticated) {
      return <Redirect to="/Login" />;
    }
    if (this.props.state.isAuthenticated) {
      return (
        <div className="content">
          <div className="form-wrap">
            {this.renderLinkAccount()}
            <div>
              <h3>Your Data</h3>
              <p>Name: {this.props.state.user.name}</p>
              <p>Email: {this.props.state.user.email}</p>
            </div>
            <div>
              <button
                className="btn btn-light"
                onClick={() =>
                  this.props.deleteAccount(this.props.state.user._id)
                }
              >
                Delete my account
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="content">
          <h1>Please log in</h1>
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
  {
    findUserByCode,
    linkAccounts,
    getFriendsNames,
    calcUnseenNames,
    deleteAccount
  }
)(Account);
