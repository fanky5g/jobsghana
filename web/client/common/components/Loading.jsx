import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AppLoading from '#app/util/loading';

class Loading extends PureComponent {
	constructor(props) {
		super(props);
		if (process.env.BROWSER) {
			this.AppLoading = new AppLoading({ color: '#F20664' });
		}
	}

	componentWillMount() {
		const { routeLoading } = this.props;
		if (routeLoading) {
			this.AppLoading.start();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.routeLoading == nextProps.routeLoading) {
			return false;
		}
		return true;
	}

	componentWillReceiveProps(nextProps) {
		const { routeLoading } = nextProps;
		if (routeLoading) {
			this.AppLoading.start();
		} else if (!routeLoading) {
			this.AppLoading.stop();
		}
	}

	render() {
		return (
			null
		);
	}
}

export default Loading;