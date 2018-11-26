import React, { PureComponent } from 'react';
import { Icon, Button } from 'antd';
import classnames from 'classnames';
import Input from '#app/common/components/Input';

class Award extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit, index, field } = this.props;
		onEdit('award', evt.target.name, evt.target.value, index);
	};

	render() {
		const {  removeSubField, addField, index, entry, total } = this.props;

		return (
			<div className={classnames({"margin-bottom-20": true, "padding-top-10": true, "border-top": index > 0, "padding-bottom-40": (total - 1) == index})}>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="title">
						Title
						<span>*</span>
					</label>
					<Input
						id="title"
						name="title"
						placeholder="Best worker"
						className="control-input"
						type="text"
						name="title"
						onChange={this.onFieldChange}
						value={entry.title}
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="level">
						Year
						<span>*</span>
					</label>
					<Input
						id="year"
						placeholder="2017"
						className="control-input"
						type="text"
						name="year"
						onChange={this.onFieldChange}
						value={entry.year}
					/>
				</div>
				{
		           	index != 0 &&
		           	<div className="margin-top-10 clearfix">
		           		<Button className="move-right" icon="minus" onClick={() => removeSubField('award', index)}>Remove Entry</Button>
		           	</div>
	            }
	        </div>
		);
	}
}

export default Award;