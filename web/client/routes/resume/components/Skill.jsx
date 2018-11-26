import React, { PureComponent } from 'react';
import { Icon, Button } from 'antd';
import classnames from 'classnames';
import Input from '#app/common/components/Input';

class Skill extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit, index, field } = this.props;
		onEdit('skill', evt.target.name, evt.target.value, index);
	};

	render() {
		const {  removeSubField, addField, index, entry, total } = this.props;

		return (
			<div className={classnames({"margin-bottom-20": true, "padding-top-10": true, "border-top": index > 0, "padding-bottom-40": (total - 1) == index})}>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						Name
						<span>*</span>
					</label>
					<Input
						id="name"
						placeholder="Microsoft Word"
						className="control-input"
						type="text"
						name="name"
						onChange={this.onFieldChange}
						value={entry.name}
						required
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="level">
						Level
						<span>*</span>
					</label>
					<select required id="level" name="level" onChange={this.onFieldChange} value={entry.level} className="control-select">
						<option selected value="proficient">Proficient</option>
		                <option value="advanced">Advanced</option>
		                <option value="intermediate">Intermediate</option>
		                <option value="beginner">Beginner</option>
					</select>
				</div>
				{
		           	index != 0 &&
		           	<div className="margin-top-10 clearfix">
		           		<Button className="move-right" icon="minus" onClick={() => removeSubField('skill', index)}>Remove Entry</Button>
		           	</div>
	            }
	        </div>
		);
	}
}

export default Skill;