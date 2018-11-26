import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Cell, Spinner } from 'react-mdl';
import PostListItem from '../../../components/PostListItem';

const AllPosts = ({ loading, posts, onPostClick }) => (
  <div className="Published List">
    <div className="List__container">
      <div className="container">
        {
          posts.length > 0 &&
          <Grid className="List__Header">
            <Cell col={4}>Title</Cell>
            <Cell col={4}>Author</Cell>
            <Cell col={2}>Published</Cell>
            <Cell col={2}>Date</Cell>
          </Grid>
        }
        {
          !loading && posts.length > 0 &&
            posts.map((post, index) =>
              (<PostListItem post={post} key={index} onPostClick={onPostClick} />))
        }
        {
          !loading && posts.length === 0 &&
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

AllPosts.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.array,
  onPostClick: PropTypes.func,
};

export default AllPosts;
