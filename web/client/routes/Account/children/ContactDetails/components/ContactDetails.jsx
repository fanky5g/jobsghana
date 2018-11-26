import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Cell, IconButton, Button, Grid, Tooltip } from 'react-mdl';
import authenticatedComponent from '#app/common/components/AuthenticatedComponent';
import Address from './Address';
import TransitionGroup from 'react-addons-transition-group';
import { editAccount } from '../actions';
import _ from 'lodash';

class ContactDetails extends PureComponent {
  static propTypes = {
    registerHook: PropTypes.func,
    checkDirtyBeforeUnmount: PropTypes.func,
    revertAddress: PropTypes.func,
    notify: PropTypes.func,
    cleanAuthMessage: PropTypes.func,
    user: PropTypes.object,
    handleAddressEdit: PropTypes.func,
    dispatch: PropTypes.func,
    handleAddressEditToggle: PropTypes.func,
    toggleAddressActive: PropTypes.func,
    addAddress: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      addresses: user.address,
      $dirty: false,
    };
    this.addresses = user.address;
  }

  componentWillReceiveProps(nextProps) {
    const {
      registerHook,
      checkDirtyBeforeUnmount,
      revertAddress,
      notify,
      cleanAuthMessage,
    } = this.props;

    if (nextProps.message) {
      notify(nextProps.message, 'Ok');
      setTimeout(cleanAuthMessage, 5000);
    }
    this.setState({
      addresses: nextProps.user.address,
      $dirty: this.checkChanged(nextProps),
    });

    registerHook(checkDirtyBeforeUnmount.bind(
      this,
      this.state.$dirty,
      null,
      revertAddress.bind(this, this.addresses)
    ));
  }

  checkChanged(obj1, obj2) {
    _.mixin({
      deepEquals: (ar1, ar2) => {
        let stillMatches;
        const fail = () => {
          stillMatches = false;
        };
        if (!((_.isArray(ar1) && _.isArray(ar2)) || (_.isObject(ar1) && _.isObject(ar2)))) {
          return false;
        }
        if (ar1.length !== ar2.length) {
          return false;
        }
        stillMatches = true;
        _.each(ar1, (prop1, n) => {
          const prop2 = ar2[n];
          if (prop1 !== prop2 && (n !== '$dirty' && n !== 'modalIsOpen')
            && !_.deepEquals(prop1, prop2)) {
            fail();
          }
        });
        return stillMatches;
      },
    });

    if (!_.deepEquals(obj1, obj2)) {
      return true;
    }
    return false;
  }

  handleSubmit = () => {
    if (!this.state.$dirty) return;

    const { addresses } = this.state;
    const { dispatch } = this.props;

    const formData = new FormData();
    formData.append('address', JSON.stringify(addresses));

    dispatch(editAccount(formData));
    this.setState({
      $dirty: false,
    });
    this.addresses = addresses;
    // reregister hooks
  };

  toggleAddressEdit = (index, state) => {
    const { handleAddressEditToggle } = this.props;
    handleAddressEditToggle(index, state);
  };

  render() {
    const { addresses } = this.state;
    const { toggleAddressActive, handleAddressEditToggle, addAddress } = this.props;

    return (
      <div>
      {
        <div className="DashContent__inner">
          <Cell className="Settings__main" col={10} phone={4} tablet={8}>
            <h2 className="dash_title">Contact Information</h2>
            {
              addresses.map((address, index) => (
                <div className="Address-container" key={index}>
                  <div className="Header">
                    <h3>Address</h3>
                  </div>
                  <Grid className="compact">
                    <Cell col={10} className="title">
                      <span>
                        {`${address.fullName || 'empty'}, ${address.addressLine1 || 'empty'}`}
                      </span>
                    </Cell>
                    <Cell col={2} className="actions">
                      <Tooltip
                        label={!address.isActive ? 'Show Address' : 'Hide Address'}
                        position="top"
                      >
                        <IconButton
                          name={!address.isActive ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                          onClick={() => toggleAddressActive(index, !address.isActive)}
                        />
                      </Tooltip>
                      {
                        address.isActive &&
                          <Tooltip
                            label={!address.editable ? 'Edit Address' : 'Done Editing Address'}
                            position="top"
                          >
                            <IconButton
                              name="edit"
                              onClick={() => handleAddressEditToggle(index, !address.editable)}
                            />
                          </Tooltip>
                      }
                    </Cell>
                  </Grid>
                  <TransitionGroup component="div">
                  {
                    address.isActive &&
                      <Address
                        editable
                        key={index}
                        address={address}
                        editable={address.editable}
                        handleAddressEdit={this.props.handleAddressEdit}
                        id={index}
                      />
                  }
                  </TransitionGroup>
                </div>
              )
            )
          }
            <Button
              raised
              accent
              className="Settings__action-btn"
              disabled={!this.state.$dirty}
              onClick={this.handleSubmit}
            >
                Update Contact
            </Button>
          </Cell>
        </div>
      }
      </div>
    );
  }
}

export default authenticatedComponent(ContactDetails);
