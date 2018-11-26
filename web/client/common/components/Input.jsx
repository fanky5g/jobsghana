import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Input extends PureComponent {
	state = {
		value: '',
	};

	constructor(props) {
		super(props);
		if (props.value != this.state.value) {
			this.state.value = props.value;
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.state.value) {
			this.setState({
				value: nextProps.value,
			});
		}
	}

	onFieldChange = (evt) => {
		this.setState({
			value: evt.target.value,
		});
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		if (this.state.value != nextState.value) {
			return true;
		}

		return false;
	};

	render() {
		const { onChange, value, ...props } = this.props;
		// figure out how to save value in state and only update onblur

		return (
			<input {...props} onChange={this.onFieldChange} value={this.state.value} onBlur={onChange} />
		);
	}
}

export default Input;