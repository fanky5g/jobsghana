import React, { PureComponent } from 'react';
import { Upload, message, Button, Icon, Radio, Checkbox } from 'antd';
import { saveResume } from '#app/routes/resume/actions';

const RadioGroup = Radio.Group;

class FilesAndOptions extends PureComponent {
	state = {
		resumeLoading: false,
		clLoading: false,
	};

	onFieldChange = (evt) => {
		const { onEdit } = this.props;
		onEdit('meta', evt.target.name, evt.target.value);
	};

	onSubmit = (evt) => {
  		evt.preventDefault();
  		const { resume, dispatch, user } = this.props;
  		dispatch(saveResume(user.ID, resume));
  	};

  	onCheckChange = (evt) => {
		const { onEdit } = this.props;
		onEdit('meta', evt.target.name, !evt.target.value);
	};

	resumeProps = {
	    name: 'resume',
	    accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	    showUploadList: false,
	    beforeUpload: () => {
	    	this.setState({
	    		resumeLoading: true,
	    	});
	    },
	    action: `/api/v1/accounts/addAttachment?type=resume&uid=${this.props.user.ID}`,
	    onChange: (info) => {
	      const { dispatch } = this.props;
	      const status = info.file.status;
	      if (status === 'done') {
	        this.setState({
	        	resumeLoading: false,
	        });
	        this.props.onEdit('meta', 'attached_cv', info.file.response.resume);
	      }
	    },
	};

	coverLetterProps = {
	    name: 'cover-letter',
	    accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	    showUploadList: false,
	    beforeUpload: () => {
	    	this.setState({
	    		clLoading: true,
	    	});
	    },
	    action: `/api/v1/accounts/addAttachment?type=cover_letter&uid=${this.props.user.ID}`,
	    onChange: (info) => {
	      const { dispatch } = this.props;
	      const status = info.file.status;

	      if (status === 'done') {
	        this.setState({
	        	clLoading: false,
	        });

	        this.props.onEdit('meta', 'attached_cl', info.file.response["cover-letter"]);
	      }
	    },
	};

	previewResume = (evt) => {
		if(evt) evt.preventDefault();
		this.props.preview();
	};

	render() {
		const { addField, field, isMobile } = this.props;
		const { clLoading, resumeLoading } = this.state;
		let data = this.props.resume['meta'];

		return (
			(() => {
				if (isMobile) {
					return (
						<div>
							<div className="ui-row margin-bottom-20 margin-top-20">
								<div className="col-24">
									<h2>Complete Your Profile</h2>
								</div>
							</div>
							<form name="filesandoptions" onSubmit={this.onSubmit}>
								<div className="ui-row">
									<div className="col-24 clearfix">
										<label className="required-fields right">
											Attach Files
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Upload {...this.resumeProps}>
										    <Button className="width-100p padding-10 height-auto" icon={data.attached_cv == '' ? "upload": ''} loading={resumeLoading}>
										    	{
										    		data.attached_cv !== '' &&
										    		'Resume Attached'
										    	}
										    	{
										    		data.attached_cv == "" &&
										    		'Attach Resume'
										    	}
										    </Button>
										</Upload>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<Upload {...this.coverLetterProps} className="width-100p">
										    <Button className="width-100p padding-10 height-auto" icon={data.attached_cl == '' ? "upload": ''} loading={clLoading}>
										    	{
										    		data.attached_cl !== '' &&
										    		'Cover Letter Attached'
										    	}
										    	{
										    		data.attached_cl == "" &&
										    		'Attach Cover Letter'
										    	}
										    </Button>
										</Upload>
									</div>
								</div>
								<div className="ui-row">
									<div className="col-24 clearfix">
										<label className="required-fields right">
											Make my Resume
										</label>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<RadioGroup className="margin-left-10" name="public" onChange={this.onFieldChange} value={data.public}>
									        <Radio className="display-block padding-10" value={false}>private</Radio>
									        <Radio className="display-block padding-10" value={true}>public</Radio>
									    </RadioGroup>
									</div>
								</div>
								<div className="ui-row margin-top-10 margin-bottom-40">
									<div className="col-24">
										<Checkbox name="signMeUpForUpdates" className="control-input margin-left-10" onChange={this.onCheckChange} value={data.signMeUpForUpdates}>
											Sign me up for mail updates
										</Checkbox>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<button
											onClick={this.previewResume}
											className="margin-top-30 width-100p button-height display-block sc-button">
											Preview Resume
										</button>
									</div>
								</div>
								<div className="ui-row margin-bottom-20">
									<div className="col-24">
										<button
											type="submit"
											className="margin-top-30 width-100p button-height display-block sc-button sc-button-accent sc-button-color">
											Save my Resume
										</button>
									</div>
								</div>
							</form>
						</div>
					);
				} else {
					return (
						<div className="options">
							<div>
								<h2 className="title">
									Complete Your Profile
								</h2>
							</div>
							<form className="basic-information awards margin-side-auto" name="filesandoptions" onSubmit={this.onSubmit}>
								<div className="margin-top-10 clear">
									<label className="control-label" htmlFor="full-name">
										Attach Files
									</label>
									<Upload {...this.resumeProps} className="control-input">
									    <Button icon={data.attached_cv == '' ? "upload": ''} loading={resumeLoading}>
									    	{
									    		data.attached_cv !== '' &&
									    		'Resume Attached'
									    	}
									    	{
									    		data.attached_cv == "" &&
									    		'Attach Resume'
									    	}
									    </Button>
									</Upload>
									<Upload {...this.coverLetterProps} className="control-input">
									    <Button icon={data.attached_cl == '' ? "upload": ''} loading={clLoading}>
									    	{
									    		data.attached_cl !== '' &&
									    		'Cover Letter Attached'
									    	}
									    	{
									    		data.attached_cl == "" &&
									    		'Attach Cover Letter'
									    	}
									    </Button>
									</Upload>
								</div>
								<div className="margin-top-10 clear">
									<label className="control-label">Make my Resume</label>
									<RadioGroup className="margin-left-10" name="public" onChange={this.onFieldChange} value={data.public}>
								        <Radio value={false}>private</Radio>
								        <Radio value={true}>public</Radio>
								    </RadioGroup>
								</div>
								<div className="margin-top-10 clear">
									<label className="control-label">Sign me up for mail updates</label>
									<Checkbox name="signMeUpForUpdates" className="control-input" onChange={this.onCheckChange} value={data.signMeUpForUpdates} />
								</div>
								<div className="margin-top-10 clear">
									<Button onClick={() => {}} className="display-block move-right margin-bottom-40">View Resume</Button>
								</div>
								<button className="display-block width-350 margin-top-20 sc-button sc-button-accent sc-button-color">
									Save my Resume
								</button>
							</form>
						</div>
					);
				}
			})()
		);
	}
}

export default FilesAndOptions;