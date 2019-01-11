import React, { Component } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { deleteNameByName, findMatches } from "./actions/userActions";

//const Fragment = React.Fragment;

class Matches extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderListItems = this.renderListItems.bind(this);
    this.deleteName = this.deleteName.bind(this);
  }

  // add addEventListener
  componentDidMount() {
    if (this.props.state.isAuthenticated && this.props.state.user.linkedID) {
      this.props.findMatches();
    }

    document.addEventListener("animationend", this.resetListAnimationClass);
  }

  componentWillUnmount() {
    document.removeEventListener("animationend", this.resetListAnimationClass);
  }

  //Delete a name from the list
  deleteName(name) {
    // CSS Animation
    // let list = document.getElementById("list").childNodes;
    // list[index].classList.add("slideDelete");
    // for (let i = index + 1; i < list.length; i++) {
    //   list[i].classList.add("slide");
    // }
    // Update Database
    console.log("clicked for deletion index: " + name);
    this.props.deleteNameByName(this.props.state.user._id, name);
    this.forceUpdate();
  }

  renderListItems() {
    return this.props.state.matches.map((name, index) => {
      return (
        <li key={index}>
          {name}
          <button
            className="actionButton"
            onClick={() => this.deleteName(name)}
          >
            <FontAwesomeIcon icon="trash" />
          </button>
        </li>
      );
    });
  }

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
  { findMatches, deleteNameByName }
)(Matches);
