import React, { PureComponent } from 'react';
import WorkSingle from './WorkSingle';
import { Button } from 'antd';
import School from './School';
import SchoolM from './SchoolM';
import { saveResume } from '#app/routes/resume/actions';

class Education extends PureComponent {
	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

	render() {
		const { addField, field, isMobile } = this.props;
		let data = this.props.resume['education'];

		return (
			(() => {
				if (isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Education</h2>
								</div>
							</div>
							<form name="education" onSubmit={this.onSubmit}>
								<div className="ui-row">
									<div className="col-24 clearfix">
										<label className="required-fields right">
											* <em>Required</em>
										</label>
									</div>
								</div>
								{
									Array.isArray(data) &&
									data.map((entry, index) => (
								        <SchoolM isMobile entry={entry} index={index} key={index} {...this.props} total={data.length}/>
									))
								}
								<div className="ui-row margin-bottom-40">
									<div className="col-24 clearfix">
										<Button className="right" icon="add" onClick={() => addField('education')}>
							           		Add School
							           	</Button>
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
						<div className="education">
							<div>
								<h2 className="title">
									Education
								</h2>
							</div>
							<form className="basic-information education margin-side-auto" name="education" onSubmit={this.onSubmit}>
								<div>
									<div className="margin-top-10 clear">
										<label className="required-fields control-label">
											* <em>Required Fields</em>
										</label>
									</div>
									{
										Array.isArray(data) &&
										data.map((entry, index) => (
									        <School entry={entry} index={index} key={index} {...this.props} total={data.length}/>
										))
									}
									<div className="margin-top-10 clearfix">
							           	<Button className="move-right" icon="add" onClick={() => addField('education')}>
							           		Add School
							           	</Button>
									</div>
								</div>
								<button className="display-block width-350 margin-top-20 sc-button sc-button-accent sc-button-color">
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

export default Education;