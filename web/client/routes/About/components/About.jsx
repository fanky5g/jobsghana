import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import Footer from '#app/common/components/MiniFooter';

export default class About extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    routes: PropTypes.array,
  };

  render() {
    const { isMobile } = this.props;
    return (
      <div className="about">
        <div className="grid margin-top-40">
          <section className="margin-bottom-20 padding-20">
            <article className="container">
              <div className="section-content">
                <h2 className="title r-title">If  You are a jobseeker</h2>
                <br />
                <p>
                  The job market today is extremely competitive,
                  and employers are looking for candidates with very specific skills and work experience.
                  When it comes to that "next step" towards securing a new job,
                  the importance of writing and posting a good resume cannot be ignored.
                  Talents Community provides an “easy to use” avenue for you to create and share online a
                  very detailed profile of your skills and experiences for potential employers to consider.
                  There is no charge to upload your resume and create a profile for employers to consider.
                  After registering you can log into the Talents Community portal to update and manage your
                  information. Our system will email you when your private profile is found by an employer.
                </p>
              </div>
            </article>
          </section>
          <section>
            <article className="container">
              <div className="section-content padding-20">
                <h2 className="title r-title">If you are an Employer</h2>
                <br />
                <p>
                  The Talents Community simplifies your recruitment process,
                  letting you perform targeted searches and connect with active
                  jobseekers matching your specific hiring requirements.
                  You get notified when relevant candidates match your search
                  and only pay when you contact candidates.
                </p>
              </div>
            </article>
          </section>
          <div className="margin-top-40"></div>
          <Footer isMobile={isMobile}/>
        </div>
      </div>
    );
  }
}
