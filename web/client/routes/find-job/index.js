import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { provideHooks } from 'redial';
import Footer from '#app/common/components/Footer';
import JobSearchComponent from './components/JobSearch';
import ResumeAlert from '#app/routes/ResumeAlerts/components/ResumeAlertComponent';
import classnames from 'classnames';
import { getRandomJobs } from './actions';
import {displayDate} from '#app/util/date';
import JobAlert from './components/JobAlert';

class ResumeSearch extends PureComponent {
  getJobProvider = (url) => {
    let host = '';

      if (url.indexOf('jobberman') != -1) {
        host = 'jobberman.com.gh';
      } else if(url.indexOf('businessghana.com') != -1) {
        host = 'businessghana.com';
      } else if(url.indexOf('ghanacurrentjobs.com') != -1) {
        host = 'ghanacurrentjobs.com';
      } else if(url.indexOf('jobhouse.com.gh') != -1) {
        host = 'jobhouse.com.gh';
      } else if(url.indexOf('joblistghana.com') != -1) {
        host = 'joblistghana.com';
      } else if(url.indexOf('jobwebghana.com') != -1) {
        host = 'jobwebghana.com';
      } else {
        host = url;
      }

    return host;
  }

  render() {
    const { jobs, searching } = this.props;

    return (
      <div className={classnames({"job-search": true, fh: jobs.length == 0})}>
         <Helmet
            title='Find Job'
            meta={[
              {
                property: 'og:title',
                content: 'Talents in Africa: Find Job'
              }
            ]}
          />
          <div className="content">
            <JobSearchComponent goToUrl={this.props.goToUrl} />
          </div>
          <div className="suggestions">
            <div className="suggestions-wrap grid">
              <div  className="jbs grid__col--8">
                <JobAlert />
              </div>
            </div>
            <div className="suggestions-wrap grid samp_jbs">
                <div className="resultsBody grid__col--8">
                  <label>Recent Jobs</label>
                  {
                    (() => {
                      if (jobs.length > 0) {
                        return jobs.map((job, index) => (
                          <div className="result" key={index}>
                            <h2 className="jobtitle">
                                <Link to={job.url}
                                    target="_blank">
                                    {job.desc}
                                </Link>
                            </h2>
                            <span className="company">
                                <span itemProp="name">
                                    <Link onClick={()=>{}}>
                                        {job.company}
                                    </Link>
                                </span>
                            </span>
                            &nbsp;-&nbsp;
                            <span>
                                <span className="location">
                                    <span>{job.region}</span>
                                </span>
                            </span>
                            <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td className="snip">
                                            <div className="result-link-bar-container">
                                                <div className="result-link-bar">
                                                    <span className="date">
                                                      posted {job.posted_on != '' ? displayDate(job.posted_on): ''} on <span>{this.getJobProvider(job.url)}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        ))
                      }
                    })()
                  }
                </div>
            </div>
          </div>
          <Footer />
      </div>
    );
  }
}

const loadRandomJobs = (dispatch) => {
  return dispatch(getRandomJobs(5));
};

const hooks = {
  fetch: ({dispatch, query, store: {getState}}) => {
    const loaded = getState().Jobs.toJSON().loaded;
    if (!loaded) {
      return Promise.resolve(loadRandomJobs(dispatch));
    }
    return Promise.resolve();
  },
  defer: ({dispatch, query, store: {getState}}) => {
    const loaded = getState().Jobs.toJSON().loaded;
    if (!loaded) {
      return Promise.resolve(loadRandomJobs(dispatch));
    }
    return Promise.resolve();
  },
};

const mapStateToProps = (state) => ({
  searching: state.Jobs.get('searching'),
  jobs: state.Jobs.toJSON().jobs,
});

export default provideHooks(hooks)(connect(mapStateToProps)(ResumeSearch));