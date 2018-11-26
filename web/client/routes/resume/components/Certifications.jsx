import React, { PureComponent } from 'react';
import { Button } from 'antd';
import ListInput from '#app/common/components/ListInput';
import { saveResume } from '#app/routes/resume/actions';

class Certifications extends PureComponent {
	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

	render() {
		const { field, isMobile } = this.props;
		let data = this.props.resume['certifications'];

		return (
			(() => {
				if(isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Certifications</h2>
								</div>
							</div>
							<form name="certifications" onSubmit={this.onSubmit}>
								<div className="ui-row margin-bottom-40">
									<div className="col-24">
										<ListInput
						               	 field="certification"
						               	 keyName={undefined}
						               	 index={-1}
						               	 onEdit={this.props.onEdit}
						               	 data={data}
						               	 placeholder="ACCA, ACAMS..."
						               	 single="certification"
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
						<div className="certifications">
							<div>
								<h2 className="title">
									Professional Certifications/Licenses
								</h2>
							</div>
							<form className="basic-information certification margin-side-auto" name="certifications" onSubmit={this.onSubmit}>
								<div className="margin-top-10 clear">
									<ListInput
					               	 field="certification"
					               	 keyName={undefined}
					               	 index={-1}
					               	 onEdit={this.props.onEdit}
					               	 data={data}
					               	 placeholder="ACCA, ACAMS..."
					               	 single="certification"
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

export default Certifications;