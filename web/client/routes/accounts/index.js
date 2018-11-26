import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner, Grid, Cell, Textfield, Button } from 'react-mdl';
import User from './UserListItem';
import classnames from 'classnames';
import { loadMoreAccounts, getAccounts, approve, sendTargetedMail } from './actions';
import { provideHooks } from 'redial';
import MessageBox from '#app/common/components/MessageBox';

class Accounts extends PureComponent {
  static propTypes = {
  	location: PropTypes.object,
  	routes: PropTypes.array,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  state = {
    messageBoxOpen: false,
    recipientAccount: {
      email: '',
      name: '',
    },
  };

  loadMore = () => {
    const { dispatch } = this.props;
    dispatch(loadMoreAccounts());
  };

  approveAccount = (id) => {
    const { dispatch } = this.props;
    dispatch(approve(id));
  };

  openMessageBox = (recipientAccount) => {
    const wrapper = document.body.appendChild(document.createElement('div'));
    function cleanup(wrapper) {
      ReactDOM.unmountComponentAtNode(wrapper);
      setTimeout(() => wrapper.remove());
    }

    const submit = (subject, message) => {
      const { dispatch } = this.props;
      return dispatch(sendTargetedMail({
        subject,
        message,
        email: recipientAccount.email,
        name: recipientAccount.name,
      }))
    };

    const modalComponent = ReactDOM.render(
      <MessageBox email={recipientAccount.email} name={recipientAccount.name} onSubmit={submit} />,
      wrapper
    );

    modalComponent.$promise.promise.finally(cleanup.bind(null, wrapper));
  };

  render() {
  	const { loading, moreLoading, accounts, done, user } = this.props;

    return (
      <div className={classnames({accounts: true, loading: loading, "mdl-shadow--2dp": !loading})}>
        <div className="account-list List">
          <Grid className="List__Header">
            <Cell col={5}><span>Name</span></Cell>
            <Cell col={3}><span>Email</span></Cell>
            <Cell col={4}><span>Actions</span></Cell>
          </Grid>
          <div className="List__container">
            {
              accounts.length > 0 &&
              accounts
                .sort((key1, key2) => {
                  return key1.approved && !key2.approved
                })
                .map((account, index) => (
                <User
                  key={index}
                  account={account}
                  currentUser={user.email == account.email}
                  openMessageBox={this.openMessageBox}
                  approveAccount={this.approveAccount}
                  approved={account.approved}
                />
              ))
            }
            {
              accounts.length == 0 &&
              <div style={{margin: "0 auto", display: "inline-block", textAlign: "center", width: "100%", padding: "12px"}}>
                <span style={{fontSize: "14px", fontStyle: "italic"}}>No Accounts found</span>
              </div>
            }
          </div>
          <div className="container loadmore">
            {
              !moreLoading &&
              <Button raised disabled={done} ripple onClick={this.loadMore}>load more</Button>
            }
            {
              moreLoading &&
              <Spinner singleColor/>
            }
          </div>
        </div>
      </div>
    );
  }
}

const loadInitial = ({dispatch, store: {getState}}) => {
  const accounts = getState().Accounts.toJSON().data;
  const loaded = Array.isArray(accounts) && accounts.length > 0;

  if (!loaded) {
    return Promise.resolve(dispatch(getAccounts()));
  }

  return Promise.resolve();
};

const hooks = {
  defer: loadInitial,
  // fetch: loadInitial,
};

const mapStateToProps = (state) => ({
  done: state.Accounts.get('done'),
	loading: state.Accounts.get('loading'),
  moreLoading: state.Accounts.get('moreLoading'),
  user: state.Account.toJSON().user,
  accounts: state.Accounts.toJSON().data,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Accounts));
