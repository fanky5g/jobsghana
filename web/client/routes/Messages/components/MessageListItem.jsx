import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Cell } from 'react-mdl';
import md5 from 'md5';
import classNames from 'classnames';
import { displayDate } from '#app/util/date';
import Link from 'react-router/lib/Link';

const MessageListItem = ({ message, goToUrl }) => {
  const author = md5(message.email.trim().toLowerCase());
  const authorImg = `https://www.gravatar.com/avatar/${author}`;

  return (
    <Grid className={classNames({ Message: true, read: message.read, unread: !message.read })}>
      <Cell col={2} className="author">
        <img src={authorImg} alt="sender" />
      </Cell>
      <Cell
        col={10}
        className="body"
        onClick={() => goToUrl(`/message?id=${message.ID}`)}
      >
        <div className="head">
          <span className="name">{message.name}</span>
          <span className="date">{displayDate(message.CreatedAt)}</span>
        </div>
        <div className="subject">
          <Link to={`/message?id=${message.ID}`}>{message.subject}</Link>
        </div>
        <p className="text">{message.message}</p>
      </Cell>
    </Grid>
  );
};

MessageListItem.propTypes = {
  message: PropTypes.object.isRequired,
  goToUrl: PropTypes.func.isRequired,
};

export default MessageListItem;
