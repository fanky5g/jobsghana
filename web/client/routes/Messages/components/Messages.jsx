import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MessageListItem from './MessageListItem';
import moment from 'moment';

class Messages extends PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    loading: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  goToUrl = (path) => {
    const { router } = this.context;
    router.push(path);
  };

  render() {
    const { messages } = this.props;

    return (
      <div className="Messages">
        <div className="container">
        {
          messages.length === 0 &&
            <div style={{ textAlign: 'center', background: '#fafafa' }}>
              <span>No messages</span>
            </div>
        }
        {
          messages.length > 0 &&
            <div className="Messages__container">
            {
              messages.sort((message1, message2) => {
                const check = moment(message1.date).format('x') >
                  moment(message2.date).format('x');
                return check ? -1 : 1;
              })
              .map((message, index) =>
                (<MessageListItem key={index} message={message} goToUrl={this.goToUrl} />))
            }
            </div>
        }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.Messages.toJSON().loading,
});

export default connect(mapStateToProps)(Messages);
