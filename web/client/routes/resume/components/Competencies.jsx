import React, { PureComponent } from 'react';
import { Button } from 'antd';
import ListInput from '#app/common/components/ListInput';
import { saveResume } from '#app/routes/resume/actions';

class Competencies extends PureComponent {
	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

	render() {
		const { field, isMobile } = this.props;
		let data = this.props.resume['competencies'];

		const placeholders = ['Attention to Detail', 'Critical Thinking', 'Teamwork', 'Leadership', 'Organizational Skills'];

		return (
			(() => {
				if (isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Competencies</h2>
								</div>
							</div>
							<form name="competencies" onSubmit={this.onSubmit}>
								<div className="ui-row margin-bottom-40">
									<div className="col-24">
										<ListInput
						               	 field="competency"
						               	 keyName={undefined}
						               	 index={-1}
						               	 onEdit={this.props.onEdit}
						               	 data={data}
						               	 placeholder={placeholders}
						               	 single="competency"
						               	 isMobile
							            />
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
						<div className="competencies">
							<div>
								<h2 className="title">
									Competencies
								</h2>
							</div>
							<form name="competencies" className="basic-information competency margin-side-auto" onSubmit={this.onSubmit}>
								<div className="margin-top-10 clear">
									<ListInput
					               	 field="competency"
					               	 keyName={undefined}
					               	 index={-1}
					               	 onEdit={this.props.onEdit}
					               	 data={data}
					               	 placeholder={placeholders}
					               	 single="competency"
					               	/>
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

export default Competencies;