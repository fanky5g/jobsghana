import React from 'react';
import { currentDate } from '#app/lib/date';
import moment from 'moment';
import Link from 'react-router/lib/Link';
import { Icon } from 'antd';

const Footer = () => (
  <footer className="section section-footer" id="footer">
    <div className="container">
      <section className="section-content">
        <div className="container">
          <nav className="grid__col--4">
            <article>
              <h4>Job Seekers</h4>
              <ul className="unstyled-list">
                <li><Link to="/resume">Upload your Resume</Link></li>
                <li><Link to="/find-job">Search Jobs</Link></li>
                <li><Link to="/career-advice">Career Advice</Link></li>
                <li><Link to="http://africainternshipacademy.com/course" target="_blank">Training Courses</Link></li>
                <li><Link to="http://africainternshipacademy.com" target="_blank">Internship Opportunities</Link></li>
              </ul>
            </article>
          </nav>
          <nav className="grid__col--4">
            <article>
              <h4>Recruiters</h4>
              <ul className="unstyled-list">
                <li><Link to="/find-resume">Search for Talent</Link></li>
                <li><Link to="/career-advice"></Link></li>
              </ul>
            </article>
          </nav>
          <nav className="grid__col--4">
            <article>
              <h4>About Talents Community</h4>
              <ul className="unstyled-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </article>
            <article className="social-icons">
              <h4>Social</h4>
              <ul className="inline-list">
                <li>
                  <Link to="https://www.facebook.com/TalentsCommunity/" target="_blank" className="facebook" />
                </li>
                <li>
                  <Link to="https://twitter.com/TalentsinAfrica" className="twitter" target="_blank" />
                </li>
              </ul>
            </article>
          </nav>
        </div>
        <br />
        <hr />
        <br />
        <div className="container">
          <ul className="inline-list">
            <small><span>&copy;{`${moment(currentDate(), 'YYYY').format('YYYY')} Africa Internship Academy`}</span></small>
          </ul>
        </div>
      </section>
    </div>
  </footer>
);

export default Footer;
