import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Notification } from 'react-notification';
import { connect } from 'react-redux';
import { clearAction } from '#app/util/notify';
import { bindActionCreators } from 'redux';

class NotificationComponent extends PureComponent {
  static propTypes = {
    message: PropTypes.string,
    label: PropTypes.string,
    active: PropTypes.bool,
    action: PropTypes.func,
  };

  getNotificationStyles = () => {
    const bar = {
      background: '#263238',
      zIndex: '10000000000000',
    };
    let noteDimensions = { width: 250 };
    let note;
    let active;

    if (process.env.BROWSER) {
      note = document.querySelector('.notification-bar');
      if (note) {
        noteDimensions = note.getBoundingClientRect();
        active = {
          left: `${(Math.floor(window.innerWidth - noteDimensions.width) / 2)}px`,
        };
      } else {
        active = {
          left: '200px',
        };
      }
    }

    const action = {
      color: '#FFCCBC',
    };

    return { bar, active, action };
  };

  render() {
    const { message, label, action, active, timeout, dispatch } = this.props;
    return (
      <Notification
        style
        isActive={active}
        message={message}
        action={label}
        onClick={action || bindActionCreators(clearAction, dispatch)}
        onDismiss={action || bindActionCreators(clearAction, dispatch)}
        dismissAfter={timeout}
        activeBarStyle={this.getNotificationStyles().active}
        actionStyle={this.getNotificationStyles().action}
        barStyle={this.getNotificationStyles().bar}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  message: state.Notification.get('message'),
  active: state.Notification.get('isActive'),
  timeout: state.Notification.get('timeout'),
  label: state.Notification.get('acceptLabel'),
});

export default connect(mapStateToProps)(NotificationComponent);
