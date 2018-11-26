import React, { PureComponent } from 'react';
import ListInput from '#app/common/components/ListInput';
import { Icon, Button } from 'antd';
import classnames from 'classnames';
import Input from '#app/common/components/Input';

class WorkSingleM extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit, index, field } = this.props;
		onEdit('work', evt.target.name, evt.target.value, index);
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
							name="role"
							id="role"
							type="text"
							placeholder="Technical Lead"
							value={entry.role}
							required
						/>
						<label placeholder="Role*"></label>
					</div>
				</div>
				<div className="ui-row margin-bottom-20">
					<div className="col-24">
						<Input
							onChange={this.onFieldChange}
							name="company"
							placeholder="Microsoft"
							id="company"
							type="text"
							value={entry.company}
							required
						/>
						<label placeholder="Company*"></label>
					</div>
				</div>
				<div className="ui-row">
					<div className="col-24 clearfix">
						<label className="required-fields right">
							Time/Period*
						</label>
					</div>
				</div>
				<div className="ui-row">
					<div className="col-24">
						<label className="required-fields left">
							From*
						</label>
					</div>
				</div>
				<div className="ui-row margin-bottom-20">
					<div className="col-24">
						<Input
							onChange={this.onFieldChange}
							name="startDate"
							placeholder="2012"
							id="startDate"
							type="text"
							value={entry.startDate}
							required
						/>
						<label placeholder="2012*"></label>
					</div>
				</div>
				<div className="ui-row">
					<div className="col-24">
						<label className="required-fields left">
							To
						</label>
					</div>
				</div>
				<div className="ui-row margin-bottom-20">
					<div className="col-24">
						<Input
							onChange={this.onFieldChange}
							name="endDate"
							placeholder="2016"
							id="endDate"
							type="text"
							value={entry.endDate}
							required
						/>
						<label placeholder="2016*"></label>
					</div>
				</div>
				<div className="ui-row">
					<div className="col-24 clearfix">
						<label className="required-fields right">
							Duties
						</label>
					</div>
				</div>
				<div className="ui-row">
					<div className="col-24">
						<ListInput
		               	 field="work"
		               	 keyName="duties"
		               	 index={index}
		               	 onEdit={this.props.onEdit}
		               	 data={entry.duties}
		               	 placeholder="type duty"
		               	 single="duty"
		               	 isMobile
			            />
					</div>
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

export default WorkSingleM;