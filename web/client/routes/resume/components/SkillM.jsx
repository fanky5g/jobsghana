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
			<div className={classnames({
				"padding-top-10": (index == 0),
				"padding-top-40": (index > 0),
				"border-top": index > 0,
				"padding-bottom-40": (index > 0 && index + 1 != total),
				"padding-bottom-20": (index == 0 || index + 1 == total),
			})}>
				<div className="ui-row margin-bottom-20">
					<div className="col-24">
						<Input
							onChange={this.onFieldChange}
							name="name"
							id="name"
							placeholder="Microsoft Word"
							type="text"
							value={entry.name}
							required
						/>
						<label placeholder="Name*"></label>
					</div>
				</div>
				<div className="ui-row margin-bottom-20">
					<div className="col-24">
						<select required id="level" name="level" onChange={this.onFieldChange} value={entry.level} className="control-select">
							<option selected value="proficient">Proficient</option>
			                <option value="advanced">Advanced</option>
			                <option value="intermediate">Intermediate</option>
			                <option value="beginner">Beginner</option>
						</select>
						<label placeholder="Level*"></label>
					</div>
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