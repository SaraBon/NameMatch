import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import ErrorBoundary from "./ErrorBoundary";
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
    // add addEventListener
    document.addEventListener("keydown", this.handleKeyPress);
    document.addEventListener("animationend", this.resetAnimationClass);
    // if a user is logged in and has a linked friend who has names
    // calculate the friend's names which the current user hasn't seen yet
    this.getNames().then(res => {
      this.setState({ loading: false });
    });
    if (this.props.state.friendsNames.length > 0) {
      console.log("is auth");
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
    //of the current user,s friend has names on his list which the current user
    //has not yes seen, add the first name of the unseen names to the stack

    if (this.props.state.isAuthenticated && this.props.state.unseenNames) {
      if (this.props.state.unseenNames.length > 0) {
        console.log("calc unseen names");
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
        console.log(res.data);
        let names = res.data;
        names.forEach(x => {
          namesStackTemp.push(x.name);
          this.setState({ namesStack: namesStackTemp });
          return;
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "Sara, connect to the WiFi..." });
        return err;
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
    if (nameCard1.classList.contains("swipedYes")) {
      nameCard1.classList.remove("swipedYes");
    }
    if (nameCard1.classList.contains("swipedNo")) {
      nameCard1.classList.remove("swipedNo");
    }
  };

  checkForMatch = () => {
    if (
      this.props.state.friendsNames.indexOf(this.state.namesStack[0]) !== -1
    ) {
      toast.success("It's a match!");
    }
  };
  // if clicked right arrow, add the current name to the "myNames" list and remove name from stack
  // also check if the name stack is running out of names and if so, fetch more
  handleKeyPress = key => {
    let nameCard1 = document.getElementById("name1");
    if (key.code === "ArrowRight") {
      this.checkForMatch();
      this.props.addName(this.props.state.user._id, this.state.namesStack[0]);
      nameCard1.classList.add("swipedYes");
      this.removeName();
    }
    if (key.code === "ArrowLeft") {
      nameCard1.classList.add("swipedNo");
      this.removeName();
    }

    //check if the namesStack has less then 2 entries and if so, add new names to it
    if (this.state.namesStack.length <= 2) {
      //every now and then if isAuthenicated and there are unseennames - call showUnseenFriendsName
      this.getNames();
    }
  };

  render() {
    return this.state.error ? (
      <div className="content">
        <div className="cardContainer">
          <div className="nameCard" id="name1">
            {this.state.error}
          </div>
        </div>
      </div>
    ) : this.state.loading ? (
      <div className="content">
        <div className="cardContainer">
          <div className="nameCard" id="name1">
            Loading...
          </div>
        </div>
      </div>
    ) : (
      <div className="content center">
        <div className="cardContainer">
          <div className="nameCard" id="name1">
            {this.state.namesStack[0]}
          </div>
          <div className="nameCard" id="name2">
            {this.state.namesStack[0]}
          </div>
          <div className="navigationArrows">
            <button className="navButton">
              <FontAwesomeIcon icon="angle-left" />
            </button>
            <button className="navButton">
              <FontAwesomeIcon icon="angle-right" />
            </button>
          </div>
        </div>
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
