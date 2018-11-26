import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'react-mdl';
import Link from 'react-router/lib/Link';
import classnames from 'classnames';
import { connect }  from 'react-redux'; 
import { AddToMaillist, ResetMaillist } from '#app/common/actions/Maillist';
import Input from './Input';


class Register extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  onFieldChanged = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    const { dispatch } = this.props;
    if (this.state.email != '') {
      dispatch(AddToMaillist(this.state.email));
    }
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(ResetMaillist());
  }

  render() {
    const { isMobile } = this.props;

    return (
      <div className="register-form">
        <form
          noValidate
          className={classnames({"form-inner": true, showOnlyJS: true})}
          onSubmit={this.onSubmit}>
          {
            isMobile &&
            <div className="margin-top-10 margin-bottom-20">
              <Input
                type="email"
                name="email"
                onChange={this.onFieldChanged}
                value={this.state.email}
                required
              />
              <label placeholder="me@host.com"></label>
          </div>
          }
          {
            !isMobile &&
            <div className="margin-top-10 margin-bottom-20">
              <Input
                className="sc-input width-100p"
                placeholder="me@host.com"
                onChange={this.onFieldChanged}
                name="email"
                type="email"
                value={this.state.email}
                required
              />
            </div>
          }
          <div className="actions" style={{textAlign: "center"}}>
            {
              !this.props.waiting && !this.props.actionSuccess &&
              <Button type="submit" raised accent ripple>Sign up</Button>
            }
            {
              this.props.waiting &&
              <Spinner singleColor />
            }
          </div>
          {
            this.props.actionSuccess && !this.props.waiting &&
            <div style={{textAlign: "center", padding: "8px"}}>
              <span>Thanks for subscribing</span>
            </div>
          }
          {
            this.props.exists && !this.props.waiting &&
            <div style={{textAlign: "center", padding: "8px"}}>
              <span>You are already subscribed</span>
            </div>
          }
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  waiting: state.MailList.get('waiting'),
  actionSuccess: state.MailList.get('success'),
  exists: state.MailList.get('exists'),
});

export default connect(mapStateToProps)(Register);