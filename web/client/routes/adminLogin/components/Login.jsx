import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Cell, Textfield, Checkbox, Button, Icon } from 'react-mdl';
import { connect } from 'react-redux';
import login from '../actions';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';
import { Layout } from 'antd';

class Login extends PureComponent {
  static propTypes = {
    Account: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentWillMount() {
    const { Account, location } = this.props;
    const { router } = this.context;

    if (Account.get('isAuthenticated')) {

      const returnTo = (location.query.hasOwnProperty('returnTo')) ?
      location.query.returnTo : '/';

      router.replace(returnTo);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { Account, location } = nextProps;
    const { router } = this.context;
    if (Account.get('isAuthenticated')) {
      const returnTo = (location.query.hasOwnProperty('returnTo')) ?
      location.query.returnTo : '/';
      router.replace(returnTo);
    }
  };

  onFieldChanged = evt => this.setState({
    [evt.target.name]: evt.target.value,
  });

  onSubmit = (evt) => {
    evt.preventDefault();
    const { dispatch } = this.props;
    dispatch(login(this.state));
  };

  render() {
    return (
      <div className="admin__login Content">
        <Helmet title="Login" />
        <center>
        <Cell col={6} tablet={6} phone={4} className="Login">
          <div className="Login__container">
            <div className="r">
              <div
                style={{
                  backgroundSize: "419px 91px",
                  height:"91px",
                  width: "419px"
                }}
                id="homeicon"
                >
              </div>
              <form className="Login__container--body" onSubmit={this.onSubmit}>
                <div className="ui-row width-350 margin-bottom-20">
                  <div className="col-24">
                    <input
                      onChange={this.onFieldChanged}
                      name="email"
                      type="email"
                      value={this.state.email}
                      required
                    />
                    <label placeholder="Email address"></label>
                  </div>
                </div>
                <div className="ui-row width-350 margin-bottom-20">
                  <div className="col-24">
                    <input
                      onChange={this.onFieldChanged}
                      name="password"
                      type="password"
                      value={this.state.password}
                      required
                    />
                    <label placeholder="Password"></label>
                  </div>
                </div>
                <div className="Login__container--body-submit">
                  <Button raised ripple>Sign In</Button>
                </div>
              </form>
            </div>
          </div>
        </Cell>
        </center>
      </div>
    );
  }
}

export default connect(state => ({ Account: state.Account }))(Login);
