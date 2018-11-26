import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import { provideHooks } from 'redial';
import Footer from '#app/common/components/Footer';
import ResumeSearchComponent from './ResumeSearch';
import ResumeAlert from '#app/routes/ResumeAlerts/components/ResumeAlertComponent';

class ResumeSearch extends PureComponent {
  render() {
    return (
      <div className="cv-search">
         <Helmet
            title='Find Resume'
            meta={[
              {
                property: 'og:title',
                content: 'Talents in Africa: Find Resume'
              }
            ]}
          />
          <div className="content">
            <ResumeSearchComponent goToUrl={this.props.goToUrl} />
            <ResumeAlert />
          </div>
          <Footer />
      </div>
    );
  }
}

export default ResumeSearch;