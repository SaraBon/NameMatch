import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { registerUser, clearErrors } from "./actions/userActions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      redirect: false
    };
  }

  // clear the validation errors when the user navigates away from this route
  componentWillUnmount() {
    this.props.clearErrors();
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    //generate a random code for the user before submitting
    const linkCode = Math.random()
      .toString(36)
      .substring(2, 8);
    // create an object of the new user to pass to the function registerUser()
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      linkCode: linkCode
    };
    this.props.registerUser(newUser);
  };

  // render errors, if there are
  renderErrors = () => {
    if (this.props.errors.errors) {
      return (
        <div>
          <p className="error">{this.props.errors.errors.name}</p>
          <p className="error">{this.props.errors.errors.email}</p>
          <p className="error">{this.props.errors.errors.password}</p>
          <p className="error">{this.props.errors.errors.password2}</p>
        </div>
      );
    }
  };

  render() {
    if (this.props.state.registration_success) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="content">
        <div className="form-wrap">
          <div>
            <h3>Register below</h3>
            <p className="">Already have an account?</p>
            <p className="link">
              <Link to="/login"> Log in here</Link>
            </p>
            {this.renderErrors()}
          </div>
          <form noValidate onSubmit={this.onSubmit}>
            <div className="">
              <label htmlFor="name">Name</label>
              <input
                onChange={this.onChange}
                value={this.state.name}
                id="name"
                type="text"
              />
            </div>
            <div className="">
              <label htmlFor="email">Email</label>

              <input
                onChange={this.onChange}
                value={this.state.email}
                id="email"
                type="email"
              />
            </div>
            <div className="">
              <label htmlFor="password">Password</label>

              <input
                onChange={this.onChange}
                value={this.state.password}
                id="password"
                type="password"
              />
            </div>
            <div className="">
              <label htmlFor="password2">Confirm Password</label>

              <input
                onChange={this.onChange}
                value={this.state.password2}
                id="password2"
                type="password"
              />
            </div>
            <div>
              <button type="submit" className="btn btn-light">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  state: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { registerUser, clearErrors }
)(Register);
