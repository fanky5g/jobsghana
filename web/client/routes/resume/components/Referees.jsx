import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Col} from 'antd';
import { saveResume } from '#app/routes/resume/actions';
import Input from '#app/common/components/Input';

class Referees extends PureComponent {
	onFieldChange = (evt) => {
		const { onEdit } = this.props;
		onEdit('referees', evt.target.name, evt.target.value);
	};

  	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

	render() {
		const { resume, removeSubField, addField, onEdit, isMobile } = this.props;
		const data = this.props.resume['referees'];

		return (
			(() => {
				if(isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Referees</h2>
								</div>
							</div>
							<form name="referees" onSubmit={this.onSubmit}>
								<div className="ui-row">
									<div className="col-24 clearfix">
										<label className="required-fields right">
											* <em>Required</em>
										</label>
									</div>
								</div>
								<div className="ui-row">
									<div className="col-24">
										<label className="required-fields">
											Academic*
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="Mrs Ellen Jonah"
											name="academic.name"
											id="academic.name"
											type="text"
											value={data.academic.name}
											required
										/>
										<label placeholder="Name*"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="Senior Manager"
											name="academic.position"
											id="academic.position"
											type="text"
											value={data.academic.position}
											required
										/>
										<label placeholder="Position"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											name="academic.institution"
											placeholder="Webster University, Ghana"
											id="academic.name"
											type="text"
											value={data.academic.institution}
											required
										/>
										<label placeholder="Institution*"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											name="academic.telephone"
											placeholder="+233 2000000"
											id="academic.telephone"
											type="text"
											value={data.academic.telephone}
											required
										/>
										<label placeholder="Telephone*"></label>
									</div>
								</div>
								<div className="ui-row">
									<div className="col-24">
										<label className="required-fields">
											Employment
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											name="employment.name"
											placeholder="Mrs Ellen Jonah"
											id="employment.name"
											type="text"
											value={data.employment.name}
											required
										/>
										<label placeholder="Name"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											name="employment.company"
											placeholder="Databank"
											id="employment.company"
											type="text"
											value={data.employment.company}
											required
										/>
										<label placeholder="Company"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											name="employment.telephone"
											placeholder="233 2000000"
											id="employment.telephone"
											type="text"
											value={data.employment.telephone}
											required
										/>
										<label placeholder="Telephone"></label>
									</div>
								</div>
								<div className="ui-row">
									<div className="col-24">
										<label className="required-fields">
											Character
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											placeholder="Mrs Ellen Jonah"
											name="character.name"
											id="character.name"
											type="text"
											value={data.character.name}
											required
										/>
										<label placeholder="Name"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											name="character.position"
											id="character.position"
											placeholder="Pastor"
											type="text"
											value={data.character.position}
											required
										/>
										<label placeholder="Position"></label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Input
											onChange={this.onFieldChange}
											name="character.telephone"
											placeholder="+233 2000000"
											id="character.telephone"
											type="text"
											value={data.character.telephone}
											required
										/>
										<label placeholder="Telephone"></label>
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
						<div id="referees">
							<div>
								<h2 className="title">
									Referees
								</h2>
							</div>
							<form className="basic-information references margin-side-auto" name="referees" onSubmit={this.onSubmit}>
								<div>
									<div className="margin-top-10 clear">
										<label className="required-fields control-label">
											* <em>Required Fields</em>
										</label>
									</div>
									<div className="margin-top-10 clearfix">
										<label className="control-label" htmlFor="address">
											Academic
											<span>*</span>
										</label>
										<Input
											id="name"
											name="academic.name"
											placeholder="Mrs Ellen Jonah"
											className="control-input margin-bottom-5"
											type="text"
											value={data.academic.name}
											onChange={this.onFieldChange}
											required
										/>
										<Input
											id="position"
											name="academic.position"
											placeholder="Head of Department"
											className="move-right control-input margin-bottom-5"
											type="text"
											value={data.academic.position}
											onChange={this.onFieldChange}
										/>
										<Input
											id="institution"
											name="academic.institution"
											placeholder="Webster University, Ghana"
											className="move-right control-input margin-bottom-5"
											type="text"
											value={data.academic.institution}
											onChange={this.onFieldChange}
											required
										/>
										<Input
											id="telephone"
											name="academic.telephone"
											placeholder="+233 2000000"
											className="move-right control-input"
											type="text"
											onChange={this.onFieldChange}
											required
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="address">
											Employment
										</label>
										<Input
											id="name"
											name="employment.name"
											placeholder="Mrs Ellen Jonah"
											className="control-input margin-bottom-5"
											type="text"
											value={data.employment.name}
											onChange={this.onFieldChange}
										/>
										<Input
											id="position"
											name="employment.position"
											placeholder="Senior Manager"
											className="move-right control-input margin-bottom-5"
											type="text"
											value={data.employment.position}
											onChange={this.onFieldChange}
										/>
										<Input
											id="company"
											name="employment.company"
											placeholder="Databank"
											className="move-right control-input margin-bottom-5"
											type="text"
											value={data.employment.company}
											onChange={this.onFieldChange}
										/>
										<Input
											id="telephone"
											name="employment.telephone"
											placeholder="+233 2000000"
											className="move-right control-input"
											type="text"
											value={data.employment.telephone}
											onChange={this.onFieldChange}
										/>
									</div>
									<div className="margin-top-10 clear">
										<label className="control-label" htmlFor="address">
											Character
										</label>
										<Input
											id="name"
											name="character.name"
											placeholder="Mrs Ellen Jonah"
											className="control-input margin-bottom-5"
											type="text"
											value={data.character.name}
											onChange={this.onFieldChange}
										/>
										<Input
											id="position"
											name="character.position"
											placeholder="Pastor"
											className="move-right control-input margin-bottom-5"
											type="text"
											value={data.character.position}
											onChange={this.onFieldChange}
										/>
										<Input
											id="telephone"
											name="character.telephone"
											placeholder="+233 2000000"
											className="move-right control-input margin-bottom-5"
											type="text"
											value={data.character.telephone}
											onChange={this.onFieldChange}
										/>
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

export default React.createFactory(Referees);