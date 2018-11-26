import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

export default class UnauthorizedComponent extends PureComponent {
  static contextTypes = {
    router: PropTypes.object,
  };

  goBack = () => {
    const { router } = this.context;
    router.goBack();
  };

  render() {
    // @todo:if user is logged in check for session expiry
    return (
      <div className="Content">
        <div style={{margin: '0 auto', textAlign: 'center'}}>
          <span style={{color: '#34365f', marginBottom: '8px', fontSize: '24px'}}>Oops! you are not authorized to visit this page</span>
          <br /><br />
          <Button type="primary" size="large" onClick={this.goBack}>Go Back</Button>
        </div>
      </div>
    );
  }
}
