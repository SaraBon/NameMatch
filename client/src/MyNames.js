import React, { Component } from "react";
import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { connect } from "react-redux";
import { deleteName } from "./actions/userActions";

//const Fragment = React.Fragment;

class MyNames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      namesList: [], //this.props.state.user.names,
      tempList: [],
      loading: true
    };
    this.renderListItems = this.renderListItems.bind(this);
    this.deleteName = this.deleteName.bind(this);
    this.resetListAnimationClass = this.resetListAnimationClass.bind(this);
  }

  // add addEventListener
  componentDidMount() {
    document.addEventListener("animationend", this.resetListAnimationClass);
  }

  componentWillUnmount() {
    document.removeEventListener("animationend", this.resetListAnimationClass);
  }

  //Delete a name from the list
  deleteName(index) {
    // CSS Animation
    // let list = document.getElementById("list").childNodes;
    // list[index].classList.add("slideDelete");
    // for (let i = index + 1; i < list.length; i++) {
    //   list[i].classList.add("slide");
    // }
    // Update Database
    console.log("clicked for deletion index: " + index);
    return this.props.deleteName(this.props.state.user._id, index);
  }

  resetListAnimationClass() {
    // let list = document.getElementsByClassName("slide");
    // for (let i = 0; i < list.length; i++) {
    //   if (list[i].classList.contains("slide")) {
    //     list[i].classList.remove("slide");
    //   }
    // }
    // for (let i = 0; i < list.length; i++) {
    //   if (list[i].classList.contains("slideDelete")) {
    //     list[i].classList.remove("slideDelete");
    //   }
    // }
    //now set the state with the names saved in the temp variable (so that animation is finished before we update and rerender the names list)
    //  this.setState({ namesList: this.state.tempList });
  }

  renderListItems() {
    return this.props.state.user.names.map((name, index) => {
      return (
        <li key={index}>
          {name}
          <button
            className="actionButton"
            onClick={() => this.deleteName(index)}
          >
            <FontAwesomeIcon icon="trash" />
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
//

const mapStateToProps = state => {
  return {
    state: state.auth
  };
};

export default connect(
  mapStateToProps,
  { deleteName }
)(MyNames);
