import React, { PureComponent } from 'react';
import ListInput from '#app/common/components/ListInput';
import { Icon, Button } from 'antd';
import classnames from 'classnames';
import Input from '#app/common/components/Input';

class WorkSingle extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit, index, field } = this.props;
		onEdit('work', evt.target.name, evt.target.value, index);
	};

	render() {
		const {  removeSubField, addField, index, entry, total } = this.props;

		return (
			<div className={classnames({"margin-bottom-20": true, "padding-top-10": true, "border-top": index > 0, "padding-bottom-40": (total - 1) == index})}>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						Role
						<span>*</span>
					</label>
					<Input
						id="role"
						placeholder="Technical Lead"
						className="control-input"
						type="text"
						name="role"
						onChange={this.onFieldChange}
						value={entry.role}
					/>
				</div>
	           <div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						Company
						<span>*</span>
					</label>
					<Input
						id="company"
						name="company"
						placeholder="Microsoft"
						className="control-input"
						type="text"
						onChange={this.onFieldChange}
						value={entry.company}
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="required-fields control-label">
						<em>Time/Period</em>
					</label>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						From
						<span>*</span>
					</label>
					<Input
						id="startDate"
						name="startDate"
						placeholder="2012"
						className="control-input"
						type="text"
						onChange={this.onFieldChange}
						value={entry.startDate}
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						To
					</label>
					<Input
						id="endDate"
						name="startDate"
						placeholder="2016"
						className="control-input"
						type="text"
						onChange={this.onFieldChange}
						value={entry.endDate}
					/>
				</div>
				<div className="margin-top-10 clear">
					<label className="control-label" htmlFor="full-name">
						Duties
					</label>
					<ListInput
	               	 field="work"
	               	 keyName="duties"
	               	 index={index}
	               	 onEdit={this.props.onEdit}
	               	 data={entry.duties}
	               	 placeholder="type duty"
	               	 single="duty"
	               	/>
				</div>	           
	           {
	           	index != 0 &&
	           	<div className="margin-top-10 clear">
	           		<Button className="move-right" icon="minus" onClick={() => removeSubField('work', index)}>Remove Entry</Button>
	           	</div>
	           }
	        </div>
		);
	}
}

export default WorkSingle;