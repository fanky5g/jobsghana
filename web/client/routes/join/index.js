import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import steps from './steps';
import Multistep from '#app/common/components/Multistep';
import { connect } from 'react-redux';
import { Layout, Col } from 'antd';
const { Footer } = Layout;
import { cleanResume } from '#app/util/resume';
import { addUser, resetRegistration } from './actions';

class Join extends PureComponent {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props, context) {
		super(props, context);
		const { location: { state }} = this.props;
		let resumeAttached = false;
		if (state && state.resume) {
			resumeAttached = true;
		}

		this.state = {
			resumeAttached,
			signMeUpForUpdates: false,
			resume: {},
			password: '',
			allowEmployersResumeView: false,
		};
	}

	componentWillMount() {
		const { Account, location } = this.props;
		const { state } = location;

		if (state && typeof state.resume != "undefined") {
			this.setState({
				resume: cleanResume(state.resume),
			});
		} else {
			if (location.pathname === '/resume') {
				this.context.router.replace('/join');
			}
		}

		if(Account.get('isAuthenticated')) {
			this.context.router.replace('/me');
		}
	}

	componentWillReceiveProps(nextProps) {
		const { Account, goToUrl, dispatch } = nextProps;
		const registrationDone = Account.get('registerSuccess');
		if (registrationDone) {
			dispatch(resetRegistration());
			goToUrl('welcome', {}, { email: this.state.resume.basics.email });
		}
	}

	saveData = (fields, callback, evt) => {
		evt.preventDefault();
		if (fields !== null && typeof fields !== 'undefined') {
			this.setState(fields, function() {
				callback();
			});
		} else {
			callback();
		}
	};

	onSignup = (finishForm) => {
		finishForm();
		delete this.state.passMatchError;
		const { dispatch } = this.props;
		let userData = {
			resume: this.state.resume,
			email: this.state.resume.basics.email,
			password: this.state.password,
		};

		let meta = {
			signMeUpForUpdates: this.state.signMeUpForUpdates,
			allowEmployersResumeView: this.state.allowEmployersResumeView,
		};

		if (this.state.resumeAttached) {
			meta.key = this.props.savedLocation;
		}

		userData.meta = meta;
		dispatch(addUser(userData));
	};

	render() {
		const { Account } = this.props;

		return (
			<div className="Content Signup">
				<Col span={8} xs={20} sm={12} md={12} lg={10} xl={8} className="Signup__container mdl-shadow--2dp">
					<div className="Signup__container--header">
						<h4>Complete your profile</h4>
					</div>
					<div className="Signup__container--body">
						<Multistep steps={steps} onCallbackParent={this.saveData} fieldValues={this.state} onSignup={this.onSignup} isWaiting={Account.get('actionWaiting')} />
					</div>
				</Col>
		  	</div>
		);
	}
}

export default connect(state => ({ Account: state.Account, savedLocation: state.Resume.get('key') }))(Join);