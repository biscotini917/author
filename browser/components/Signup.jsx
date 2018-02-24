import React from 'react';
import { connect } from 'react-redux';
import { signUp } from '../redux/auth';
import axios from 'axios';

/* -----------------    COMPONENT     ------------------ */

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { message } = this.props;
    return (
      <div className="signin-container">
        <div className="buffer local">
          <form onSubmit={this.onSignUpSubmit}>
            <div className="form-group">
              <label>email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-block btn-primary">{message}</button>
          </form>
        </div>
        <div className="or buffer">
          <div className="back-line">
            <span>OR</span>
          </div>
        </div>
        <div className="buffer oauth">
          <p>
            <a
              target="_self"
              href="/auth/google"
              className="btn btn-social btn-google">
              <i className="fa fa-google" />
              <span>{message} with Google</span>
            </a>
          </p>
        </div>
      </div>
    );
  }

  onSignUpSubmit(event) {
    event.preventDefault();
    this.props.signUp({
      email: event.target.email.value,
      password: event.target.password.value
    })

    this.setState({
      email: '',
      password: ''
    })
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = () => ({ message: 'Sign up' });
const mapDispatch = (dispatch, ownProps) => (
  {
    signUp: credentials => dispatch(signUp(credentials, ownProps.history))
  }
)

export default connect(mapState, mapDispatch)(Signup);
