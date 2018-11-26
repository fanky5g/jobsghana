import React, { PureComponent } from 'react';
import { Icon, Button } from 'antd';
import classnames from 'classnames';
import Input from '#app/common/components/Input';

class AwardM extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit, index, field } = this.props;
		onEdit('award', evt.target.name, evt.target.value, index);
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
							name="title"
							placeholder="Best worker"
							id="title"
							type="text"
							value={entry.title}
						/>
						<label placeholder="Title"></label>
					</div>
				</div>
				<div className="ui-row margin-bottom-20">
					<div className="col-24">
						<Input
							onChange={this.onFieldChange}
							name="year"
							placeholder="2017"
							id="year"
							type="text"
							value={entry.year}
						/>
						<label placeholder="Year"></label>
					</div>
				</div>
				{
		           	index != 0 &&
		           	<div className="margin-top-10 clear">
		           		<Button className="move-right" icon="minus" onClick={() => removeSubField('award', index)}>Remove Entry</Button>
		           	</div>
	            }
	        </div>
		);
	}
}

export default AwardM;