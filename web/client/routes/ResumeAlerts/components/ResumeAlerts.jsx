import React, { PureComponent } from 'react';
import Footer from '#app/common/components/Footer';
import ResumeComponent from './ResumeAlertComponent';

class ResumeAlerts extends PureComponent {
	render() {
		return (
			<div className="r-alert">
        <div className="content">
          <ResumeComponent />
        </div>
        <Footer />
			</div>
		);
	}
}

export default ResumeAlerts;