import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Button, Input, Col} from 'antd';

class StepTwo extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			password: props.fieldValues.password,
			passMatchError: ''
		};
	}

	matchPassword = (event) => {
		((event.target.value.length > 0) && (event.target.value !== this.state.password) ) ? this.setState({passMatchError: 'Passwords do not match'}) : this.setState({passMatchError: ''});
	};

	onFieldChanged = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	render() {
		return (
			<form className="Signup__container--step" onSubmit={this.props.onCallbackParent.bind(this, this.state, this.props.onSignup.bind(this, this.props.next))}>
				<div className="Signup__container--body-fieldrow">
					<Input
					    placeholder="Password"
					    name="password"
					    ref="password"
					    type="password"
					    required={true}
					    onChange={this.onFieldChanged}
					    defaultValue={this.props.fieldValues.password} 
					/>
				</div>

				<div className="Signup__container--body-fieldrow">
					<Input
					    placeholder="Confirm Password"
					    name="confirmPassword"
					    ref="confirm-password"
					    type="password"
					    required={true}
					    onChange={this.matchPassword}
					    defaultValue={this.props.fieldValues.password}
					/>
				</div>
				{
					this.state.passMatchError &&
					<div className="Signup__container--body-fieldrow error">
						<span className="error" style={{fontSize: "10px", fontWeight: "600"}}>{this.state.passMatchError}</span>
					</div>
				}
				<div className="Signup__container--body-fieldrow actions">
					{
						(this.props.index !== 0) &&
						<Button type="default" onClick={this.props.previous}>Prev</Button>
					}
					<Button type="primary" className="Signup__container--body-fieldrow_submit" icon={this.props.isWaiting ? 'loading': ''} htmlType="submit">Get Started</Button>
				</div>
			</form>
		);
	}
}

export default React.createFactory(StepTwo);