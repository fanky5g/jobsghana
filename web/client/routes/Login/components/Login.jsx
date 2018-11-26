import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import login from '../actions';
import Link from 'react-router/lib/Link';
import { Cell, Checkbox, Button } from 'react-mdl';
import { Modal } from 'antd';
import classnames from 'classnames';
import MiniFooter from '#app/common/components/MiniFooter';

class Login extends PureComponent {
  static propTypes = {
    Account: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    email: '',
    password: '',
    keepMeSignedIn: false,
    formComplete: false,
  };

  componentWillMount() {
    const { Account, location } = this.props;
    const { router } = this.context;

    if (Account.get('isAuthenticated')) {
      const defaultPage = '/me';

      const returnTo = (location.query.hasOwnProperty('returnTo')) ?
      location.query.returnTo : defaultPage;

      router.replace(returnTo);
    }
  }

  componentDidMount() {
    const { location } = this.props;
    const { router } = this.context;

    if (location.query.hasOwnProperty('uactivated') && location.query.uactivated === '_y') {
      const title = <div>
        <img style={{lineHeight: "32px", margin: "0 auto", display: "inline"}} src="/static/images/logo-24.png" />
        <span>{`Activation Success`}</span>
      </div>

        const welcome = <article>
          <p>
            Your Account was successfully activated. Continue to Login.
          </p>
        </article>

        const modal = Modal.info({
          iconType: '',
          title: title,
          content: welcome,
        });

        setTimeout(modal.destroy, 20000);
        router.replace(location.pathname.split("?")[0]);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { Account, location } = nextProps;
    const { router } = this.context;

    if (Account.get('isAuthenticated')) {
      const defaultPage = '/me';

      const returnTo = (location.query.hasOwnProperty('returnTo')) ?
      location.query.returnTo : defaultPage;

      router.replace(returnTo);
    }
  };

  componentDidUpdate = (nextProps) => {
    const { formComplete } = this.state;
    const form = ReactDOM.findDOMNode(this.refs["signin-form"]);

    var formValid = false;
    if (form) {
      formValid = form.checkValidity();
    }

    if (formValid && !formComplete) {
      this.setState({
        formComplete: formValid,
      });
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

  onKeepLogged = (evt) => {
    this.setState({
      keepMeSignedIn: evt.target.checked,
    });
  };

  onKeepLogged = (evt) => {
    this.setState({
      keepMeSignedIn: evt.target.checked,
    });
  };

  render() {
    const { Account, isMobile } = this.props;
    const { formComplete } = this.state;

    return (
      (() => {
        if (isMobile) {
          return (
            <div>
              <div className="ui-row margin-bottom-20 margin-top-20">
                <div className="col-24">
                  <h2>Sign In</h2>
                </div>
              </div>
              <div className="ui-row">
                <div className="col-24">
                  <label className="required-fields right">
                    * <em>Required Fields</em>
                  </label>
                </div>
              </div>
              <form name="signin-form" ref="signin-form" onSubmit={this.onSubmit}>
                <div className="ui-row margin-bottom-20">
                  <div className="col-24">
                    <input
                      onChange={this.onFieldChanged}
                      name="email"
                      type="email"
                      value={this.state.email}
                      required
                    />
                    <label placeholder="Email address*"></label>
                  </div>
                </div>
                <div className="ui-row margin-bottom-20">
                  <div className="col-24">
                    <input
                      onChange={this.onFieldChanged}
                      name="password"
                      type="password"
                      value={this.state.password}
                      required
                    />
                    <label placeholder="Password*"></label>
                  </div>
                </div>
                <div className="ui-row margin-bottom-20">
                  <div className="col-24">
                    <button
                      type="submit"
                      disabled={!formComplete}
                      className="margin-top-30 width-100p button-height display-block sc-button sc-button-accent sc-button-color">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          );
        } else {
          return (
            <div className="Login Form">
              <div className="container">
              <div className="padding-top-10p"></div>
              <form
                className={classnames({"Form__container--step": true, loginForm: true, "mdl-shadow--2dp": true, clearfix: true})}
                onSubmit={this.onSubmit}>
                <div className="Form__container--header margin-bottom-20">
                  <label>Sign In</label>
                </div>
                <div className="ui-row margin-bottom-20">
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
                <div className="ui-row margin-bottom-20">
                  <div className="col-24">
                    <input
                      onChange={this.onFieldChanged}
                      name="password"
                      type="password"
                      value={this.state.password}
                      required
                    />
                    <label placeholder="Password*"></label>
                  </div>
                </div>
                <div className="Form__container--fieldrow doubly">
                  <div className="Login__container--body-lockin">
                    <Checkbox checked={this.state.keepMeSignedIn} onChange={this.onKeepLogged} label="Remember Me" ripple />
                    &nbsp;|&nbsp;
                    <Link to="/login">Forgot Password?</Link>
                  </div>
                  <div className="Login__container--body-submit">
                    <Button type="submit" raised ripple>Sign In</Button>
                  </div>
                </div>
              </form>
              <MiniFooter isMobile={isMobile} />
              </div>
            </div>
          );
        }
      })()
    );
  }
}

export default connect(state => ({ Account: state.Account }))(Login);
