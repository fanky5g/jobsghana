import React, { PureComponent } from 'react';

class Subscribers extends PureComponent {
	render() {
		return (
			<div className="Subscriptions">
				{this.props.children}
			</div>
		);
	}
}

export default Subscribers;