import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Col, Input} from 'antd';

class StepOne extends PureComponent {
	state = {
		signMeUpForUpdates: false,
		allowEmployersResumeView: false,
	};

	onChange = (evt) => {
		this.setState({[evt.target.name]: evt.target.checked});
	};

	render() {
		return (
			<form className="Signup__container--step" onSubmit={this.props.onCallbackParent.bind(this, this.state, this.props.next)}>
				<div className="Signup__container--body-fieldrow">
					<Checkbox
					  name="signMeUpForUpdates"
					  defaultChecked={this.props.fieldValues.signMeUpForUpdates}
                      checked={this.state.signMeUpForUpdates}
                      onChange={this.onChange}
                    >
                      Send me Job Offers and Feature Updates
                    </Checkbox>
				</div>
				{
					this.props.fieldValues.resumeAttached &&
					<div className="Signup__container--body-fieldrow">
						<Checkbox
						  name="allowEmployersResumeView"
						  defaultChecked={this.props.fieldValues.allowEmployersResumeView}
	                      checked={this.state.allowEmployersResumeView}
	                      onChange={this.onChange}
	                    >
	                      Show my original(attached) Resume document to employers
	                    </Checkbox>
					</div>
				}
				<div className="Signup__container--body-fieldrow actions">
					{
						(this.props.index !== 0) &&
						<Button type="default" onClick={this.props.previous}>Prev</Button>
					}
					<Button type="primary" htmlType="submit" style={{marginLeft: '25%'}}>Next</Button>
				</div>
			</form>
		);
	}
}

export default React.createFactory(StepOne);