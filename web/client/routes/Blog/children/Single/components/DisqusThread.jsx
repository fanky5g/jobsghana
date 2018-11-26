import React from 'react';
import PropTypes from 'prop-types';
import Disqus from 'react-disqus-comments';

const DisqusThread = ({ shortname, identifier, title }) => (
  <Disqus
    shortname={shortname}
    identifier={identifier}
    title={title}
  />
);

DisqusThread.propTypes = {
  shortname: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default DisqusThread;