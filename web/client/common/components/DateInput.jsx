import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';

class DateInput extends PureComponent {
	static propTypes = {
		value: PropTypes.string.isRequired,
		onEdit: PropTypes.func.isRequired,
		field: PropTypes.string.isRequired,
		keyName: PropTypes.string.isRequired,
		index: PropTypes.number,
		format: PropTypes.string,
	};

	dateChanged = (momentDate, dateString) => {
		const { keyName, onEdit, field, index } = this.props;
		if (momentDate) {
			onEdit(field, keyName, momentDate.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'), index);
		}
	};

	render() {
		const { className } = this.props;

		return <DatePicker className={className} value={this.props.value != '' ? moment(this.props.value): moment(new Date().toISOString())} format={this.props.format || undefined} onChange={this.dateChanged.bind('endDate')} />
	}
}

export default DateInput;