import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import Helmet from 'react-helmet';
import Footer from '#app/common/components/MiniFooter';
import Link from 'react-router/lib/Link';


class RegisterSuccess extends PureComponent {
	state = {
		email: 'email@host.com',
	};

	componentDidMount() {
		const { location: {state} } = this.props;
		if (state && state.email) {
			this.setState({email: state.email});
		}
	}

	render() {
		const { email } = this.state;
		const { isMobile } = this.props;

		return (
			<div className="Content join_success">
				<div className="wrapper">
					<div className="grid margin-top-40 text-align-center">
						<Helmet
				            title='Welcome'
				            meta={[
				              {
				                property: 'og:title',
				                content: 'Welcome Aboard'
				              }
				            ]}
				        />
						<Card>
							<span className="act">
								Your Resume has been saved. An email was sent to your mail {email} with instructions on how to activate
								&nbsp;<Link to="/me">Your Account</Link>.
							</span>
							<br />
							<span className="display-inline-block margin-top-10 act">
								Didn't receive mail?&nbsp;&nbsp;
								<Button onClick={() => {}}>Request Activation Email</Button>
							</span>
						</Card>
						<div className="padding-top-40"></div>
						<Footer isMobile={isMobile}/>
					</div>
				</div>
			</div>
		);
	}
}

export default RegisterSuccess;