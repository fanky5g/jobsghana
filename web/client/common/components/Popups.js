import React from 'react';
import { Button, Spinner } from 'react-mdl';
import { Input } from 'antd';
import ResumeAlert from '#app/routes/ResumeAlerts/components/ResumeAlertComponent';
import { subscibeReviewAlert, subscribeResumeAlert } from '#app/common/actions/Popup';

// function shuffle(o) {
//     for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//     return o;
// };

// const randArray = [1,2,3,4,5];
// const randNumbers = shuffle(randArray);

const ActionFooter = ({title, onClick, close, goToUrl}) => (
	<Button
		accent
		raised
		onClick={() => onClick(goToUrl, close)}>
	{title}
	</Button>
);

class ReviewAlert extends React.PureComponent {
	state = {
		email: '',
	};

	fieldChanged = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value,
		});
	};

    componentWillReceiveProps(nextProps) {
        if (nextProps.actionComplete && nextProps.message != '') {
            // pin popup for automatic closure
            setTimeout(this.props.close, 5000);
        }
    }

	onSubmit = (evt) => {
		const { type, action, requiresAction, dispatch } = this.props;
		evt.preventDefault();
		if (type == 'modal') {
            if (requiresAction) {
                action(dispatch, this.state);
            }
		}
	};

	render() {
        const { processing, message, requiresAction, actionComplete } = this.props;

		return (
			<div className="Form">
	        	<form className="Form__container--step" name="review-alert" onSubmit={this.onSubmit}>
                    <div className="Form__container--fieldrow">
                        <label
                            style={{padding: "0 20px"}}
                            className="title">
                            Do you want to receive alerts when Recruiters review your CV?
                        </label>
                    </div>
		          <div className="Form__container--fieldrow">
		            <label>Share your Email:</label>
		          </div>
		          <div className="Form__container--fieldrow">
		            <Input
		                onChange={this.fieldChanged}
		                name="email"
		                value={this.state.email}
		                required
		            />
		          </div>
                  {
                    (() => {
                        if (requiresAction && !actionComplete && message == '') {
                            return (
                                <div className="Form__container--fieldrow actions single">
                                    <Button
                                        type="submit"
                                        accent
                                        raised>
                                        {
                                            requiresAction && processing &&
                                            <Spinner singleColor />
                                        }
                                        {
                                            !processing &&
                                            "Submit"
                                        }
                                    </Button>
                                </div>
                            );
                        } else if (requiresAction && actionComplete && message == 'SEND_TO_BUILD_RESUME') {
                            return (
                                <div className="Form__container--fieldrow actions single">
                                    <Button
                                        type="submit"
                                        accent
                                        raised
                                        onClick={() => this.props.goToUrl('/resume')}>
                                        Upload Resume
                                    </Button>
                                </div>
                            );
                        }
                    })()
                  }
                  {
                    (() => {
                    if (requiresAction && !processing && actionComplete && message !== '' && message !== 'SEND_TO_BUILD_RESUME') {
                        return (
                            <div style={{textAlign: "center", marginTop: "16pt"}}>
                                <span>{message}</span>
                            </div>
                        );
                    }
                    })()  
                  }
	          </form>
	        </div>
		);
	}
}

const CareerAdviceContent = () => (
	<div>
    	<span>Our Career Advice written by experts contains articles with helpful tips</span>
    </div>
);

const Recruiters = () => (
	<div>
    	<span>Search over 100,000 resumes on the Talents Community for FREE</span>
    </div>
);

const JobSeekers = () => (
	<div>Upload your resume to be headhunted by top Companies in Africa</div>
);

export const popups = [
    {
        header: 'Looking for a new Job?',
        content: <JobSeekers />,
        footer: <ActionFooter title="Register Now" onClick={(goToUrl, onAbort) => {
        	onAbort();
        	setTimeout(goToUrl('/resume'), 500);
        }}  />,
        onActive: () => {
            // console.log('onActive called for component 1');
        },
        onInactive: () => {},
        timeout: 10000 * 4,
        requiresAction: false,
    },
    {
        content: <ResumeAlert type="modal" />,
        onActive: () => {
            // console.log('onActive called for component 2');
        },
        onInactive: () => {
            // console.log('onInactive called for component 2');
        },
        timeout: 20000 * 5,
        requiresAction: true,
        action: (dispatch, state) => {
            dispatch(subscribeResumeAlert(state));
        },
    },
    {
        header: 'Register your Resume for Review Alerts',
        content: <ReviewAlert type="modal" />,
        onActive: () => {},
        onInactive: () => {},
        timeout: 30000 * 6,
        requiresAction: true,
        action: (dispatch, state) => {
            dispatch(subscibeReviewAlert(state));
        },
    },
    {
        header: 'Are your recruiting?',
        content: <Recruiters />,
        footer: <ActionFooter title="Show me" onClick={(goToUrl, onAbort) => {
        	onAbort();
        	goToUrl('/find-resume');
        }}  />,
        onActive: () => {},
        onInactive: () => {},
        timeout: 40000*7,
        requiresAction: false,
    },
    {
        header: 'Are You Seeking a Job?',
        content: <CareerAdviceContent />,
        footer: <ActionFooter title="Read More" onClick={(goToUrl, onAbort) => {
        	onAbort();
        	goToUrl('/career-advice');
        }}  />,
        onActive: () => {},
        onInactive: () => {},
        timeout: 50000 * 8,
        requiresAction: false,
    },
];