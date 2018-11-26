import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

export default class UnauthorizedComponent extends PureComponent {
  static contextTypes = {
    router: PropTypes.object,
  };

  goHome = () => {
    const { router } = this.context;
    router.push('/');
  };

  render() {
    return (
      <div className="Content">
        <div style={{margin: '0 auto', textAlign: 'center'}}>
          <span style={{color: '#34365f', marginBottom: '8px', fontSize: '24px'}}>Oops! Requested Page Not Found</span>
          <br /><br />
          <Button type="primary" size="large" onClick={this.goHome}>Go Home</Button>
        </div>
      </div>
    );
  }
}
