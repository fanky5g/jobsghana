import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Cell } from 'react-mdl';
import classNames from 'classnames';
import { displayDate } from '#app/lib/date';

const PostListItem = ({ post, onPostClick }) => {
  const authorName = post.ip_owner;

  return (
    <Grid className="List__Item" onClick={() => onPostClick(post.ID)}>
      <Cell col={4} className="List__Item_subcontainer">
        <span className="List__Item_name">{post.title}</span>
      </Cell>
      <Cell col={4} className="List__Item_subcontainer">
        <span className="List__Item_name">{authorName}</span>
      </Cell>
      <Cell col={2} className="List__Item_subcontainer">
        <span
          className={
            classNames({
              List__Item_name: true,
              published: post.published,
              unpublished: !post.published,
            })
          }
        >
          {post.published ? 'true' : 'false'}
        </span>
      </Cell>
      <Cell col={2} className="List__Item_subcontainer">
        <span className="List__Item_name">{displayDate(post.pub_date)}</span>
      </Cell>
    </Grid>
  );
};

PostListItem.propTypes = {
  post: PropTypes.object.isRequired,
  onPostClick: PropTypes.func.isRequired,
};

export default PostListItem;
