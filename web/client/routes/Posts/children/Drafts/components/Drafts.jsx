import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Cell, Spinner } from 'react-mdl';
import PostListItem from '../../../components/PostListItem';

const Drafts = ({ posts, loading, onPostClick }) => (
  <div className="Published List">
    <div className="List__container">
      <div className="container">
        {
          posts.length > 0 &&
          <Grid className="List__Header">
            <Cell col={3}>Title</Cell>
            <Cell col={3}>Author</Cell>
            <Cell col={3}>Published</Cell>
            <Cell col={3}>Date</Cell>
          </Grid>
        }
        {
          !loading && posts.length > 0 &&
            posts.filter(post => !post.published).map((post, index) =>
              (<PostListItem post={post} key={index} onPostClick={onPostClick} />))
        }
        {
          !loading && posts.filter(post => !post.published).length === 0 &&
            <div
              style={{
                width: '100%',
                display: 'block',
                textAlign: 'center',
                fontVariant: 'small-caps',
              }}
            >
              <strong>No posts</strong>
            </div>
        }
        {
          loading &&
            <div
              style={{
                display: 'block',
                position: 'relative',
                height: '36px',
                textAlign: 'center',
              }}
            >
              <Spinner style={{ position: 'absolute', left: '50%', top: '15%' }} />
            </div>
        }
      </div>
    </div>
  </div>
);

Drafts.propTypes = {
  posts: PropTypes.array,
  loading: PropTypes.bool,
  onPostClick: PropTypes.func,
};

export default Drafts;
