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
        <div className="demo-text">
          <h3>Random Baby Name Generator</h3>
          <p>Find your favorite baby name</p>
          <p>Database of 70.000 international names</p>
          <p>Easy tinder-like swiping of names </p>
          <p>Link your account to your partner and find name matches ❤</p>
        </div>
        <div>
          <video
            className="demo-video"
            autoPlay
            loop
            id="myVideo"
            src="https://res.cloudinary.com/hgc6snrq8/video/upload/v1547468755/demo.mp4"
          />
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

export default connect(mapStateToProps)(Home);
