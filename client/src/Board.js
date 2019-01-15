import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { toast } from "react-toastify";

import { connect } from "react-redux";
import {
  addName,
  getFriendsNames,
  calcUnseenNames,
  addSeenName,
  updateUnseenNames
} from "./actions/userActions";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      namesStack: [],
      unseenFriendsNames: [],
      error: false,
      loading: true
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
    document.addEventListener("animationend", this.resetAnimationClass);

    this.getNames().then(res => {
      this.setState({ loading: false });
    });
    // if a user is logged in and has a linked friend who has names
    // calculate the friend's names which the current user hasn't seen yet
    if (this.props.state.friendsNames.length > 0) {
      this.props.calcUnseenNames();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
    document.removeEventListener("animationend", this.resetAnimationClass);
  }

  //get new random names and push them to the name stack
  getNames = async () => {
    let namesStackTemp = [...this.state.namesStack];
    //if the current user's friend has names on his list which the current user
    //has not yes seen, add the first name of the unseen names to the stack
    if (this.props.state.isAuthenticated && this.props.state.unseenNames) {
      if (this.props.state.unseenNames.length > 0) {
        //get the fist name of the array of unseen friends names
        let unseenName = this.props.state.unseenNames[0];
        //push it into the name stack to be shown to the current user
        namesStackTemp.push(unseenName);
        //add that name to the database of seen names of the current user
        this.props.addSeenName(this.props.state.user._id, unseenName);
        //remove that name from the store state of unseen names
        this.props.updateUnseenNames();
      }
    }

    //then, get 6 more names from the database
    axios
      .get("/names/get")
      .then(res => {
        let names = res.data;
        names.forEach(x => {
          namesStackTemp.push(x.name);
          this.setState({ namesStack: namesStackTemp });
          return;
        });
      })
      .catch(err => {
        this.setState({
          error: "Error loading names, please check your internet connection."
        });
      });
  };

  // remove the currently displayed name from the stack, function to be used in the keypress handler
  removeName = () => {
    let namesStackTemp = [...this.state.namesStack];
    namesStackTemp.splice(0, 1);
    this.setState({ namesStack: namesStackTemp });
  };

  // once the swipe animation has finished, remove the css class to "reset" the style
  resetAnimationClass = () => {
    let nameCard1 = document.getElementById("name1");
    if (nameCard1.classList.contains("swiped-yes")) {
      nameCard1.classList.remove("swiped-yes");
    }
    if (nameCard1.classList.contains("swiped-no")) {
      nameCard1.classList.remove("swiped-no");
    }
  };

  // when user "likes" the name
  swipedYes = () => {
    let nameCard1 = document.getElementById("name1");
    //check if the liked name is a match
    this.checkForMatch();
    this.props.addName(this.props.state.user._id, this.state.namesStack[0]);
    nameCard1.classList.add("swiped-yes");
    this.removeName();
  };

  // when user "dislikes" the name
  swipedNo = () => {
    let nameCard1 = document.getElementById("name1");
    nameCard1.classList.add("swiped-no");
    this.removeName();
  };

  // check if a like is a match
  checkForMatch = () => {
    if (
      this.props.state.friendsNames.indexOf(this.state.namesStack[0]) !== -1
    ) {
      toast.success("It's a match!");
    }
  };

  handleKeyPress = key => {
    if (key.code === "ArrowRight") {
      this.swipedYes();
    }
    if (key.code === "ArrowLeft") {
      this.swipedNo();
    }

    //check if the namesStack has less then 2 entries and if so, add new names to it
    if (this.state.namesStack.length <= 2) {
      this.getNames();
    }
  };

  render() {
    return this.state.error ? (
      <div className="content">
        <div className="card-container">
          <div className="nameCard" id="name1">
            {this.state.error}
          </div>
        </div>
      </div>
    ) : this.state.loading ? (
      <div className="content">
        <div className="card-container">
          <div className="nameCard" id="name1">
            Loading...
          </div>
        </div>
      </div>
    ) : (
      <div className="content center">
        <div className="card-container">
          <div className="name-card" id="name1">
            {this.state.namesStack[0]}
          </div>
          <div className="name-card" id="name2">
            {this.state.namesStack[0]}
          </div>
          <div className="navigation-arrows">
            <button className="nav-button" onClick={this.swipedNo}>
              <FontAwesomeIcon icon="angle-left" />
            </button>
            <button className="nav-button" onClick={this.swipedYes}>
              <FontAwesomeIcon icon="angle-right" />
            </button>
          </div>
        </div>
        <div className="hint">...use the arrow keys</div>
      </div>
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
  { addName, getFriendsNames, calcUnseenNames, addSeenName, updateUnseenNames }
)(Board);
