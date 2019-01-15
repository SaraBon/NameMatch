import React, { Component } from "react";
import "./index.scss";
import { getFriendsNames } from "./actions/userActions";
import { connect } from "react-redux";

class FriendsNames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      namesList: ["Hi", "You"],
      tempList: []
    };
    this.renderListItems = this.renderListItems.bind(this);
  }

  // add addEventListener
  componentDidMount() {
    document.addEventListener("animationend", this.resetListAnimationClass);

    if (this.props.state.user.linkedID) {
      this.props.getFriendsNames(this.props.state.user.linkedID);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("animationend", this.resetListAnimationClass);
  }

  renderListItems() {
    return this.props.state.friendsNames.map((name, index) => {
      return <li key={index}>{name}</li>;
    });
  }

  render() {
    if (
      this.props.state.isAuthenticated &&
      !this.props.state.loading &&
      this.props.state.friendsNames.length > 0
    ) {
      return (
        <div className="content">
          <h1>Friends Names</h1>
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
          <h1>Friends Names</h1>
          <p>There are no names on your friend's list yet</p>
        </div>
      );
    } else if (this.props.state.loading) {
      return (
        <div className="content">
          <h1>Loading...</h1>
        </div>
      );
    } else if (!this.props.state.isAuthenticated) {
      return (
        <div className="content">
          <h1>Log in to see your list of names</h1>
        </div>
      );
    } else {
      return (
        <div className="content">
          <h1>Oups</h1>
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
  { getFriendsNames }
)(FriendsNames);
