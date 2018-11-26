import React, { PureComponent } from 'react';
import { Icon, Button } from 'antd';
import classnames from 'classnames';
import Input from '#app/common/components/Input';

class SchoolM extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit, index, field } = this.props;
		onEdit('education', evt.target.name, evt.target.value, index);
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
							placeholder="Webster University, Ghana"
							name="institution"
							id="institution"
							type="text"
							value={entry.institution}
							required
						/>
						<label placeholder="University/College/Vocational/Secondary*"></label>
					</div>
				</div>
				<div className="ui-row">
					<div className="col-24 clearfix">
						<label className="required-fields right">
							Year*
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
							placeholder="2011"
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
							id="endDate"
							placeholder="2015"
							type="text"
							value={entry.endDate}
							required
						/>
						<label placeholder="2016*"></label>
					</div>
				</div>
				<div className="ui-row margin-bottom-20">
					<div className="col-24">
						<Input
							onChange={this.onFieldChange}
							name="qualification"
							placeholder="MA in Human Resource"
							id="qualification"
							type="text"
							value={entry.qualification}
							required
						/>
						<label placeholder="Qualification*"></label>
					</div>
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

export default SchoolM;