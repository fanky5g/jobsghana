import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { initResume, addSubField, removeFieldAt, editFieldAt, setStep } from './actions';
import { Button, Checkbox, Collapse, Row, Col, Layout, Modal, Upload } from 'antd';
import { Spinner } from 'react-mdl';
import { keys } from './reducer';
import { cleanResume, objectEmpty } from '#app/util/resume';
import clone from 'lodash/cloneDeep'
import classnames from 'classnames';
import Resume from './Resume';
import steps from './steps';
import Signup from '#app/common/components/Signup';
import Helmet from 'react-helmet';
import Footer from '#app/common/components/MiniFooter';

const { Content } = Layout;
const Panel = Collapse.Panel;
const fields = [
  {value: 'skill', label: 'Skills'},
  {value: 'volunteer', label: 'Volunteer'},
  {value: 'award', label: 'Awards'},
  {value: 'publication', label: 'Publications'},
  {value: 'language', label: 'Languages'},
  {value: 'interest', label: 'Interests'},
  {value: 'reference', label: 'References'},
];

class BuildResume extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    sectionHeaderEnabled: false,
    // attachmentLoading: false,
    // attachmentLoaded: false,
    signup: false,
    // pdfLocation: '',
  };

  componentWillMount() {
    const { goToUrl, Account, resumeCompleted, location } = this.props;
    const { router } = this.context;
    if (typeof location.query.inc !== 'undefined' && location.query.inc == "true") {
      this.$profileIncomplete = true;
      router.replace('/resume');
    }

    if (Account.get('isAuthenticated')) {
      const user = Account.toJSON().user;
      if (user && !resumeCompleted) {
        this.props.dispatch(setStep(user.signup_step));
        this.props.dispatch(initResume(user.resume));
      }

      if (resumeCompleted && user && user.activated) {
        router.replace('/me');
      } else if (resumeCompleted) {
        router.replace({
          pathname: '/welcome',
          query: {email: user.email},
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevUser = this.props.Account.toJSON().user;
    const currUser = nextProps.Account.toJSON().user;
    const completed = nextProps.resumeCompleted;
    if (typeof prevUser == 'undefined' && typeof currUser == 'object') {
      this.props.dispatch(setStep(currUser.signup_step));
      this.props.dispatch(initResume(currUser.resume));
    }

    if (completed) {
      this.props.goToUrl('/welcome', {}, {email: currUser.email});
    }
  }

  componentDidMount() {
    const elements = document.querySelectorAll('input,select,textarea');
    const invalidListener = function(){
      this.scrollIntoView(false);
    };

    for(var i = elements.length; i--;) {
      elements[i].addEventListener('invalid', invalidListener);
    }
  }

  addField = (sectionName) => {
    const { dispatch } = this.props;
    dispatch(addSubField(sectionName));
  };

  removeSubField = (field, index) => {
    const { dispatch } = this.props;
    dispatch(removeFieldAt(field, index));
  };

  onEdit = (field, key, value, index) => {
    const { dispatch } = this.props;
    dispatch(editFieldAt(field, key, value, index));
  };

  previewResume = () => {
    window.open('https://talentsinafrica.com/preview', '_blank');
  };

  isResumeEmpty = (resume) => {
    if (!resume || (typeof resume == 'object' && Object.keys(resume).length == 0)) return true;
    const copy = clone(resume);
    return objectEmpty(cleanResume(copy));
  };

  submitForm = (evt) => {
    evt.preventDefault();
    const { resume, goToUrl } = this.props;
    goToUrl('join', {fs: true}, { resume });
  };

  render() {
    const { resume, loading, active, step, Account, isMobile, resumeCompleted } = this.props;

    return (
      <div className="cv-builder overflow-hidden">
        {
          isMobile &&
          <div className={classnames({overlay: true, active: loading})}>
            {
              loading &&
              <Spinner singleColor />
            }
          </div>
        }
        <Helmet title="Build Resume" />
        {
          (() => {
            if (isMobile) {
              return (
                <div className="mfc">
                  <div>
                    <div className="ui position-relative">
                      <main className="ui-grid">
                        {
                          (() => {
                            const isAuthenticated = this.props.Account.get('isAuthenticated');
                            const user = this.props.Account.toJSON().user;

                            if (isAuthenticated && user && !user.approved) {
                              return (
                                <Resume
                                  resume={resume}
                                  steps={steps}
                                  dispatch={this.props.dispatch}
                                  step={step}
                                  user={user}
                                  preview={this.previewResume}
                                  incomplete={this.$profileIncomplete}
                                  isMobile
                                />
                              );
                            } else if(user && user.approved) {
                              setTimeout(() => {
                                this.props.goToUrl('/me');
                              }, 8000);

                              return (
                                <div className="ac-complete">
                                  <center>
                                    <span>
                                      You have already completed your Resume. Please wait while we take you to your profile<br/><Button loading onClick={() => this.props.goToUrl('/me')}>Go to my profile</Button>
                                    </span>
                                  </center>
                                </div>
                              );
                            } else {
                              return (
                                <Signup dispatch={this.props.dispatch} isMobile={isMobile} />
                              );
                            }
                          })()
                        }
                      </main>
                    </div>
                  </div>
                  <div className="padding-top-40"></div>
                  <Footer isMobile/>
                </div>
              )
            } else {
              return (
              <div className="fc">
                <div className="left">
                  <img
                    id="tc-logo"
                    src="/static/images/logo-web.png"
                  />
                </div>
                <div className="right cv-header margin-top-15">
                  <h3>Build Resume</h3>
                </div>
                <div className="clear"></div>
                {
                  (() => {
                    if (step > 0) {
                      return (
                        <div>
                          <hr className="margin-top-15 margin-bottom-40" />
                        </div>
                      );
                    }
                  })()
                }
                <div>
                  <div className="ui position-relative">
                    <div className={classnames({overlay: true, active: loading})}>
                      {
                        loading &&
                        <Spinner singleColor />
                      }
                    </div>
                    <main className="ui-grid margin-top-40">
                      {
                        (() => {
                          const isAuthenticated = this.props.Account.get('isAuthenticated');
                          const user = this.props.Account.toJSON().user;

                          if (isAuthenticated && user && !user.approved) {
                            return (
                              <Resume
                                resume={resume}
                                steps={steps}
                                dispatch={this.props.dispatch}
                                step={step}
                                user={user}
                                preview={this.previewResume}
                                incomplete={this.$profileIncomplete}
                              />
                            );
                          } else if(user && user.approved) {
                            setTimeout(() => {
                              this.props.goToUrl('/me');
                            }, 8000);

                            return (
                              <div className="ac-complete">
                                <center>
                                  <span>
                                    You have already completed your Resume. Please wait while we take you to your profile<br/><Button loading onClick={() => this.props.goToUrl('/me')}>Go to my profile</Button>
                                  </span>
                                </center>
                              </div>
                            );
                          } else {
                            return (
                              <Signup dispatch={this.props.dispatch} />
                            );
                          }
                        })()
                      }
                    </main>
                  </div>
                </div>
                <Footer />
              </div>
              );
            }
          })()
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  Account: state.Account,
  resumeCompleted: state.Resume.get('resumeCompleted'),
  active: state.Resume.toJSON().active,
  resume: state.Resume.toJSON().data,
  step: state.Resume.get('currentStep'),
  loading: state.Resume.get('loading'),
  loadFailed: state.Resume.get('loadFailed'),
  failureMessage: state.Resume.get('failureMessage'),
});

export default connect(mapStateToProps)(BuildResume);