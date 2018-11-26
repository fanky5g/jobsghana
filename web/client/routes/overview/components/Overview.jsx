import React from 'react';
import requireAuthentication from '#app/common/components/AuthenticatedComponent';

const Overview = () => (
  <div className="Overview mdl-shadow--2dp">
    <div className="Overview__inner">
      <div className="Overview__inner--row">
        <h3 className="Overview__inner--row-main_header">Analytics Coming Soon</h3>
      </div>
      <div className="Overview__inner--row">
        <h3 className="Overview__inner--row-header">Website visits:</h3>
        <span className="Overview__inner--row-data">--</span>
      </div>
    </div>
  </div>
);

export default requireAuthentication(Overview, ['superadmin', 'admin'], false);
