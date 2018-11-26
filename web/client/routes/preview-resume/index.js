import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setPreviewResume, accountViewed, downloadUserResume, getResume } from './actions';
import Helmet from 'react-helmet';
import Basics from './components/Basics';
import Work from './components/Work';
import Awards from './components/Awards';
import Education from './components/Education';
import Preferences from './components/Preferences';
import Competencies from './components/Competencies';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Referees from './components/Referees';
import clone from 'lodash/clone';
import { Card, Button, Affix } from 'antd';
import { cleanResume, buildResume, objectEmpty } from '#app/util/resume';
import { provideHooks } from 'redial';
import { Spinner } from 'react-mdl';

export const Resume = ({resume}) => (
  <div>
    {
      resume.basics &&
      <Basics basics={resume.basics} />
    }
    {
      resume.preferences &&
      <Preferences preferences={resume.preferences} />
    }
    {
      resume.work && resume.work.length > 0 &&
      <Work work={resume.work} />
    }
    {
      resume.competencies && resume.competencies.length > 0 &&
      <Competencies competencies={resume.competencies} />
    }
    {
      resume.education && resume.education.length > 0 &&
      <Education education={resume.education} />
    }
    {
      resume.skills && resume.skills.length > 0 &&
      <Skills skills={resume.skills} />
    }
    {
      resume.awards && resume.awards.length > 0 &&
      <Awards awards={resume.awards} />
    }
    {
      resume.certifications && resume.certifications.length > 0 &&
      <Certifications certifications={resume.certifications} />
    }
    {
      resume.referees &&
      <Referees referees={resume.referees} />
    }
  </div>
);


class PreviewResume extends PureComponent {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    showDownload: false,
    accountViewed: false,
  };

  goBack = () => {
    const { router } = this.context;
    router.goBack();
  };

  componentWillReceiveProps(nextProps) {
    const { user, location: { query: {uid}} } = nextProps;
    const { dispatch } = this.props;

    if (location.pathname == '/resume-preview' && this.state.showDownload) {
      this.setState({
        showDownload: false,
      });
      return;
    }

    if (user && typeof uid != 'undefined') {
      if (user.ID == uid) {
        this.setState({
          showDownload: false,
        });
      }
    }

    if (user && typeof uid == 'undefined') {
      this.setState({
        showDownload: false,
      });
    }

    if (!user && typeof uid != 'undefined' && !this.state.accountViewed) {
      this.setState({
        accountViewed: true,
        showDownload: true,
      });

      dispatch(accountViewed(parseInt(uid, 10)));
    }
  }

  downloadResume = () => {
    const { location: { query: { uid }}, dispatch, user } = this.props;

    if (uid) {
      dispatch(downloadUserResume(parseInt(uid, 10)));
    }
  };

  isResumeEmpty = (resume) => {
      if (!resume || (typeof resume == 'object' && Object.keys(resume).length == 0)) return true;
      const copy = buildResume(clone(resume));
      return objectEmpty(cleanResume(copy));
  };

  render() {
    const { resume, screenWidth, loading } = this.props;
    const { showDownload } = this.state;
    const isEmpty = this.isResumeEmpty(resume);

    var name = '';
    if (!isEmpty) {
      name = resume.basics.name;
    }

    return (
      <div className="Content">
        <div className="preview">
          {
            !isEmpty &&
            <div>
              {
                name != '' &&
                <Helmet title={`${name}`} />
              }
              <Card id="resume">
                <Resume resume={resume} />
              </Card>
              {
                showDownload &&
                <Button className="fab fab-primary fab-fixed" onClick={this.downloadResume}>
                  <i className="material-icons">file_download</i>
                </Button>
              }
            </div>
          }
          {
            loading &&
            <div className="text-centered padding-20 margin-top-40">
              <Spinner singleColor/>
            </div>
          }
          {
            isEmpty && !loading &&
            <div className="padding-top-40 padding-20 text-centered">
              <span>resume not found</span>
            </div>
          }
        </div>
      </div>
    );
  }
}

const getStuff = ({ dispatch, query: { uid }, store: { getState } }) => {
  const isAuthenticated = getState().Account.get('isAuthenticated');

  if (uid) {
    return Promise.resolve(dispatch(getResume(uid)));
  } else if (isAuthenticated && !uid) {
    return Promise.resolve(dispatch(getResume()));
  }

  return Promise.resolve();
};

const hooks = {
  defer: getStuff,
  fetch: getStuff,
};

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
  screenWidth: state.Environment.get('screenWidth'),
  resume: state.Preview.toJSON().resume,
  loading: state.Preview.toJSON().loading,
});

export default provideHooks(hooks)(connect(mapStateToProps)(PreviewResume));