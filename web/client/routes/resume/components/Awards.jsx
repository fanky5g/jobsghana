import React, { PureComponent } from 'react';
import { Button } from 'antd';
import Award from './Award';
import { saveResume } from '#app/routes/resume/actions';
import AwardM from './AwardM';

class Awards extends PureComponent {
	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

	render() {
		const { addField, field, isMobile } = this.props;
		let data = this.props.resume['awards'];

		return (
			(() => {
				if (isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Awards/Accomplishments</h2>
								</div>
							</div>
							<form name="awards" onSubmit={this.onSubmit}>
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
								        <AwardM entry={entry} index={index} key={index} {...this.props} total={data.length}/>
									))
								}
								<div className="ui-row margin-bottom-40">
									<div className="col-24 clearfix">
										<Button className="right" icon="add" onClick={() => addField('awards')}>
							           		Add Award
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
						<div className="awards">
							<div>
								<h2 className="title">
									Awards/Accomplishments
								</h2>
							</div>
							<form className="basic-information awards margin-side-auto" name="awards" onSubmit={this.onSubmit}>
								<div>
									{
										Array.isArray(data) &&
										data.map((entry, index) => (
									        <Award entry={entry} index={index} key={index} {...this.props} total={data.length}/>
										))
									}
									<div className="margin-top-10 clear">
							           	<Button className="move-right" icon="add" onClick={() => addField('awards')}>
							           		Add Award
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

export default Awards;