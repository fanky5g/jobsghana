import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Tabs, Tab } from 'react-mdl';
import Confirm from '#app/common/components/Confirm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setAddressEditable,
  changeAddress,
  toggleAddressActive,
  revertAddress,
  cleanAuthMessage,
  addAddress,
} from '../actions';

class Account extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    type: PropTypes.string,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    notify: PropTypes.func,
    message: PropTypes.string,
    children: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTab: 0,
      tabs: ['', 'contact-details', 'billing'],
      $dirty: false,
    };

    this.registeredHook = undefined;
  }

  componentWillMount() {
    const { location } = this.props;
    const activeState = location.pathname.split('/')[3] || '';
    this.setState({
      selectedTab: this.state.tabs.indexOf(activeState),
    });
  }

  selectTab = (tabId) => {
    if (this.state.selectedTab === tabId) return;
    this.navigate(tabId);
  };

  shouldSave = (...params) => new Promise((resolve, reject) => {
    const isDirty = params[0];
    const acceptAction = params[1];
    const cancelAction = params[2];
    const tabId = params[params.length - 1];

    function cleanup(wrapper) {
      ReactDOM.unmountComponentAtNode(wrapper);
      setTimeout(() => wrapper.remove());
    }

    if (isDirty) {
      const wrapper = document.body.appendChild(document.createElement('div'));

      const modalComponent = ReactDOM.render(
        <Confirm description="You have unsaved data. Leave without saving?" />,
        wrapper);

      modalComponent.$promise.promise.finally(cleanup.bind(null, wrapper));
      modalComponent.$promise
        .promise
        .then(() => {
          reject(cancelAction);
        })
        .catch(() => {
          resolve(acceptAction);
        });
    } else {
      resolve(this.go(tabId));
    }
  });

  navigate = (tabId) => {
    if (typeof this.registeredHook === 'function') {
      this.registeredHook.call(this, tabId).then((action) => {
        if (typeof action === 'function') action();
      }, (action) => {
        if (typeof action === 'function') action();
        this.go(tabId);
      });
    } else {
      this.go(tabId);
    }
  };

  go = (tabId) => {
    this.setState({
      selectedTab: tabId,
    });
    const { router } = this.context;
    const route = `/account/${this.state.tabs[tabId]}`;
    router.push(route);
  };

  registerHook = action => {
    this.registeredHook = action;
  };

  render() {
    const { type, user: { address }, notify, message, dispatch } = this.props;

    return (
      <div className="Settings">
      {
        (type === 'shopper' || type === 'admin' || type === 'delegate') &&
          <Tabs
            activeTab={this.state.selectedTab}
            onChange={this.selectTab}
            className="Settings__tabs"
          >
            <Tab>Profile</Tab>
            <Tab>Contact Details</Tab>
          </Tabs>
      }
        <section className="Settings__Content grid">
        {
          this.props.children && React.cloneElement(this.props.children, {
            address,
            notify,
            message,
            dispatch,
            checkDirtyBeforeUnmount: this.shouldSave,
            registerHook: this.registerHook,
            handleAddressEditToggle: bindActionCreators(setAddressEditable, dispatch),
            handleAddressEdit: bindActionCreators(changeAddress, dispatch),
            toggleAddressActive: bindActionCreators(toggleAddressActive, dispatch),
            revertAddress: bindActionCreators(revertAddress, dispatch),
            cleanAuthMessage: bindActionCreators(cleanAuthMessage, dispatch),
            addAddress: bindActionCreators(addAddress, dispatch),
          })
        }
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  message: state.Account.get('message'),
});

export default connect(mapStateToProps)(Account);
