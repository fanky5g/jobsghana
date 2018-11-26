import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Col} from 'antd';
import { saveResume } from '#app/routes/resume/actions';
import Input from '#app/common/components/Input';
import TextArea from '#app/common/components/TextArea';

class Profile extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit } = this.props;
		onEdit('basics', evt.target.name, evt.target.value);
	};

  	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

	render() {
		const { resume, removeSubField, addField, onEdit, isMobile } = this.props;
		const data = this.props.resume['basics'];

		return (
			(() => {
				if (isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Basic Information</h2>
								</div>
							</div>
							<form name="profile" onSubmit={this.onSubmit}>
								<div className="ui-row">
									<div className="col-24 clearfix">
										<label className="required-fields right">
											* <em>Required</em>
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="Marilyn Dansoa Ocran"
											name="name"
											id="name"
											type="text"
											value={data.name}
											required
										/>
										<label placeholder="Name"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="25th April, 1987"
											name="dob"
											id="dob"
											type="text"
											value={data.dob}
											required
										/>
										<label placeholder="Date of Birth"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="P.O.Box 42 ..."
											name="address"
											id="address"
											type="text"
											value={data.address}
											required
										/>
										<label placeholder="Address"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="marilynocran@yahoo.com"
											name="email"
											id="email"
											type="text"
											value={data.email}
											required
										/>
										<label placeholder="Email"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="+233 246 408 505"
											name="phone"
											id="phone"
											type="text"
											value={data.phone}
											required
										/>
										<label placeholder="Telephone"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="Accra"
											name="location"
											id="location"
											type="text"
											value={data.location}
											required
										/>
										<label placeholder="Town/City"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<TextArea
											data-gramm_editor="false"
											onChange={this.onFieldChange}
											name="personalStatement"
											placeholder="I am recent graduate seeking an exciting role in the Banking sector..."
											id="personalStatement"
											type="text"
											maxLength="4000"
											className="width-100p"
											value={data.personalStatement}
											required
										/>
										<label placeholder="Personal Statement"></label>
									</div>
								</div>
								<div className="ui-row">
									<div className="col-24 clearfix">
										<label className="required-fields right">
											* <em>Job Details</em>
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="Architect"
											name="jobTitle"
											id="jobTitle"
											type="text"
											value={data.jobTitle}
											required
										/>
										<label placeholder="Job Title"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<button
											className="margin-top-30 width-100p button-height display-block sc-button sc-button-accent sc-button-color">
											Save Profile and Continue
										</button>
									</div>
								</div>
							</form>
						</div>
					);
				} else {
					return (
						<div id="profile">
							<div>
								<h2 className="title">
									Basic Information
								</h2>
							</div>
							<form name="profile" className="basic-information margin-side-auto" onSubmit={this.onSubmit}>
								<div>
									<div className="margin-top-10 clear">
										<label className="required-fields control-label">
											* <em>Required Fields</em>
										</label>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="name">
											Name
											<span>*</span>
										</label>
										<Input
											id="name"
											name="name"
											className="control-input"
											type="text"
											placeholder="Marilyn Dansoa Ocran"
											onChange={this.onFieldChange}
											value={data.name}
											required
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="dob">
											Date of Birth
											<span>*</span>
										</label>
										<Input
											id="dob"
											placeholder="25th April, 1987"
											name="dob"
											className="control-input"
											type="text"
											onChange={this.onFieldChange}
											value={data.dob}
											required
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="address">
											Address
										</label>
										<Input
											id="address"
											name="address"
											placeholder="P.O.Box 42 ..."
											className="control-input margin-bottom-5"
											type="text"
											onChange={this.onFieldChange}
											value={data.address}
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="email">
											Email
											<span>*</span>
										</label>
										<Input
											id="email"
											name="email"
											placeholder="marilynocran@yahoo.com"
											className="control-input"
											type="text"
											onChange={this.onFieldChange}
											value={data.email}
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="phone">
											Telephone
											<span>*</span>
										</label>
										<Input
											id="phone"
											name="phone"
											className="control-input"
											placeholder="+233 246 408 505"
											type="text"
											onChange={this.onFieldChange}
											value={data.phone}
											required
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="phone">
											Town/City
											<span>*</span>
										</label>
										<Input
											id="location"
											name="location"
											className="control-input"
											placeholder="Accra"
											type="text"
											onChange={this.onFieldChange}
											value={data.location}
											required
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="full-name">
											Personal Statement
											<span>*</span>
										</label>
										<TextArea
											maxLength="4000"
											name="personalStatement"
											id="personalStatement"
											rows="5"
											placeholder="I am recent graduate seeking an exciting role in the Banking sector..."
											className="control-input"
											onChange={this.onFieldChange}
											value={data.personalStatement}
											required
										/>
									</div>

									<div className="margin-top-10 clear">
										<label className="required-fields control-label">
											* <em>Job Details</em>
										</label>
									</div>

									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="jobTitle">
											Job Title
											<span>*</span>
										</label>
										<Input
											id="jobTitle"
											name="jobTitle"
											className="control-input"
											placeholder="Architect"
											type="text"
											onChange={this.onFieldChange}
											value={data.jobTitle}
											required
										/>
									</div>

								</div>
								<button className="display-block width-350 margin-top-40 sc-button sc-button-accent sc-button-color">
									Save Profile and Continue
								</button>
							</form>
						</div>
					);
				}
			})()
		);
	}
}

export default React.createFactory(Profile);