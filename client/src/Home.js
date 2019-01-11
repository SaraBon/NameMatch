import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { connect } from "react-redux";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="content home">
        <div>Text</div>
        <div>1. Register & swipe names using the arrow keys</div>
        <div>2. Connect with a friend</div>
        <div>3. See your name-matches</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.auth
  };
};

export default connect(mapStateToProps)(Home);
