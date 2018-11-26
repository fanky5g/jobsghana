import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import Link from 'react-router/lib/Link';
import { Layout, Button, Select } from 'antd';
import classnames from 'classnames';
// import AdBanner from '#app/common/components/Adbanner';
import Footer from '#app/common/components/Footer';
import JobSearch from './JobSearch';
import Banner from '#app/common/components/Banner';

const { Content } = Layout;
const SelectOption = Select.Option;

class Home extends PureComponent {
  state = {
    inRegion: '',
    query: '',
    isMounted: false,
  };

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
  }

  queryChange = (evt) => {
    const { dispatch, query } = this.props;
    const value = evt.target.value;

    this.setState({
      query: value,
    });
  }


  regionChanged = (value) => {
    this.setState({
      inRegion: value,
    });
  };

  onSearchSubmit = (evt) => {
    evt.preventDefault();
    if (evt.target.value == '') return;

    this.props.goToUrl('/search', {
      q: this.state.query,
      region: this.state.inRegion,
      type: '_job',
    });
  };

  render() {
    const { inRegion, query } = this.state;
    const regionSelect = (
      <Select placeholder="where" onChange={this.regionChanged}>
        <SelectOption value="greater accra">Greater Accra</SelectOption>
        <SelectOption value="eastern region">Eastern Region</SelectOption>
        <SelectOption value="central region">Central Region</SelectOption>
        <SelectOption value="ashanti region">Ashanti Region</SelectOption>
        <SelectOption value="western region">Western Region</SelectOption>
        <SelectOption value="brong ahafo region">Brong Ahafo Region</SelectOption>
        <SelectOption value="upper east region">Upper East Region</SelectOption>
        <SelectOption value="upper west region">Upper West Region</SelectOption>
        <SelectOption value="volta region">Volta Region</SelectOption>
        <SelectOption value="northern region">Northern Region</SelectOption>
      </Select>
    );

    return (
      <section className="Search">
         <Helmet
            title='Talents Community - Find Job'
            meta={[
              {
                property: 'og:title',
                content: 'Talents in Africa: Find Job/Resume'
              }
            ]}
          />
          <Content>
            <header className="hero">
              <section id="hero-initial">
                <JobSearch
                  onSearchSubmit={this.onSearchSubmit}
                  queryChange={this.queryChange}
                  regionSelect={regionSelect}
                  query={query}
                  onSelect={this.regionChanged}
                />
              </section>
            </header>
            <article className="content banners">
              {
                // <AdBanner slot='4024293851' />
              }
              <div className="grid">
                  <div className="centered secondary-info">
                      <div className="grid__col--4 callout alerts">
                        <div className="title">
                          <h4><span>Resume</span> Alerts</h4>
                        </div>
                        <div className="icon">
                        </div>
                        <p>Get the latest resume that matches your preferences directly into your mailbox</p>
                        <Button
                            className="action showOnlyJS"
                            onClick={() => this.props.goToUrl('/cv-alert')}>
                            Get Resume Alerts</Button>
                        <Link
                            className="action noscript"
                            to="/cv-alert"
                            target="_blank">Resume Alerts</Link>
                      </div>
                      <div className="grid__col--4 callout course">
                          <div className="title">
                            <h4><span>Course</span> Library</h4>
                          </div>
                          <div className="icon"></div>
                          <p>
                            Do you want to enhance your chances of getting a job?  Improve On yourself
                          </p>
                          <Button
                            onClick={() => this.props.goToUrl('http://africainternshipacademy.com/course')}
                            className="action showOnlyJS">Find Training Courses</Button>
                          <Link
                            className="action noscript"
                            to="http://africainternshipacademy.com/course"
                            target="_blank">Find Training Courses</Link>
                      </div>
                      <div className="grid__col--4 callout cad">
                          <div className="title">
                            <h4><span>Career</span> Advice</h4>
                          </div>
                          <div className="icon"></div>
                          <p>
                          Get help on your CV, Cover letters, interviews, and Salary and career tips
                          </p>
                          <Button
                            className="action showOnlyJS"
                            onClick={() => this.props.goToUrl('/career-advice')}>
                            View Career Advice</Button>
                          <Link
                            className="action noscript"
                            to="/career-advice"
                            target="_blank">View Career Advice</Link>
                      </div>
                  </div>
              </div>
          </article>
          <article className="content banner">
            <div className="grid">
              {
                this.state.isMounted &&
                <Banner
                  images={[
                    '/static/images/banners/lfj.jpg',
                    '/static/images/banners/tc.jpg',
                    '/static/images/banners/uyr.jpg',
                  ]}
                />
              }
            </div>
          </article>
          <article className="content has-bg">
            <div className="grid">
                <div className="centered grid__col--8 text-centered">
                    <h3>Internship Opportunities</h3>
                    <p>Do you know that 98% of internship supervisors would hire their supervisee if there were an opening?</p>
                    <div className="centered grid__col--10">
                        <div className="callout-card structure">
                            <div className="callout-card-icon">
                                <svg viewBox="0 0 273.7 69.2">
                                    <g>
                                        <g>
                                            <g>
                                                <path fill="#FED36E" d="M215,35.9c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S223.3,35.9,215,35.9z"></path>
                                                <path fill="#FFFFFF" d="M215,7c7.7,0,14,6.3,14,14s-6.3,14-14,14s-14-6.3-14-14S207.3,7,215,7 M215,5c-8.8,0-16,7.2-16,16
                s7.2,16,16,16s16-7.2,16-16S223.8,5,215,5L215,5z"></path>
                                            </g>
                                            <rect x="211.3" y="27.6" fill="#745744" width="6.9" height="5.5"></rect>
                                            <path fill="#917154" d="M220.8,17.1c-0.7-1.3-2.4-2.7-5.8-2.7c-0.1,0-0.1,0-0.2,0c-1.9,0-4.5,0.4-5.9,2.7
            c-0.9,1.4-0.9,2.7-0.9,2.7s0,2.2,0.9,4.5c1.1,3,3.2,4.5,6,4.5c2.8,0,4.9-1.6,6-4.6c0.8-2.2,0.9-4.3,0.9-4.4
            C221.7,19.8,221.6,18.5,220.8,17.1z"></path>
                                            <g>
                                                <circle fill="#443124" cx="211.7" cy="22.4" r="0.8"></circle>
                                            </g>
                                            <g>
                                                <circle fill="#443124" cx="217.8" cy="22.4" r="0.8"></circle>
                                            </g>
                                            <g>
                                                <path fill="#020202" d="M221.2,23.2c0,0,1-1.3,1.7-3.1c1.3-3.1-1.5-6.3-1.5-6.3c-3.1-3.3-8.1-3.1-9.7-1.6
                c-1.6,1.6-1.5,2.1-1.5,2.1s-2.9,0.4-2.9,3.5s1.1,5.3,1.1,5.3s-0.1,0-0.1-1.5c0-3.2,5.2-3.1,8.1-1.7c3.2,1.6,4.9,0,4.9,0
                L221.2,23.2z"></path>
                                            </g>
                                            <path fill="#F78460" d="M218.3,29.4c-0.1,0-0.5,2.3-3.5,2.3s-3.4-2.3-3.5-2.3c-2.8,0-4.1,1.5-4.7,2.8c2.3,1.7,5.3,2.8,8.4,2.8
            c3,0,5.8-0.9,8.1-2.5C222.5,31,221.2,29.4,218.3,29.4z"></path>
                                        </g>
                                        <path fill="#6C4F39" d="M216.8,25.4c-0.1-0.1-0.1-0.1-0.3-0.1H213c-0.1,0-0.3,0.1-0.3,0.1c-0.1,0.1,0,0.2,0.1,0.3l1.7,1.3
        c0.1,0.1,0.1,0.1,0.2,0.1c0.1,0,0.1,0,0.2-0.1l1.8-1.3C216.8,25.6,216.9,25.5,216.8,25.4z"></path>
                                    </g>
                                    <circle fill="#FFFFFF" fillOpacity="0.1" cx="208" cy="56" r="8"></circle>
                                    <circle fill="#FFFFFF" fillOpacity="5.000000e-02" cx="170" cy="8" r="8"></circle>
                                    <circle fill="#FFFFFF" fillOpacity="0.2" cx="262" cy="11" r="8"></circle>
                                    <circle fill="#FFFFFF" fillOpacity="5.000000e-02" cx="8" cy="41" r="8"></circle>
                                    <circle fill="#FFFFFF" fillOpacity="0.1" cx="125" cy="55" r="8"></circle>
                                    <circle fill="#FFFFFF" fillOpacity="0.1" cx="89" cy="9" r="6"></circle>
                                    <circle fill="#FFFFFF" fillOpacity="0.15" cx="43" cy="52" r="9"></circle>
                                    <g>
                                        <g>
                                            <path fill="#B2E3FB" d="M127,33c-7.7,0-14-6.3-14-14s6.3-14,14-14s14,6.3,14,14S134.7,33,127,33z"></path>
                                            <path fill="#FFFFFF" d="M127,6c7.2,0,13,5.8,13,13s-5.8,13-13,13c-7.2,0-13-5.8-13-13S119.8,6,127,6 M127,4c-8.3,0-15,6.7-15,15
            s6.7,15,15,15s15-6.7,15-15S135.3,4,127,4L127,4z"></path>
                                        </g>
                                        <rect x="123.6" y="24.7" fill="#E7AF86" width="6.5" height="4.8"></rect>
                                        <path fill="#FBD2A8" d="M132.4,15.3c-0.7-1.2-2.2-2.6-5.4-2.6c-0.1,0-0.1,0-0.2,0c-1.8,0-4.2,0.5-5.5,2.7c-0.8,1.3-0.8,2.5-0.8,2.6
        s0,2.1,0.8,4.1c1.1,2.8,3,4.3,5.6,4.3c2.6,0,4.5-1.5,5.6-4.3c0.7-2,0.8-4.1,0.8-4.1C133.1,17.8,133.1,16.6,132.4,15.3z"></path>
                                        <g>
                                            <circle fill="#635041" cx="124" cy="20.3" r="0.7"></circle>
                                        </g>
                                        <g>
                                            <circle fill="#635041" cx="129.6" cy="20.3" r="0.7"></circle>
                                        </g>
                                        <g>
                                            <path fill="#6F5A44" d="M120.9,21c0,0-0.9-1.2-1.7-3c-1.2-3,1.4-5.9,1.4-5.9c3-3.2,7.6-3,9.2-1.5c1.5,1.5,1.4,2,1.4,2
            s2.6,0.4,2.6,3.3s-1.1,5-1.1,5s0,0,0-1.4c0-3-3-4.3-3-4.3s-1.6,1.5-4.3,2.8c-3,1.5-4.5,0-4.5,0L120.9,21z"></path>
                                        </g>
                                        <path fill="#DA9F82" d="M128.7,23.1c-0.1-0.1-0.1-0.2-0.2-0.2h-3.3c-0.1,0-0.2,0.1-0.2,0.2c-0.1,0.1,0,0.2,0.1,0.3l1.6,1.2
        c0.1,0.1,0.1,0.1,0.2,0.1c0.1,0,0.1,0,0.2-0.1l1.7-1.2C128.7,23.4,128.7,23.3,128.7,23.1z"></path>
                                        <path fill="#3195CA" d="M130,26.8c-0.1,0-0.4,2.2-3.3,2.2c-2.8,0-3.2-2.2-3.2-2.2c-2.6,0-3.8,1.4-4.4,2.6c2.2,1.6,4.9,2.6,7.8,2.6
        c2.8,0,5.4-0.9,7.6-2.4C134,28.3,132.8,26.8,130,26.8z"></path>
                                    </g>
                                    <g>
                                        <path fill="#DCA183" d="M172,51.8c-0.1-0.2-0.2-0.2-0.3-0.2h-4c-0.2,0-0.3,0.1-0.3,0.2c-0.1,0.2,0,0.2,0.1,0.4l2,1.5
        c0.1,0.1,0.2,0.1,0.2,0.1c0.1,0,0.2,0,0.2-0.1l2.1-1.5C172,52.1,172,51.9,172,51.8z"></path>
                                        <g>
                                            <g>
                                                <path fill="#40ADCF" d="M170,63.9c-9.4,0-17-7.6-17-17s7.6-17,17-17s17,7.6,17,17S179.4,63.9,170,63.9z"></path>
                                                <path fill="#FFFFFF" d="M170,31c8.8,0,16,7.1,16,16c0,8.8-7.2,16-16,16s-16-7.1-16-16C154,38.1,161.2,31,170,31 M170,29
                c-9.9,0-18,8.1-18,18s8.1,18,18,18s18-8.1,18-18S179.9,29,170,29L170,29z"></path>
                                            </g>
                                            <rect x="165.8" y="54.6" fill="#745744" width="7.8" height="6.3"></rect>
                                            <path fill="#917154" d="M177.7,45.7c0,1.6-0.4,3.2-1,5c-1.2,3.4-3.7,5.2-6.9,5.2s-5.6-1.7-6.9-5.2c-1-2.6-1-3.8-1-5.1
            c0-8.7,7.6-8.5,7.6-8.5S177.7,37,177.7,45.7z"></path>
                                            <g>
                                                <circle fill="#443124" cx="166.3" cy="48.6" r="0.9"></circle>
                                            </g>
                                            <g>
                                                <circle fill="#443124" cx="173.2" cy="48.6" r="0.9"></circle>
                                            </g>
                                            <path fill="#8365B0" d="M173.7,56.6c-0.1,0-0.5,2.7-4,2.7c-3.5,0-3.9-2.7-4-2.7c-3.2,0-4.6,1.7-5.4,3.2c2.7,2,6,3.2,9.6,3.2
            c3.4,0,6.6-1.1,9.3-2.9C178.6,58.4,177.1,56.6,173.7,56.6z"></path>
                                        </g>
                                        <path fill="#6C4F39" d="M172.1,52c-0.1-0.2-0.2-0.2-0.3-0.2h-4c-0.2,0-0.3,0.1-0.3,0.2c-0.1,0.2,0,0.2,0.1,0.4l2,1.5
        c0.1,0.1,0.2,0.1,0.2,0.1c0.1,0,0.2,0,0.2-0.1l2.1-1.5C172.1,52.3,172.1,52.1,172.1,52z"></path>
                                        <path fill="#3B2E22" d="M162.5,50.2c-0.2-2.5,2.6,5,7.2,5c4,0,7.3-6.2,7.3-4.4c0,3.5-2.4,6.6-4.9,7.9c-1.7,0.9-3.5,0.8-5.1-0.3
        C164.9,57,162.8,54.5,162.5,50.2z"></path>
                                    </g>
                                    <g>
                                        <g>
                                            <path fill="#FD8FB4" d="M81,60c-8.3,0-15-6.7-15-15s6.7-15,15-15s15,6.7,15,15S89.3,60,81,60z"></path>
                                            <path fill="#FFFFFF" d="M81,31c7.7,0,14,6.3,14,14s-6.3,14-14,14s-14-6.3-14-14S73.3,31,81,31 M81,29c-8.8,0-16,7.2-16,16
            s7.2,16,16,16s16-7.2,16-16S89.8,29,81,29L81,29z"></path>
                                        </g>
                                        <rect x="77.3" y="51.6" fill="#EDC1A4" width="6.9" height="5.5"></rect>
                                        <path fill="#F0D7BC" d="M86.8,40.9C86.1,39.6,84.4,38,81,38c-0.1,0-0.1,0-0.2,0c-1.9,0-4.5,0.6-5.9,2.9C74,42.3,74,43.7,74,43.8
        c0,0.1,0,2.3,0.9,4.5c1.1,3,3.2,4.6,6,4.6c2.8,0,4.9-1.6,6-4.6c0.8-2.2,0.9-4.4,0.9-4.5C87.7,43.7,87.6,42.3,86.8,40.9z"></path>
                                        <g>
                                            <circle fill="#246B56" cx="77.7" cy="46.4" r="0.8"></circle>
                                        </g>
                                        <g>
                                            <circle fill="#246B56" cx="83.8" cy="46.4" r="0.8"></circle>
                                        </g>
                                        <path fill="#D4AC92" d="M82.8,49.5c-0.1-0.1-0.1-0.1-0.3-0.1H79c-0.1,0-0.3,0.1-0.3,0.1c-0.1,0.1,0,0.2,0.1,0.3l1.7,1.3
        c0.1,0.1,0.1,0.1,0.2,0.1c0.1,0,0.1,0,0.2-0.1l1.8-1.3C82.8,49.7,82.9,49.6,82.8,49.5z"></path>
                                        <path fill="#347AA9" d="M84.3,53.4c-0.1,0-0.5,2.3-3.5,2.3s-3.4-2.3-3.5-2.3c-2.8,0-4.1,1.5-4.7,2.8c2.3,1.7,5.3,2.8,8.4,2.8
        c3,0,5.8-0.9,8.1-2.5C88.5,55,87.2,53.4,84.3,53.4z"></path>
                                        <path fill="#90310D" d="M88.1,42.5c-0.2,1.6,0.9,3.5,0.7,3.7c-1.1,0.7-4.2-3.2-6.7-4.8c-0.3-0.2-0.8-1.7-1.1-1.7
        c-0.3,0-1.1,1.4-1.5,1.7c-3.5,2.2-4.2,3.8-4.4,5c-0.1,0.6-0.6,1.3-0.3,1.9c2.3,3.7,0.2,4.3-0.1,4.3c-0.9,0-1.7-3.3-1.9-4.6
        c-0.4-3.4,0.4-7.9,1.8-9.8c1.4-1.9,3.5-2.9,6.2-2.9C85.2,35.3,88.5,38.9,88.1,42.5z"></path>
                                    </g>
                                    <g>
                                        <g>
                                            <path fill="#329577" d="M36,35c-9.4,0-17-7.6-17-17S26.6,1,36,1s17,7.6,17,17S45.4,35,36,35z"></path>
                                            <path fill="#FFFFFF" d="M36,2c8.8,0,16,7.2,16,16s-7.2,16-16,16c-8.8,0-16-7.2-16-16S27.2,2,36,2 M36,0c-9.9,0-18,8.1-18,18
            s8.1,18,18,18s18-8.1,18-18S45.9,0,36,0L36,0z"></path>
                                        </g>
                                        <rect x="31.8" y="25.5" fill="#D4A788" width="7.8" height="6.2"></rect>
                                        <path fill="#E6BA93" d="M42.6,13.3C41.8,11.8,39.9,10,36,10c-0.1,0-0.2,0-0.2,0c-2.2,0-5.2,0.7-6.8,3.4c-1,1.6-1,3.2-1,3.3
        c0,0.1,0,2.6,1,5.1c1.3,3.4,3.7,5.3,6.9,5.3c3.2,0,5.6-1.8,6.9-5.3c0.9-2.5,1-5,1-5.2C43.6,16.5,43.5,14.9,42.6,13.3z"></path>
                                        <g>
                                            <circle fill="#69463A" cx="32.3" cy="19.6" r="0.9"></circle>
                                        </g>
                                        <g>
                                            <circle fill="#69463A" cx="39.2" cy="19.6" r="0.9"></circle>
                                        </g>
                                        <path fill="#B89176" d="M38.1,23.1C38,23,37.9,23,37.8,23h-4c-0.2,0-0.3,0.1-0.3,0.2c-0.1,0.2,0,0.2,0.1,0.4l2,1.5
        c0.1,0.1,0.2,0.1,0.2,0.1c0.1,0,0.2,0,0.2-0.1l2.1-1.5C38.1,23.3,38.1,23.3,38.1,23.1z"></path>
                                        <path fill="#64CE83" d="M39.7,27.6c-0.1,0-0.5,2.7-4,2.7c-3.5,0-3.9-2.7-4-2.7c-3.2,0-4.6,1.7-5.4,3.2c2.7,2,6,3.2,9.6,3.2
        c3.4,0,6.6-1.1,9.3-2.9C44.6,29.4,43.1,27.6,39.7,27.6z"></path>
                                        <path fill="#2B0E04" d="M44.2,23.6C41.5,29,43,13.8,38,13.8c-2,0-4.3-2.9-5.3-2.3c-4,2.6-3.3,6.6-3.5,8.1c-0.5,3.8-1.1,6.6-1.8,4
        c-0.9-3.5-0.9-10.4,1.2-13.3c1.6-2.2,4-3.5,7.1-3.3c2.7,0.1,6.1,1.3,7.4,3C46,14,45.5,20.8,44.2,23.6z"></path>
                                    </g>
                                    <g>
                                        <g>
                                            <g>
                                                <path fill="#58BBB3" d="M255.6,68.1c-9.4,0-17-7.6-17-17s7.6-17,17-17s17,7.6,17,17S265,68.1,255.6,68.1z"></path>
                                                <path fill="#FFFFFF" d="M255.6,35.2c8.8,0,16,7.1,16,16s-7.2,16-16,16c-8.8,0-16-7.1-16-16S246.8,35.2,255.6,35.2 M255.6,33.2
                c-9.9,0-18,8.1-18,18s8.1,18,18,18s18-8.1,18-18S265.5,33.2,255.6,33.2L255.6,33.2z"></path>
                                            </g>
                                            <rect x="251.4" y="58.8" fill="#614832" width="7.8" height="6.3"></rect>
                                            <path fill="#7A5B3F" d="M262.2,46.8c-0.8-1.4-2.7-3-6.6-3c-0.1,0-0.2,0-0.2,0c-2.2,0-5.2,0.5-6.8,3c-1,1.6-1,3-1,3.1s0,2.5,1,5.1
            c1.3,3.4,3.7,5.2,6.9,5.2c3.2,0,5.6-1.8,6.9-5.2c0.9-2.5,1-4.9,1-5C263.2,49.9,263.2,48.4,262.2,46.8z"></path>
                                            <g>
                                                <circle fill="#443124" cx="251.9" cy="52.8" r="0.9"></circle>
                                            </g>
                                            <g>
                                                <circle fill="#443124" cx="258.8" cy="52.8" r="0.9"></circle>
                                            </g>
                                            <g>
                                                <path fill="#020202" d="M261.9,59.1c1.3,0,2.9-6.1,2.7-10.4c-0.6-4.7-3-6.5-4.7-7.1c-2.8-1.1-6.1-1.3-9.1,0.1
                c-1.9,0.9-3.9,2.7-4.7,6.8c-0.7,3.5,1.6,10.5,3.5,10.5c0.3,0-0.6-2.6-0.7-5.2c-0.1-2.8,0.5-5.8,1-5.8c0.7,0,0.3,2.3,1.2,2.3
                c3.5,0,5.6,0,8.1,0c0.9,0,0.5-2.3,1.1-2.3c0.4,0,1,3,1,5.8C261.3,56.1,261.9,59.1,261.9,59.1z"></path>
                                            </g>
                                            <path fill="#848DC5" d="M259.4,60.8c-0.1,0-0.5,2.7-4,2.7c-3.5,0-3.9-2.7-4-2.7c-3.2,0-4.6,1.7-5.4,3.2c2.7,2,6,3.2,9.6,3.2
            c3.4,0,6.6-1.1,9.3-2.9C264.2,62.7,262.7,60.8,259.4,60.8z"></path>
                                        </g>
                                        <path fill="#443124" d="M257.7,56.2c-0.1-0.2-0.2-0.2-0.3-0.2h-4c-0.2,0-0.3,0.1-0.3,0.2c-0.1,0.2,0,0.2,0.1,0.4l2,1.5
        c0.1,0.1,0.2,0.1,0.2,0.1c0.1,0,0.2,0,0.2-0.1l2.1-1.5C257.7,56.5,257.8,56.4,257.7,56.2z"></path>
                                    </g>
                                </svg>
                            </div>
                            <Link className="button small inverse" to="/resume">Register your CV</Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
      </Content>
      <Footer/>
      <div className="sticky-ctas left">
            <Link
              to="/resume"
              data-src="/static/images/up_r.png"
              className="sticky-button-reg">
              <img src="/static/images/up_r.png"/>
            </Link>
        </div>
        <div className="sticky-ctas right">
            <Link
              to="/find-resume"
              data-src="/static/images/hiring_btn.png"
              className="sticky-button-recruit">
              <img src="/static/images/hiring_btn.png"/>
            </Link>
        </div>
      </section>
    );
  }
}

export default Home;