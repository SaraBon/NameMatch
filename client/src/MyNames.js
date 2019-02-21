import React, { Component } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  { deleteName }
)(MyNames);

// TEMPORARILY DISABLED ANIMATION
// resetListAnimationClass() {
//   // let list = document.getElementsByClassName("slide");
//   // for (let i = 0; i < list.length; i++) {
//   //   if (list[i].classList.contains("slide")) {
//   //     list[i].classList.remove("slide");
//   //   }
//   // }
//   // for (let i = 0; i < list.length; i++) {
//   //   if (list[i].classList.contains("slideDelete")) {
//   //     list[i].classList.remove("slideDelete");
//   //   }
//   // }
//   //now set the state with the names saved in the temp variable (so that animation is finished before we update and rerender the names list)
//   //  this.setState({ namesList: this.state.tempList });
// }
