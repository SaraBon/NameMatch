import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { loginUser } from "./actions/userActions";
import { clearErrors } from "./actions/userActions";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  // clear the errors when the user navigates away from this route
  componentWillUnmount() {
    this.props.clearErrors();
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    console.log("submitting: ");
    console.log(userData);
    this.props.loginUser(userData); ///-------------
  };

  renderErrors = () => {
    if (this.props.state.errors) {
      return (
        <div>
          <p className="error">{this.props.state.errors.email}</p>
          <p className="error">{this.props.state.errors.password}</p>
          <p className="error">{this.props.state.errors.emailnotfound}</p>
          <p className="error">{this.props.state.errors.passwordincorrect}</p>
        </div>
      );
    }
  };

  render() {
    if (this.props.state.isAuthenticated) {
      return <Redirect to="/Board" />;
    }
    return (
      <div className="content">
        <div className="form-wrap">
          <h3>Login</h3>

          {this.renderErrors()}
          <form noValidate onSubmit={this.onSubmit}>
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

            <div>
              <button type="submit" className="btn btn-light">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
//export default Login;

const mapStateToProps = state => ({
  state: state.auth
});
export default connect(
  mapStateToProps,
  { loginUser, clearErrors }
)(Login);
