import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swipeable from "react-swipy";
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
    this.getNames();

    // if a user is logged in and has a linked friend who has names
    // calculate the friend's names which the current user hasn't seen yet
    if (this.props.state.friendsNames.length > 0) {
      this.props.calcUnseenNames();
    }
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

    //get 6 more names from the database
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
      .then(res => {
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({
          error: "Error loading names, please check your internet connection."
        });
      });
  };

  // remove the currently displayed name from the stack
  removeName = () => {
    console.log(this.state.namesStack);
    let namesStackTemp = [...this.state.namesStack];
    namesStackTemp.splice(-1, 1);
    this.setState({ namesStack: namesStackTemp });

    //check if the namesStack has less then 2 entries and if so, add new names to it
    if (this.state.namesStack.length <= 2) {
      this.getNames();
    }
  };

  // when user "likes" the name
  swipedYes = () => {
    console.log("yes!");
    //check if the liked name is a match
    this.checkForMatch();

    //if the user is logged in, add the name to the user's list
    if (this.props.state.isAuthenticated) {
      console.log("added!");
      console.log(this.props.state.user.names);
      this.props.addName(
        this.props.state.user._id,
        this.state.namesStack[this.state.namesStack.length - 1]
      );
    }

    this.removeName();
  };

  // when user "dislikes" the name
  swipedNo = () => {
    console.log("no!");

    this.removeName();
  };

  // check if a like is a match
  checkForMatch = () => {
    if (
      this.props.state.friendsNames.indexOf(
        this.state.namesStack[this.state.namesStack.length - 1]
      ) !== -1
    ) {
      toast.success("It's a match!");
    }
  };

  // function to handle the user's swipe of a name
  handleSwipe = direction => {
    direction === "right" ? this.swipedYes() : this.swipedNo();
  };

  renderCards = () => {
    const { namesStack } = this.state;

    return namesStack.map((item, i) => {
      return (
        <div key={i} className="name-card">
          {item}
        </div>
      );
    });
  };

  render() {
    return this.state.error ? (
      <div className="content">
        <div>{this.state.error}</div>
      </div>
    ) : this.state.loading ? (
      <div className="content">
        <div>Loading...</div>
      </div>
    ) : (
      <div className="content">
        <div className="card-container">
          <div className="name-card">
            {this.state.namesStack[this.state.namesStack.length - 2]}
          </div>
          <Swipeable
            min="100"
            onSwipe={direction => this.handleSwipe(direction)}
          >
            <div className="name-card card-top">
              {this.state.namesStack[this.state.namesStack.length - 1]}
            </div>
          </Swipeable>
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
