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

  // clear the validation errors when the user navigates away from this route
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
    this.props.loginUser(userData); ///-------------
  };

  // render errors, if there are
  renderErrors = () => {
    if (this.props.errors.errors) {
      return (
        <div>
          <p className="error">{this.props.errors.errors.email}</p>
          <p className="error">{this.props.errors.errors.password}</p>
          <p className="error">{this.props.errors.errors.emailnotfound}</p>
          <p className="error">{this.props.errors.errors.passwordincorrect}</p>
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
          <form noValidate onSubmit={this.onSubmit}>
            <div className="">
              <label htmlFor="email">Email</label>

              <input
                onChange={this.onChange}
                value={this.state.email}
                id="email"
                type="email"
              />
              {this.props.errors.errors && this.props.errors.errors.email && (
                <div>
                  <p className="error">{this.props.errors.errors.email}</p>
                </div>
              )}
              {this.props.errors.errors &&
                this.props.errors.errors.emailnotfound && (
                  <div>
                    <p className="error">
                      {this.props.errors.errors.emailnotfound}
                    </p>
                  </div>
                )}
            </div>

            <div className="">
              <label htmlFor="password">Password</label>

              <input
                onChange={this.onChange}
                value={this.state.password}
                id="password"
                type="password"
              />
              {this.props.errors.errors && this.props.errors.errors.password && (
                <div>
                  <p className="error">{this.props.errors.errors.password}</p>
                </div>
              )}
              {this.props.errors.errors && this.props.errors.errors.password2 && (
                <div>
                  <p className="error">{this.props.errors.errors.password2}</p>
                </div>
              )}
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

const mapStateToProps = state => ({
  state: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, clearErrors }
)(Login);
