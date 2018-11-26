import React, { PureComponent } from 'react';
import { Input, Button } from 'antd';
import { Spinner } from 'react-mdl';
import { connect } from 'react-redux';
import { subscribeToJobAlerts } from '../actions';
import { clearPopupMessage } from '#app/common/actions/Popup';

class JobAlert extends PureComponent {
	state = {
		email: '',
	};

	componentWillReceiveProps(nextProps){
		if (nextProps.actionComplete && nextProps.message !== '') {
			setTimeout(nextProps.dispatch(clearPopupMessage), 6000);
		}
	}

	fieldChanged = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value,
		});
	};

	onSubmit = (evt) => {
		evt.preventDefault();
		const { dispatch } = this.props;
		dispatch(subscribeToJobAlerts(this.state));
	};

	render() {
		const { processing, actionComplete, message } = this.props;

		return (
			<div>
				<fieldset>
                  <label htmlFor="EmailAddress">Get new jobs matching your frequent searches by email</label>
                </fieldset>
                <form name="job-alert" onSubmit={this.onSubmit}>
                  <div className="wr">
                    <div className="grid__col--8">
                      <Input id="EmailAddress" type="email" onChange={this.fieldChanged} value={this.state.email} name="email" placeholder="Your email" />
                    </div>
                    <div className="grid__col--4 ac">
                      <Button className="send" size="large" htmlType="submit">
                      	{
                      		!processing &&
                      		'Email jobs'
                      	}
                      	{
                      		processing &&
                      		<Spinner singleColor />
                      	}
                      </Button>
                    </div>
                   <div>
                   	<div className="grid__col--8">
                   	{
                   			actionComplete && message !== '' &&
                   			<div style={{textAlign: "left", marginTop: "16px", display: "inline-block", padding: "0 20px"}}>
                				<label style={{fontSize: "13px",fontWeight: 400}}>{message}</label>
                	  		</div>
                   	}
                    </div>
                    <div className="grid__col--4"></div>
                    </div>
                  </div>
                </form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	processing: state.Popup.get('processing'),
	actionComplete: state.Popup.get('actionComplete'),
	message: state.Popup.get('message'),
});

export default connect(mapStateToProps)(JobAlert);