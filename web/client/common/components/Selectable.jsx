import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import assign from 'object-assign';
import Select from 'react-select';

class Selectable extends PureComponent {

	static propTypes = {
		options: PropTypes.array.isRequired,
		onChange: PropTypes.func.isRequired,
		defaultValue: PropTypes.object,
		name: PropTypes.string.isRequired,
		placeholder: PropTypes.string,
		classNames: PropTypes.string,
		clearable: PropTypes.bool,
	};

	state = {
		selected: {
			label: '',
			value: '',
		},
	};

	constructor(props) {
		super(props);
		const { options, defaultValue } = this.props;
		if (defaultValue) {
			this.state = assign(this.state, {
				selected: defaultValue,
			});
		} else if (options && Array.isArray) {
			this.state = assign(this.state, {
				selected: options[0],
			});
		}
	}

	selectOption = (option) => {
		this.setState({
			selected: option,
		});
		this.props.onChange(option);
	};

	render() {
		const { options, name, classNames, placeholder, defaultValue, clearable, loading } = this.props;
		const { selected } = this.state;

		return (
			<Select
			  className={classNames}
			  name={name}
			  options={options}
			  placeholder={placeholder}
			  value={selected.value}
			  onChange={this.selectOption}
			  isLoading={loading || false}
			  clearable={clearable || false}
			/>
		);
	}
}

export default Selectable;