import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DashBarUser extends PureComponent {
  static propTypes = {
    user: PropTypes.object,
    passedAvatar: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    const { user, passedAvatar } = this.props;

    return (
      <div className="DashBarUser" style={{ display: 'inline-block' }}>
      {
        passedAvatar &&
          <img
            className={this.props.className || 'AppBarUser__avatar'}
            alt="avatar"
            src={passedAvatar}
          />
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
});

export default connect(mapStateToProps)(DashBarUser);
