import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Col, Input } from 'antd';
import Link from 'react-router/lib/Link';
import { signup } from '#app/common/actions/Signup';

class Signup extends PureComponent {
	state = {
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
		passwordPass: false,
		formComplete: false,
	};

	fieldChanged = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value,
		});

		if (evt.target.name === 'password' || evt.target.name == 'passwordConfirm') {
			this.forceUpdate(() => {
				if (this.state.password != '' && this.state.password == this.state.passwordConfirm) {
					this.setState({
						passwordPass: true,
					});
				} else {
					this.setState({
						passwordPass: false,
					});
				}
			});
		}
	};

	componentDidUpdate = (nextProps) => {
		const { name, email, password, passwordPass, formComplete } = this.state;
		const form = ReactDOM.findDOMNode(this.refs["sc-form"]);

		var formValid = false;
		if (form) {
			formValid = form.checkValidity();
		}

		if (formValid && passwordPass && !formComplete) {
			this.setState({
				formComplete: formValid && passwordPass,
			});
		}
	};

	onSubmit = (evt) => {
		evt.preventDefault();
		const { name, email, password } = this.state;
		const credentials = { name, email, password };
		this.props.dispatch(signup(credentials));
	};

	render() {
		const { formComplete } = this.state;
		const { isMobile } = this.props;

		return (() => {
			if (isMobile) {
				return (
					<div>
						<div className="ui-row margin-bottom-20 margin-top-20">
							<div className="col-24">
								<h2>Create a new TC Account</h2>
							</div>
						</div>
						<div className="ui-row">
							<div className="col-24">
								<label className="required-fields right">
									* <em>Required Fields</em>
								</label>
							</div>
						</div>
						<form name="sc-form" ref="sc-form" onSubmit={this.onSubmit}>
							<div className="ui-row margin-bottom-20">
								<div className="col-24">
									<input
										onChange={this.fieldChanged}
										name="name"
										type="text"
										value={this.state.name}
										required
									/>
									<label placeholder="TC account name"></label>
								</div>
							</div>
							<div className="ui-row margin-bottom-20">
								<div className="col-24">
									<input
										onChange={this.fieldChanged}
										name="email"
										type="email"
										value={this.state.email}
										required
									/>
									<label placeholder="Email address"></label>
								</div>
							</div>
							<div className="ui-row margin-bottom-20">
								<div className="col-24">
									<input
										onChange={this.fieldChanged}
										name="password"
										type="password"
										value={this.state.password}
										required
									/>
									<label placeholder="Password"></label>
								</div>
							</div>
							<div className="ui-row margin-bottom-20">
								<div className="col-24">
									<input
										onChange={this.fieldChanged}
										name="passwordConfirm"
										type="password"
										value={this.state.passwordConfirm}
										required
									/>
									<label placeholder="Confirm password"></label>
									{
										this.state.passwordConfirm !== '' && !this.state.passwordPass &&
										<span className="small-title">password does not match</span>
									}
								</div>
							</div>
							<div className="ui-row margin-bottom-20">
								<div className="col-24">
									<button
										type="submit"
										disabled={!formComplete}
										className="margin-top-30 width-100p button-height display-block sc-button sc-button-accent sc-button-color">
										Continue
									</button>
								</div>
							</div>
						</form>
					</div>
				);
			} else {
				return (
					<div className="ui-row">
						<Col xs={8} sm={8} md={8} lg={8} xl={8}>
							<form id="sc-form" ref="sc-form" onSubmit={this.onSubmit}>
								<div className="ui-row margin-bottom-20">
									<span className="col-24 title-font">
										Create a new TC Account
									</span>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<label className="left control-label sc-label">TC account name</label>
										<input
											className="sc-input"
											onChange={this.fieldChanged}
											name="name"
											type="text"
											value={this.state.name}
											required
										/>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<label className="left control-label sc-label">Email address</label>
										<input
											className="sc-input"
											onChange={this.fieldChanged}
											name="email"
											type="email"
											value={this.state.email}
											required
										/>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<label className="left control-label sc-label">Password</label>
										<input
											className="sc-input"
											onChange={this.fieldChanged}
											name="password"
											type="password"
											value={this.state.password}
											required
										/>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<label className="left control-label sc-label">Confirm password</label>
										<input
											className="sc-input"
											onChange={this.fieldChanged}
											name="passwordConfirm"
											type="password"
											value={this.state.passwordConfirm}
										/>
										{
											this.state.passwordConfirm !== '' && !this.state.passwordPass &&
											<span className="small-title sc-label">password does not match</span>
										}
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<button
											type="submit"
											disabled={!formComplete}
											className="width-300 display-block sc-button sc-button-accent sc-button-color">
											Continue
										</button>
									</div>
								</div>
								<div className="ui-row margin-bottom-50">
									<div className="col-24 margin-bottom-20 sc-label">
										<Link to="/login?returnTo=/resume">Sign in to an existing TC account</Link>
									</div>
								</div>
							</form>
						</Col>
						<Col xs={16} sm={16} md={16} lg={16} xl={16}>
							<a href="#">
		    					<img
		    						src="/static/images/signup_banner.jpg"
		    						alt="Signup_promo"
		    						width="466"
		    						height="376" />
		    				</a>
		    			</Col>
					</div>
				);
			}
		})()
	}
}

export default Signup;