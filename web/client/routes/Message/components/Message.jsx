import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner } from 'react-mdl';
import { displayDate } from '#app/util/date';
import { markAsRead } from '../actions';

class Message extends PureComponent {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const query = props.location.query;
    const id = query.hasOwnProperty('id') ? query.id : '';
    const message = props.messages.find(item => {
      return item.ID === parseInt(id, 10);
    });
    this.state = {
      message,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { message } = this.state;
    if (message && !message.read) {
      dispatch(markAsRead(message.ID));
    }
  }

  render() {
    const { loading } = this.props;
    const { message } = this.state;

    return (
      <div className="single__message">
        <section className="section">
          <div className="container">
            <div className="section-content">
              {
                loading &&
                  <div style={{ background: '#fafafa', textAlign: 'center' }}>
                    <Spinner singleColor />
                  </div>
              }
              {
                !loading && message &&
                  <div className="body">
                    <div className="head">
                      <span className="name">{message.name}</span>
                      <span className="date">{displayDate(message.CreatedAt)}</span>
                    </div>
                    <span className="subject">Subject: {message.subject}</span>
                    <p className="text">{message.message}</p>
                  </div>
              }
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.Messages.toJSON().data,
  loading: state.Messages.toJSON().loading,
});

export default connect(mapStateToProps)(Message);
