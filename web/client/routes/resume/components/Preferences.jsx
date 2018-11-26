import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Col} from 'antd';
import { saveResume } from '#app/routes/resume/actions';
import Input from '#app/common/components/Input';

class Preferences extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit } = this.props;
		onEdit('preferences', evt.target.name, evt.target.value);
	};

  	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

	render() {
		const { resume, removeSubField, addField, onEdit, isMobile } = this.props;
		const data = this.props.resume['preferences'];

		return (
			(() => {
				if(isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Preferences</h2>
								</div>
							</div>
							<form name="preferences" onSubmit={this.onSubmit}>
								<div className="ui-row">
									<div className="col-24 clearfix">
										<label className="required-fields right">
											* <em>Required</em>
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<select required id="jobSector" name="jobSector" value={data.jobSector} onChange={this.onFieldChange}>
											<option selected value="banking">Banking</option>
							                <option value="construction">Construction</option>
							                <option value="catering">Catering</option>
							                <option value="technology">Technology</option>
							                <option value="manufacturing">Manufacturing</option>
							                <option value="media">Media</option>
							                <option value="other">Other</option>
										</select>
										<label placeholder="Job Sector*"></label>
									</div>
								</div>
								{
									data.jobSector == "other" &&
									<div className="ui-row margin-bottom-20">
										<div className="col-24">
											<Input
												onChange={this.onFieldChange}
												placeholder="enter job sector"
												name="jobSectorAlt"
												id="jobSectorAlt"
												type="text"
												value={data.jobSectorAlt}
												required
											/>
											<label placeholder="Specify Job Sector"></label>
										</div>
									</div>
								}
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<select required id="level" name="level" value={data.level} onChange={this.onFieldChange}>
											<option selected value="entry">Entry</option>
							                <option value="intermediate">Intermediate</option>
							                <option value="senior">Senior</option>
										</select>
										<label placeholder="Level*"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<select
											required
											id="salaryExpectation"
											name="salaryExpectation"
											value={data.salaryExpectation}
											onChange={this.onFieldChange}
											className="control-select">
											<option selected value="0-1000">GHC0-GHC1000</option>
							                <option selected value="1000-2000">GHC1000-GHC2000</option>
							                <option value="2000-3000">GHC2000-GHC3000</option>
							                <option value="3000-*">GHC3000 or Above</option>
										</select>
										<label placeholder="Salary Expectation*"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<select required id="location" name="location" onChange={this.onFieldChange} value={data.location} className="control-select">
											<option value="greater accra">Greater Accra</option>
							                <option value="eastern region">Eastern Region</option>
							                <option value="central region">Central Region</option>
							                <option value="Ashanti region">Ashanti Region</option>
							                <option value="western region">Western Region</option>
							                <option value="brong ahafo">Brong Ahafo Region</option>
							                <option value="upper east region">Upper East Region</option>
							                <option value="upper west region">Upper West Region</option>
							                <option value="volta region">Volta Region</option>
							                <option value="northern region">Northern Region</option>
										</select>
										<label placeholder="Location*"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<select required id="jobType" name="jobType" onChange={this.onFieldChange} value={data.jobType} className="control-select">
											<option value="full-time">Full Time</option>
							                <option value="permanent">Permanent</option>
							                <option value="temporary">Temporary</option>
							                <option value="contract">Contract</option>
							                <option value="internship">Internship</option>
										</select>
										<label placeholder="Job Type*"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<button
											className="margin-top-30 width-100p button-height display-block sc-button sc-button-accent sc-button-color">
											Save and Continue
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
									Preferences
								</h2>
							</div>
							<form name="preferences" className="basic-information personal-statement margin-side-auto" onSubmit={this.onSubmit}>
								<div>
									<div className="margin-top-10 clear">
										<label className="required-fields control-label">
											* <em>Required Fields</em>
										</label>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label">Job Sector*</label>
										<select required id="jobSector" name="jobSector" className="control-select" value={data.jobSector} onChange={this.onFieldChange}>
											<option selected value="banking">Banking</option>
							                <option value="construction">Construction</option>
							                <option value="catering">Catering</option>
							                <option value="technology">Technology</option>
							                <option value="manufacturing">Manufacturing</option>
							                <option value="media">Media</option>
							                <option value="other">Other</option>
										</select>
									</div>
									{
										data.jobSector == "other" &&
										<div className="margin-top-10 clear">
											<label className="control-label">Specify Job Sector</label>
											<Input
												onChange={this.onFieldChange}
												name="jobSectorAlt"
												id="jobSectorAlt"
												placeholder="job sector"
												className="control-input"
												type="text"
												value={data.jobSectorAlt}
												required
											/>
										</div>
									}
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="dob">
											Level
											<span>*</span>
										</label>
										<select id="level" name="level" value={data.level} onChange={this.onFieldChange} className="control-select">
											<option value="entry">Entry</option>
							                <option value="intermediate">Intermediate</option>
							                <option value="senior">Senior</option>
										</select>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="dob">
											Salary Expectation
											<span>*</span>
										</label>
										<select
											id="salaryExpectation"
											name="salaryExpectation"
											value={data.salaryExpectation}
											onChange={this.onFieldChange}
											className="control-select">
											<option value="0-1000">GHC0-GHC1000</option>
							                <option value="1000-2000">GHC1000-GHC2000</option>
							                <option value="2000-3000">GHC2000-GHC3000</option>
							                <option value="3000-*">GHC3000 or Above</option>
										</select>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="email">
											Location
											<span>*</span>
										</label>
										<select id="location" name="location" onChange={this.onFieldChange} value={data.location} className="control-select">
											<option value="greater accra">Greater Accra</option>
							                <option value="eastern region">Eastern Region</option>
							                <option value="central region">Central Region</option>
							                <option value="Ashanti region">Ashanti Region</option>
							                <option value="western region">Western Region</option>
							                <option value="brong ahafo">Brong Ahafo Region</option>
							                <option value="upper east region">Upper East Region</option>
							                <option value="upper west region">Upper West Region</option>
							                <option value="volta region">Volta Region</option>
							                <option value="northern region">Northern Region</option>
										</select>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="email">
											Job Type
											<span>*</span>
										</label>
										<select id="jobType" name="jobType" onChange={this.onFieldChange} value={data.jobType} className="control-select">
											<option value="full-time">Full Time</option>
							                <option value="permanent">Permanent</option>
							                <option value="temporary">Temporary</option>
							                <option value="contract">Contract</option>
							                <option value="internship">Internship</option>
										</select>
									</div>
								</div>
								<button className="display-block width-350 margin-top-40 sc-button sc-button-accent sc-button-color">
									Save and Continue
								</button>
							</form>
						</div>
					);
				}
			})()
		);
	}
}

export default React.createFactory(Preferences);