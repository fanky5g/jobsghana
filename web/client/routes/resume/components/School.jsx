import React, { PureComponent } from 'react';
import { Icon, Button } from 'antd';
import classnames from 'classnames';
import Input from '#app/common/components/Input';

class School extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit, index, field } = this.props;
		onEdit('education', evt.target.name, evt.target.value, index);
	};

	render() {
		const {  removeSubField, addField, index, entry, total } = this.props;

		return (
			<div className={classnames({"margin-bottom-20": true, "padding-top-10": true, "border-top": index > 0, "padding-bottom-40": (total - 1) == index})}>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						University/College/Vocational Institution/Secondary
						<span>*</span>
					</label>
					<Input
						id="institution"
						placeholder="Webster University, Ghana"
						className="control-input"
						type="text"
						name="institution"
						onChange={this.onFieldChange}
						value={entry.institution}
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="required-fields control-label">
						<em>Year</em>
					</label>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						From
						<span>*</span>
					</label>
	               	<Input
						id="startDate"
						placeholder="2011"
						className="control-input"
						type="text"
						name="startDate"
						onChange={this.onFieldChange}
						value={entry.startDate}
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						To
						<span>*</span>
					</label>
					<Input
						id="endDate"
						placeholder="2015"
						className="control-input"
						type="text"
						name="endDate"
						onChange={this.onFieldChange}
						value={entry.endDate}
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						Qualification
						<span>*</span>
					</label>
					<Input
						id="qualification"
						name="qualification"
						placeholder="MA in Human Resource"
						className="control-input"
						type="text"
						onChange={this.onFieldChange}
						value={entry.qualification}
					/>
				</div>

				{
		           	index != 0 &&
		           	<div className="margin-top-10 clearfix">
		           		<Button className="move-right" icon="minus" onClick={() => removeSubField('education', index)}>Remove Entry</Button>
		           	</div>
	            }
	        </div>
		);
	}
}

export default School;