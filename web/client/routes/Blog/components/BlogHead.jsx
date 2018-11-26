import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'react-mdl';

const Type = ({ type, setActive, active }) => {
  const activateType = () => {
    setActive(type);
  };

  return (
    <Button
      className={classnames({ typelink: true, active: active === type })}
      onClick={activateType}
    >
      {type}
    </Button>
  );
};

Type.propTypes = {
  type: PropTypes.string,
  setActive: PropTypes.func,
  active: PropTypes.string,
};

const BlogHead = ({ types, active, setActive }) => (
  <div className="BlogHead">
    {
      types.map((type, index) => (
        <Type setActive={setActive} type={type.type} active={active} key={index} />
      )
    )
    }
  </div>
);

BlogHead.propTypes = {
  active: PropTypes.string,
  types: PropTypes.array,
  setActive: PropTypes.func,
};

export default BlogHead;
