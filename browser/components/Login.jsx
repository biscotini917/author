import React from 'react';
import { connect } from 'react-redux';
import { login as loginFromReducer } from '../redux/auth';

/* -----------------    COMPONENT     ------------------ */

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    console.log(this.state, 'current state')
    const { message } = this.props;
    return (
      <div className="signin-container">
        <div className="buffer local">
          <form onSubmit={this.onLoginSubmit}>
            <div className="form-group">
              <label>email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                onChange={this.handleChange}
                value={this.state.email}
                required
              />
            </div>
            <div className="form-group">
                <label>password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  onChange={this.handleChange}
                  value={this.state.password}
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

  onLoginSubmit(event) {
    event.preventDefault();
    this.props.login(this.state)
    this.setState({
      email: '',
      password: ''
    })
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = () => ({ message: 'Log in' });
const mapDispatch = (dispatch, ownProps) => (
  {
    login: credentials => dispatch(loginFromReducer(credentials, ownProps.history))
  }
);

export default connect(mapState, mapDispatch)(Login);
