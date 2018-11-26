import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initResume, enableSection, disableSection, addSubField, removeFieldAt, editFieldAt } from '#app/routes/resume/actions';
import { Button, Checkbox, Collapse, Col, Switch, Radio } from 'antd';
import { keys } from '#app/routes/resume/reducer';
import { setPreviewResume } from '#app/routes/preview-resume/actions';
import { cleanResume, objectEmpty, buildResume } from '#app/util/resume';
import clone from 'lodash/cloneDeep';
import { getAuthenticatedUser } from '#app/common/actions/Auth';
import { provideHooks } from 'redial';
import RequireAuthentication from '#app/common/components/AuthenticatedComponent';
import classnames from 'classnames';
import { editResume } from './actions';
import MiniFooter from '#app/common/components/MiniFooter';
import ListInput from '#app/common/components/ListInput';
import { logout } from '#app/common/actions/Auth';
import Input from '#app/common/components/Input';
import Link from 'react-router/lib/Link';

const RadioGroup = Radio.Group;

class Me extends PureComponent {
  componentWillMount() {
    const { user, dispatch, resume, isAuthenticated } = this.props;

    if (isAuthenticated && user && typeof user.signup_stage == 'number' && user.signup_stage !== 10 ) {
      this.goToRegister({inc: true});
    }

    if (user && user.resume && this.isResumeEmpty(resume) && !this.isResumeEmpty(user.resume)) {
      dispatch(initResume(user.resume));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, user } = nextProps;

    if (isAuthenticated && user && typeof user.signup_stage == 'number' && user.signup_stage !== 10 ) {
      this.goToRegister({inc: true});
    }
  }

  onFieldChange = (evt) => {
    const { dispatch } = this.props;
    dispatch(editFieldAt(evt.target.dataset.group, evt.target.name, evt.target.value, evt.target.dataset.index));
  };

  onCheckChange = (evt) => {
    const { dispatch } = this.props;
    dispatch(editFieldAt(evt.target.group, evt.target.name, !evt.target.value));
  };

  onRadioChange = (evt) => {
    const { dispatch } = this.props;
    dispatch(editFieldAt(evt.target.group, evt.target.name, evt.target.value));
  };

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

  previewDocument = () => {
    const { goToUrl, resume } = this.props;
    goToUrl('preview', {}, { resume });
  };

  isResumeEmpty = (resume) => {
    if (typeof resume == 'undefined') return true;
    if (typeof resume == 'object' && typeof resume.basics == 'object' && resume.basics.email == '') return true;
    if (!resume || (typeof resume == 'object' && Object.keys(resume).length == 0)) return true;
    const copy = clone(resume);
    return objectEmpty(cleanResume(copy));
  };

  submitForm = (evt) => {
    evt.preventDefault();
    const { resume, user, dispatch } = this.props;
    dispatch(editResume(user.ID, cleanResume(resume)));
  };

  logout = () => {
    const { dispatch } = this.props;
    dispatch(logout());
  };

  goToRegister = (query) => {
    const { goToUrl } = this.props;
    goToUrl('/resume', query);
  };

  render() {
    const { resume, active, user, waiting, isMobile, isAuthenticated } = this.props;
    // const isResumeEmpty = this.isResumeEmpty(resume);

    return (
      (() => {
          if (!isAuthenticated) {
            // page most definitely wont reach here..but just in case
            return (
              <div className="wrapper">
                <div className="margin-top-20 padding-20 text-centered">
                  <span className="title color-red">You are unauthorized to visit page</span>
                  <div className="padding-top-50"></div>
                  <MiniFooter isMobile={isMobile} />
                </div>
              </div>
            );
          } else if (isAuthenticated && user && !user.activated) {
            return (
              <div className="wrapper">
                <div className="margin-top-20 padding-20">
                  <span className="title color-red">Your account is not activated.</span>
                  <span className="display-inline-block margin-top-10">
                    Didn't receive mail?&nbsp;&nbsp;
                    <Button onClick={() => {}}>Request Activation Email</Button>
                  </span>
                  <div className="padding-top-50"></div>
                  <MiniFooter isMobile={isMobile} />
                </div>
              </div>
            );
          } else if (isAuthenticated && user && user.activated) {
            if (isMobile) {
              return (
                <div>
                  <form name="resume" onSubmit={this.submitForm}>
                    <div className="ui-row margin-bottom-20 margin-top-20">
                      <div className="col-24">
                        <label>
                          <em>Your Profile:</em>
                        </label>
                      </div>
                    </div>
                    <div className="ui-row margin-top-10">
                      <div className="col-24 clearfix">
                        <label className="left">
                          <em>Views:</em>
                        </label>
                        <label className="right">
                          <em>{user.viewed}</em>
                        </label>
                      </div>
                    </div>
                    <div className="ui-row margin-bottom-10">
                      <div className="col-24 clearfix">
                        <label className="left">
                          <em>Downloads:</em>
                        </label>
                        <label className="right">
                          <em>{user.downloaded}</em>
                        </label>
                      </div>
                    </div>
                    <div className="margin-top-10 margin-bottom-10 text-centered">
                      <Link to="/preview">
                        Preview
                      </Link>
                    </div>
                    <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="right">
                            Basic Information
                          </label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            data-group="basics"
                            name="name"
                            id="name"
                            type="text"
                            value={resume.basics.name}
                          />
                          <label placeholder="Name"></label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            data-group="basics"
                            name="dob"
                            id="dob"
                            type="text"
                            value={resume.basics.dob}
                          />
                          <label placeholder="Date of Birth"></label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            name="address"
                            data-group="basics"
                            id="address"
                            type="text"
                            value={resume.basics.address}
                          />
                          <label placeholder="Address"></label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            name="email"
                            data-group="basics"
                            id="email"
                            type="text"
                            value={resume.basics.email}
                          />
                          <label placeholder="Email"></label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            name="phone"
                            data-group="basics"
                            id="phone"
                            type="text"
                            value={resume.basics.phone}
                          />
                          <label placeholder="Telephone"></label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            placeholder="Accra"
                            name="location"
                            data-group="basics"
                            id="location"
                            type="text"
                            value={resume.basics.location}
                          />
                          <label placeholder="Town/City"></label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <textarea
                            data-gramm_editor="false"
                            onChange={this.onFieldChange}
                            name="personalStatement"
                            id="personalStatement"
                            data-group="basics"
                            type="text"
                            maxLength="4000"
                            className="width-100p"
                            value={resume.basics.personalStatement}
                          />
                          <label placeholder="Personal Statement"></label>
                        </div>
                      </div>
                      <div className="ui-row">
                        <div className="col-24 clearfix">
                          <label className="required-fields right">
                            * <em>Job Details</em>
                          </label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            placeholder="Architect"
                            data-group="basics"
                            name="jobTitle"
                            id="jobTitle"
                            type="text"
                            value={resume.basics.jobTitle}
                            required
                          />
                          <label placeholder="Job Title"></label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="right">
                            Preferences
                          </label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <select
                            data-group="preferences"
                            id="jobSector" name="jobSector"
                            onChange={this.onFieldChange}
                            value={resume.preferences.jobSector}
                            className="control-select">
                            <option selected value="banking">Banking</option>
                            <option value="construction">Construction</option>
                            <option value="catering">Catering</option>
                            <option value="technology">Technology</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="media">Media</option>
                            <option value="other">Other</option>
                          </select>
                          <label placeholder="Job Sector*"></label>
                        </div>
                      </div>
                      {
                        resume.preferences.jobSector == "other" &&
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              name="jobSectorAlt"
                              placeholder="enter job sector"
                              data-group="preferences"
                              id="jobSectorAlt"
                              type="text"
                              value={resume.preferences.jobSectorAlt}
                            />
                            <label placeholder="Specify Job Sector"></label>
                          </div>
                        </div>
                      }
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <select
                              data-group="preferences"
                              id="level"
                              name="level"
                              value={resume.preferences.level || "entry"}
                              onChange={this.onFieldChange}>
                              <option value="entry">Entry</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="senior">Senior</option>
                            </select>
                            <label placeholder="Level*"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <select
                              id="salaryExpectation"
                              data-group="preferences"
                              name="salaryExpectation"
                              value={resume.preferences.salaryExpectation || "1000-2000"}
                              onChange={this.onFieldChange}
                              className="control-select">
                                <option value="1000-2000">GHC1000-GHC2000</option>
                                <option value="2000-3000">GHC2000-GHC3000</option>
                                <option value="3000-*">GHC3000 or Above</option>
                            </select>
                            <label placeholder="Salary Expectation*"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <select
                              data-group="preferences"
                              id="location" name="location"
                              onChange={this.onFieldChange}
                              value={resume.preferences.location || "greater accra"}
                              className="control-select">
                              <option value="greater accra">Greater Accra</option>
                              <option value="eastern region">Eastern Region</option>
                              <option value="central region">Central Region</option>
                              <option value="Ashanti region">Ashanti Region</option>
                              <option value="western region">Western Region</option>
                              <option value="brong ahafo">Brong Ahafo Region</option>
                              <option value="upper east region">Upper East Region</option>
                              <option value="upper west region">Upper West Region</option>
                              <option value="volta region">Volta Region</option>
                              <option value="northern region">Northern Region</option>
                            </select>
                            <label placeholder="Location*"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <select
                              data-group="preferences"
                              id="jobType"
                              name="jobType"
                              onChange={this.onFieldChange}
                              value={resume.preferences.jobType || "full-time"}
                              className="control-select">
                              <option value="full-time">Full Time</option>
                              <option value="permanent">Permanent</option>
                              <option value="temporary">Temporary</option>
                              <option value="contract">Contract</option>
                              <option value="internship">Internship</option>
                            </select>
                            <label placeholder="Job Type*"></label>
                          </div>
                        </div>
                      </div>
                      <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="right">Work Experience</label>
                        </div>
                      </div>
                      {
                        Array.isArray(resume.work) &&
                        resume.work.map((entry, index) => (
                          <div key={index} className={classnames({
                              "padding-top-10": (index == 0),
                              "padding-top-40": (index > 0),
                              "border-top": index > 0,
                              "padding-bottom-40": (index > 0 && Array.isArray(resume.work) && index + 1 != resume.work.length),
                              "padding-bottom-20": (index == 0 || (Array.isArray(resume.work) && index + 1 == resume.work.length)),
                            })}>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="work"
                                    data-index={index}
                                    name="role"
                                    id="role"
                                    type="text"
                                    value={entry.role}
                                  />
                                  <label placeholder="Role*"></label>
                                </div>
                              </div>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="work"
                                    data-index={index}
                                    name="company"
                                    id="company"
                                    type="text"
                                    value={entry.company}
                                  />
                                  <label placeholder="Company*"></label>
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24 clearfix">
                                  <label className="required-fields right">
                                    Time/Period
                                  </label>
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24">
                                  <label className="required-fields">
                                    From
                                  </label>
                                </div>
                              </div>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="work"
                                    data-index={index}
                                    name="startDate"
                                    id="startDate"
                                    type="text"
                                    value={entry.startDate}
                                  />
                                  <label placeholder="2012"></label>
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24">
                                  <label className="required-fields">
                                    To
                                  </label>
                                </div>
                              </div>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="work"
                                    data-index={index}
                                    name="endDate"
                                    id="endDate"
                                    type="text"
                                    value={entry.endDate}
                                  />
                                  <label placeholder="2016"></label>
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24 clearfix">
                                  <label className="required-fields right">
                                    Duties
                                  </label>
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24">
                                  <ListInput
                                     field="work"
                                     keyName="duties"
                                     index={index}
                                     onEdit={bindActionCreators(editFieldAt, this.props.dispatch)}
                                     data={entry.duties}
                                     placeholder="type duty"
                                     single="duty"
                                     isMobile
                                     inputWrapperClassName=""
                                  />
                                </div>
                              </div>        
                               {
                                index != 0 &&
                                <div className="margin-top-10 clear">
                                  <Button className="margin-left-15" icon="minus" onClick={() => this.removeSubField('work', index)}>Remove Entry</Button>
                                </div>
                               }
                          </div>
                        ))
                      }
                      <div className="ui-row">
                        <div className="col-24 clearfix">
                          <Button className="right" icon="add" onClick={() => this.addField('work')}>
                            Add Work Experience
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24">
                          <h2>Education</h2>
                        </div>
                      </div>
                      {
                        Array.isArray(resume.education) &&
                        resume.education.map((entry, index) => (
                            <div
                              key={index}
                              className={classnames({
                              "padding-top-10": (index == 0),
                              "padding-top-40": (index > 0),
                              "border-top": index > 0,
                              "padding-bottom-40": (index > 0 && Array.isArray(resume.education) && index + 1 != resume.education.length),
                              "padding-bottom-20": (index == 0 || (Array.isArray(resume.education) && index + 1 == resume.education.length)),
                            })}>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="education"
                                    data-index={index}
                                    name="institution"
                                    id="institution"
                                    type="text"
                                    value={entry.institution}
                                  />
                                  <label placeholder="Institution"></label>
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24 clearfix">
                                  <label className="required-fields right">
                                    Year
                                  </label>
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24 clearfix">
                                  <label className="required-fields left">
                                    From
                                  </label>
                                </div>
                              </div>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="education"
                                    data-index={index}
                                    name="startDate"
                                    id="startDate"
                                    type="text"
                                    value={entry.startDate}
                                  />
                                </div>
                              </div>
                              <div className="ui-row">
                                <div className="col-24 clearfix">
                                  <label className="required-fields left">
                                    To
                                  </label>
                                </div>
                              </div>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="education"
                                    data-index={index}
                                    name="endDate"
                                    id="endDate"
                                    type="text"
                                    value={entry.endDate}
                                  />
                                </div>
                              </div>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="education"
                                    data-index={index}
                                    name="qualification"
                                    id="qualification"
                                    type="text"
                                    value={entry.qualification}
                                  />
                                  <label placeholder="Qualification"></label>
                                </div>
                              </div>
                              {
                                index != 0 &&
                                <div className="margin-top-10 clear">
                                  <Button className="margin-left-15" icon="minus" onClick={() => this.removeSubField('education', index)}>Remove Entry</Button>
                                </div>
                              }
                          </div>
                        ))
                      }
                      <div className="ui-row">
                        <div className="col-24 clearfix">
                          <Button className="right" icon="add" onClick={() => this.addField('education')}>
                            Add School
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="required-fields right">Competencies</label>
                        </div>
                      </div>
                      <div className="ui-row">
                        <div className="col-24">
                          <ListInput
                           field="competency"
                           keyName={undefined}
                           index={-1}
                           onEdit={bindActionCreators(editFieldAt, this.props.dispatch)}
                           data={resume.competencies}
                           placeholder="Team work"
                           single="competency"
                           inputWrapperClassName=""
                           isMobile
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="right">Skills</label>
                        </div>
                      </div>
                      {
                        Array.isArray(resume.skills) &&
                        resume.skills.map((entry, index) => (
                          <div key={index} className={classnames({
                              "padding-top-10": (index == 0),
                              "padding-top-40": (index > 0),
                              "border-top": index > 0,
                              "padding-bottom-40": (index > 0 && Array.isArray(resume.skills) && index + 1 != resume.skills.length),
                              "padding-bottom-20": (index == 0 || (Array.isArray(resume.skills) && index + 1 == resume.skills.length)),
                            })}>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="skill"
                                    data-index={index}
                                    name="name"
                                    id="name"
                                    type="text"
                                    value={entry.name}
                                  />
                                  <label placeholder="Name"></label>
                                </div>
                              </div>
                              <div className="ui-row margin-bottom-20">
                                <div className="col-24">
                                  <select
                                    data-group="skill"
                                    data-index={index}
                                    id="level"
                                    name="level"
                                    onChange={this.onFieldChange}
                                    value={entry.level || "proficient"}
                                    className="control-select">
                                    <option value="proficient">Proficient</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="beginner">Beginner</option>
                                  </select>
                                  <label placeholder="Level"></label>
                                </div>
                              </div>
                              {
                                index != 0 &&
                                <div className="margin-top-10 clear">
                                  <Button className="margin-left-15" icon="minus" onClick={() => this.removeSubField('skill', index)}>Remove Entry</Button>
                                </div>
                              }
                            </div>
                        ))
                      }
                      <div className="ui-row">
                        <div className="col-24 clearfix">
                          <Button className="right" icon="add" onClick={() => this.addField('skills')}>
                            Add Skill
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="right">Awards/Accomplishments</label>
                        </div>
                      </div>
                      {
                        Array.isArray(resume.awards) &&
                        resume.awards.map((entry, index) => (
                          <div key={index} className={classnames({
                            "padding-top-10": (index == 0),
                            "padding-top-40": (index > 0),
                            "border-top": index > 0,
                            "padding-bottom-40": (index > 0 && Array.isArray(resume.awards) && index + 1 != resume.awards.length),
                            "padding-bottom-20": (index == 0 || (Array.isArray(resume.awards) && index + 1 == resue.awards.length)),
                          })}>
                            <div className="ui-row margin-bottom-20">
                              <div className="col-24">
                                <Input
                                  onChange={this.onFieldChange}
                                  data-group="awards"
                                  data-index={index}
                                  name="title"
                                  id="title"
                                  type="text"
                                  value={entry.title}
                                />
                                <label placeholder="Title"></label>
                              </div>
                            </div>
                            <div className="ui-row margin-bottom-20">
                              <div className="col-24">
                                <Input
                                  onChange={this.onFieldChange}
                                  data-group="awards"
                                  data-index={index}
                                  name="year"
                                  id="year"
                                  type="text"
                                  value={entry.year}
                                />
                                <label placeholder="Year"></label>
                              </div>
                            </div>
                            {
                              index != 0 &&
                              <div className="margin-top-10 clear">
                                <Button className="margin-left-15" icon="minus" onClick={() => this.removeSubField('award', index)}>Remove Entry</Button>
                              </div>
                            }
                          </div>
                        ))
                      }
                      <div className="ui-row">
                        <div className="col-24 clearfix">
                          <Button className="right" icon="add" onClick={() => this.addField('awards')}>
                            Add Award
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="right">Certifications</label>
                        </div>
                      </div>
                      <div className="ui-row">
                        <div className="col-24">
                          <ListInput
                             field="certification"
                             keyName={undefined}
                             index={-1}
                             onEdit={bindActionCreators(editFieldAt, this.props.dispatch)}
                             inputWrapperClassName=""
                             data={resume.certifications}
                             placeholder="ACCA, ACAMS..."
                             single="certification"
                             isMobile
                          />
                        </div>
                      </div>
                    </div>
                    <div className="clearfix">
                      <div className="ui-row margin-bottom-20 margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="right">Referees</label>
                        </div>
                      </div>
                      <div className="ui-row">
                        <div className="col-24 clearfix">
                          <label className="required-fields right">
                            Academic
                          </label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24">
                          <Input
                            onChange={this.onFieldChange}
                            name="academic.name"
                            data-group="referees"
                            id="academic.name"
                            type="text"
                            value={resume.referees.academic.name}
                          />
                          <label placeholder="Name"></label>
                        </div>
                      </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              name="academic.position"
                              data-group="referees"
                              id="academic.position"
                              type="text"
                              value={resume.referees.academic.position}
                            />
                            <label placeholder="Position"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              name="academic.institution"
                              data-group="referees"
                              id="academic.name"
                              type="text"
                              value={resume.referees.academic.institution}
                            />
                            <label placeholder="Institution"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              name="academic.telephone"
                              data-group="referees"
                              id="academic.telephone"
                              type="text"
                              value={resume.referees.academic.telephone}
                            />
                            <label placeholder="Telephone"></label>
                          </div>
                        </div>
                        <div className="ui-row">
                          <div className="col-24 clearfix">
                            <label className="required-fields right">
                              Employment
                            </label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              data-group="referees"
                              name="employment.name"
                              id="employment.name"
                              type="text"
                              value={resume.referees.employment.name}
                            />
                            <label placeholder="Name"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              name="employment.company"
                              id="employment.company"
                              data-group="referees"
                              type="text"
                              value={resume.referees.employment.company}
                            />
                            <label placeholder="Company"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              data-group="referees"
                              name="employment.telephone"
                              id="employment.telephone"
                              type="text"
                              value={resume.referees.employment.telephone}
                            />
                            <label placeholder="Telephone"></label>
                          </div>
                        </div>
                        <div className="ui-row">
                          <div className="col-24 clearfix">
                            <label className="required-fields right">
                              Character
                            </label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              name="character.name"
                              data-group="referees"
                              id="character.name"
                              type="text"
                              value={resume.referees.character.name}
                            />
                            <label placeholder="Name"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              name="character.position"
                              data-group="referees"
                              id="character.position"
                              type="text"
                              value={resume.referees.character.position}
                            />
                            <label placeholder="Position"></label>
                          </div>
                        </div>
                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <Input
                              onChange={this.onFieldChange}
                              data-group="referees"
                              name="character.telephone"
                              id="character.telephone"
                              type="text"
                              value={resume.referees.character.telephone}
                            />
                            <label placeholder="Telephone"></label>
                          </div>
                        </div>
                    </div>
                    <div>
                      <div className="ui-row margin-top-20">
                        <div className="col-24 clearfix">
                          <label className="required-fields right">Privacy</label>
                        </div>
                      </div>
                      <div className="ui-row margin-bottom-20">
                        <div className="col-24 clearfix">
                          <RadioGroup name="public" onChange={this.onRadioChange} value={resume.meta.public}>
                              <Radio group="meta" className="display-block" value={false}>private</Radio>
                              <Radio group="meta" className="display-block" value={true}>public</Radio>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="ui-row">
                        <div className="col-24">
                          <Checkbox group="meta" name="signMeUpForUpdates" className="control-input" onChange={this.onCheckChange} checked={resume.meta.signMeUpForUpdates}>
                            Sign me up for mail updates
                          </Checkbox>
                        </div>
                      </div>
                    </div>
                    <div className="margin-bottom-50"></div>
                    <div className="ui-row margin-bottom-20">
                      <div className="col-24">
                        <button
                          type="submit"
                          className="margin-top-30 width-100p button-height display-block sc-button sc-button-accent sc-button-color">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="ui-row margin-bottom-20">
                    <div className="col-24">
                      <a href="/api/v1/users/logout">
                        <button
                          className="width-100p button-height display-block sc-button">
                          Logout
                        </button>
                      </a>
                    </div>
                  </div>
                  <div className="padding-top-20"></div>
                  <MiniFooter isMobile={isMobile} />
                </div>
              );
            } else {
              return (
                <div className="cv-builder">
                  <div className="fc">
                    <div className="page-content content-wrapper">
                      <form name="resume" className="basic-information margin-side-auto" onSubmit={this.submitForm}>
                        <div>
                          <h2 className="title">
                            Your Profile:
                          </h2>
                        </div>
                        <div className="ui-row margin-top-10">
                            <label className="control-label">
                              <em>Views:</em>
                            </label>
                            <em className="margin-left-10">{user.viewed}</em>
                        </div>
                        <div className="ui-row margin-bottom-10">
                          <label className="control-label">
                            <em>Downloads:</em>
                          </label>
                          <em className="margin-left-10">{user.downloaded}</em>
                        </div>
                        <div className="margin-top-20 margin-bottom-20 text-centered">
                          <Link to="/preview">
                            Preview
                          </Link>
                        </div>
                        <div>
                          <div className="ui-row margin-bottom-20 margin-top-20">
                            <div className="col-24 clearfix">
                              <label className="right">
                                Basic Information
                              </label>
                            </div>
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="name">
                              Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              data-group="basics"
                              className="control-input"
                              type="text"
                              onChange={this.onFieldChange}
                              value={resume.basics.name}
                            />
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="dob">
                              Date of Birth
                            </label>
                            <Input
                              id="dob"
                              data-group="basics"
                              placeholder="25th April, 1987"
                              name="dob"
                              className="control-input"
                              type="text"
                              onChange={this.onFieldChange}
                              value={resume.basics.dob}
                              />
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="address">
                              Address
                            </label>
                            <Input
                              id="address"
                              name="address"
                              data-group="basics"
                              placeholder="P.O.Box 42 ..."
                              className="control-input margin-bottom-5"
                              type="text"
                              onChange={this.onFieldChange}
                              value={resume.basics.address}
                            />
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="email">
                              Email
                            </label>
                            <Input
                              id="email"
                              name="email"
                              data-group="basics"
                              className="control-input"
                              type="text"
                              onChange={this.onFieldChange}
                              value={resume.basics.email}
                            />
                          </div>
                          <div className="margin-bottom-20 clear">
                            <label className="control-label" htmlFor="phone">
                              Telephone
                            </label>
                            <Input
                              onChange={this.onFieldChange}
                              name="phone"
                              data-group="basics"
                              id="phone"
                              type="text"
                              value={resume.basics.phone}
                              className="control-input"
                            />
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="phone">
                              Town/City
                            </label>
                            <Input
                              id="location"
                              name="location"
                              className="control-input"
                              data-group="basics"
                              placeholder="Accra"
                              type="text"
                              onChange={this.onFieldChange}
                              value={resume.basics.location}
                            />
                          </div>
                          <div className="margin-bottom-20 clear">
                            <label className="control-label">Personal Statement</label>
                            <textarea
                              data-gramm_editor="false"
                              onChange={this.onFieldChange}
                              name="personalStatement"
                              id="personalStatement"
                              data-group="basics"
                              type="text"
                              maxLength="4000"
                              className="control-input"
                              rows="5"
                              value={resume.basics.personalStatement}
                            />
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="required-fields control-label">
                              <em>Job Details</em>
                            </label>
                          </div>

                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="jobTitle">
                              Job Title
                            </label>
                            <Input
                              id="jobTitle"
                              name="jobTitle"
                              className="control-input"
                              data-group="basics"
                              placeholder="Architect"
                              type="text"
                              onChange={this.onFieldChange}
                              value={resume.basics.jobTitle}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="ui-row margin-bottom-20 margin-top-20">
                            <div className="col-24 clearfix">
                              <label className="right">
                                Preferences
                              </label>
                            </div>
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label">Job Sector</label>
                            <Input
                              onChange={this.onFieldChange}
                              name="jobSector"
                              data-group="preferences"
                              id="jobSector"
                              type="text"
                              className="control-input"
                              value={resume.preferences.jobSector}
                            />
                          </div>
                            <div className="margin-top-10 clear">
                              <label className="control-label">Level</label>
                              <select
                                data-group="preferences"
                                id="level"
                                name="level"
                                className="control-select"
                                value={resume.preferences.level || "entry"}
                                onChange={this.onFieldChange}>
                                <option value="entry">Entry</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="senior">Senior</option>
                              </select>
                            </div>
                            <div className="margin-top-10 clear">
                              <label className="control-label">Salary Expectation</label>
                              <select
                                id="salaryExpectation"
                                data-group="preferences"
                                name="salaryExpectation"
                                value={resume.preferences.salaryExpectation || "1000-2000"}
                                onChange={this.onFieldChange}
                                className="control-select">
                                  <option value="0-1000">GHC0-GHC1000</option>
                                  <option value="1000-2000">GHC1000-GHC2000</option>
                                  <option value="2000-3000">GHC2000-GHC3000</option>
                                  <option value="3000-*">GHC3000 or Above</option>
                              </select>
                            </div>
                            <div className="margin-top-10 clear">
                              <label className="control-label">Location</label>
                              <select
                                data-group="preferences"
                                id="location" name="location"
                                onChange={this.onFieldChange}
                                value={resume.preferences.location || "greater accra"}
                                className="control-select">
                                <option value="greater accra">Greater Accra</option>
                                <option value="eastern region">Eastern Region</option>
                                <option value="central region">Central Region</option>
                                <option value="Ashanti region">Ashanti Region</option>
                                <option value="western region">Western Region</option>
                                <option value="brong ahafo">Brong Ahafo Region</option>
                                <option value="upper east region">Upper East Region</option>
                                <option value="upper west region">Upper West Region</option>
                                <option value="volta region">Volta Region</option>
                                <option value="northern region">Northern Region</option>
                              </select>
                            </div>
                            <div className="margin-top-10 clear">
                              <label className="control-label">Job Type</label>
                              <select
                                data-group="preferences"
                                id="jobType"
                                name="jobType"
                                onChange={this.onFieldChange}
                                value={resume.preferences.jobType || "full-time"}
                                className="control-select">
                                <option value="full-time">Full Time</option>
                                <option value="permanent">Permanent</option>
                                <option value="temporary">Temporary</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                              </select>
                            </div>
                          </div>
                          <div>
                          <div className="margin-top-20 margin-bottom-10 clear">
                            <div className="col-24 clearfix">
                              <label className="right">Work Experience</label>
                            </div>
                          </div>
                          {
                            Array.isArray(resume.work) &&
                            resume.work.map((entry, index) => (
                              <div key={index} className={classnames({
                                  "padding-top-10": (index == 0),
                                  "padding-top-40": (index > 0),
                                  "border-top": index > 0,
                                  "padding-bottom-40": (index > 0 && Array.isArray(resume.work) && index + 1 != resume.work.length),
                                  "padding-bottom-20": (index == 0 || (Array.isArray(resume.work) && index + 1 == resume.work.length)),
                                })}>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">Role</label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      className="control-input"
                                      data-group="work"
                                      data-index={index}
                                      name="role"
                                      id="role"
                                      type="text"
                                      value={entry.role}
                                    />
                                  </div>
                                  <div className="margin-top-10 clear">
                                      <label className="control-label">Company</label>
                                      <Input
                                        onChange={this.onFieldChange}
                                        className="control-input"
                                        data-group="work"
                                        data-index={index}
                                        name="company"
                                        id="company"
                                        type="text"
                                        value={entry.company}
                                      />
                                  </div>
                                  <div className="margin-top-20 margin-bottom-20 clearfix">
                                    <label className="control-label">
                                      Time/Period
                                    </label>
                                  </div>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">
                                      From
                                    </label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      className="control-input"
                                      data-group="work"
                                      data-index={index}
                                      name="startDate"
                                      id="startDate"
                                      type="text"
                                      value={entry.startDate}
                                    />
                                  </div>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">
                                      To
                                    </label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      className="control-input"
                                      data-group="work"
                                      data-index={index}
                                      name="endDate"
                                      id="endDate"
                                      type="text"
                                      value={entry.endDate}
                                    />
                                  </div>
                                  <div className="margin-top-20 clear">
                                    <label className="control-label" htmlFor="full-name">
                                      Duties
                                    </label>
                                    <ListInput
                                       field="work"
                                       keyName="duties"
                                       index={index}
                                       onEdit={bindActionCreators(editFieldAt, this.props.dispatch)}
                                       data={entry.duties}
                                       placeholder="type duty"
                                       single="duty"
                                    />
                                  </div>        
                                   {
                                    index != 0 &&
                                    <div className="margin-top-10 clearfix">
                                      <Button className="right" icon="minus" onClick={() => this.removeSubField('work', index)}>Remove Entry</Button>
                                    </div>
                                   }
                              </div>
                            ))
                          }
                          <div className="ui-row">
                            <div className="col-24 clearfix">
                              <Button className="right" icon="add" onClick={() => this.addField('work')}>
                                Add Work Experience
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="margin-top-20 clear">
                            <div className="col-24 clearfix">
                              <label className="right">Education</label>
                            </div>
                          </div>
                          {
                            Array.isArray(resume.education) &&
                            resume.education.map((entry, index) => (
                                <div
                                  key={index}
                                  className={classnames({
                                  "padding-top-10": (index == 0),
                                  "padding-top-40": (index > 0),
                                  "border-top": index > 0,
                                  "padding-bottom-40": (index > 0 && Array.isArray(resume.education) && index + 1 != resume.education.length),
                                  "padding-bottom-20": (index == 0 || (Array.isArray(resume.education) && index + 1 == resume.education.length)),
                                })}>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">Institution</label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      data-group="education"
                                      data-index={index}
                                      name="institution"
                                      id="institution"
                                      className="control-input"
                                      type="text"
                                      value={entry.institution}
                                    />
                                  </div>
                                  <div className="margin-top-20 margin-bottom-20 clearfix">
                                    <label className="control-label">
                                      Year
                                    </label>
                                  </div>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">From</label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      className="control-input"
                                      data-group="work"
                                      data-index={index}
                                      name="startDate"
                                      id="startDate"
                                      type="text"
                                      value={entry.startDate}
                                    />
                                  </div>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">To</label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      className="control-input"
                                      data-group="work"
                                      data-index={index}
                                      name="startDate"
                                      id="startDate"
                                      type="text"
                                      value={entry.startDate}
                                    />
                                  </div>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">Qualification</label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      data-group="education"
                                      data-index={index}
                                      name="qualification"
                                      id="qualification"
                                      type="text"
                                      className="control-input"
                                      value={entry.qualification}
                                    />
                                  </div>
                                  {
                                    index != 0 &&
                                    <div className="margin-top-10 clearfix">
                                      <Button className="right" icon="minus" onClick={() => this.removeSubField('education', index)}>Remove Entry</Button>
                                    </div>
                                  }
                              </div>
                            ))
                          }
                          <div className="ui-row">
                            <div className="col-24 clearfix">
                              <Button className="right" icon="add" onClick={() => this.addField('education')}>
                                Add School
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="margin-top-20 clear">
                            <div className="col-24 clearfix">
                              <label className="right">Competencies</label>
                            </div>
                          </div>
                          <div className="ui-row">
                            <div className="col-24">
                              <ListInput
                               field="competency"
                               keyName={undefined}
                               index={-1}
                               onEdit={bindActionCreators(editFieldAt, this.props.dispatch)}
                               data={resume.competencies}
                               placeholder="Team work"
                               single="competency"
                               inputWrapperClassName=""
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="margin-top-20 clear">
                            <div className="col-24 clearfix">
                              <label className="right">Skills</label>
                            </div>
                          </div>
                          {
                            Array.isArray(resume.skills) &&
                            resume.skills.map((entry, index) => (
                              <div key={index} className={classnames({
                                  "padding-top-10": (index == 0),
                                  "padding-top-40": (index > 0),
                                  "border-top": index > 0,
                                  "padding-bottom-40": (index > 0 && Array.isArray(resume.skills) && index + 1 != resume.skills.length),
                                  "padding-bottom-20": (index == 0 || (Array.isArray(resume.skills) && index + 1 == resume.skills.length)),
                                })}>
                                  <div className="margin-top-10 clear">
                                    <label className="control-label">Name</label>
                                    <Input
                                      onChange={this.onFieldChange}
                                      className="control-input"
                                      data-group="skill"
                                      data-index={index}
                                      name="name"
                                      id="name"
                                      type="text"
                                      value={entry.name}
                                    />
                                  </div>
                                  <div className="margin-top-10 claer margin-bottom-20">
                                    <label className="control-label">Level</label>
                                    <select
                                      data-group="skill"
                                      data-index={index}
                                      id="level"
                                      name="level"
                                      onChange={this.onFieldChange}
                                      value={entry.level || "proficient"}
                                      className="control-select">
                                      <option value="proficient">Proficient</option>
                                      <option value="advanced">Advanced</option>
                                      <option value="intermediate">Intermediate</option>
                                      <option value="beginner">Beginner</option>
                                    </select>
                                  </div>
                                  {
                                    index != 0 &&
                                    <div className="margin-top-10 clearfix">
                                      <Button className="right" icon="minus" onClick={() => this.removeSubField('skill', index)}>Remove Entry</Button>
                                    </div>
                                  }
                                </div>
                            ))
                          }
                          <div className="margin-top-10 clear">
                            <div className="col-24 clearfix">
                              <Button className="right" icon="add" onClick={() => this.addField('skills')}>
                                Add Skill
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="margin-top-20 margin-bottom-10 clear">
                            <div className="col-24 clearfix">
                              <label className="right">Awards/Accomplishments</label>
                            </div>
                          </div>
                          {
                            Array.isArray(resume.awards) &&
                            resume.awards.map((entry, index) => (
                              <div key={index} className={classnames({
                                "padding-top-10": (index == 0),
                                "padding-top-40": (index > 0),
                                "border-top": index > 0,
                                "padding-bottom-40": (index > 0 && Array.isArray(resume.awards) && index + 1 != resume.awards.length),
                                "padding-bottom-20": (index == 0 || (Array.isArray(resume.awards) && index + 1 == resue.awards.length)),
                              })}>
                                <div className="margin-top-10 clear">
                                  <label className="control-label">Title</label>
                                  <Input
                                    onChange={this.onFieldChange}
                                    className="control-input"
                                    data-group="awards"
                                    data-index={index}
                                    name="title"
                                    id="title"
                                    type="text"
                                    value={entry.title}
                                  />
                                </div>
                                <div className="margin-top-10 clear">
                                  <label className="control-label">Year</label>
                                  <Input
                                    onChange={this.onFieldChange}
                                    data-group="awards"
                                    className="control-input"
                                    data-index={index}
                                    name="year"
                                    id="year"
                                    type="text"
                                    value={entry.year}
                                  />
                                </div>
                                {
                                  index != 0 &&
                                  <div className="margin-top-10 clearfix">
                                    <Button className="right" icon="minus" onClick={() => this.removeSubField('award', index)}>Remove Entry</Button>
                                  </div>
                                }
                              </div>
                            ))
                          }
                          <div className="margin-top-10 clear">
                            <div className="col-24 clearfix">
                              <Button className="right" icon="add" onClick={() => this.addField('awards')}>
                                Add Award
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="margin-top-20 margin-bottom-10 clear">
                            <div className="col-24 clearfix">
                              <label className="right">Certifications</label>
                            </div>
                          </div>
                          <div className="margin-top-10 clear">
                            <ListInput
                               field="certification"
                               keyName={undefined}
                               index={-1}
                               onEdit={bindActionCreators(editFieldAt, this.props.dispatch)}
                               data={resume.certifications}
                               placeholder="ACCA, ACAMS..."
                               single="certification"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="col-24 clearfix">
                            <label className="right">Referees</label>
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="address">
                              Academic
                            </label>
                            <Input
                              id="name"
                              name="academic.name"
                              data-group="referees"
                              placeholder="Mrs Ellen Jonah"
                              className="control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.academic.name}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="position"
                              name="academic.position"
                              data-group="referees"
                              placeholder="Senior Manager"
                              className="move-right control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.academic.position}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="institution"
                              name="academic.institution"
                              data-group="referees"
                              placeholder="Webster University, Ghana"
                              className="move-right control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.academic.institution}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="telephone"
                              name="academic.telephone"
                              data-group="referees"
                              placeholder="+233 2000000"
                              className="move-right control-input"
                              type="text"
                              value={resume.referees.academic.telephone}
                              onChange={this.onFieldChange}
                            />
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="address">
                              Employment
                            </label>
                            <Input
                              id="name"
                              name="employment.name"
                              data-group="referees"
                              placeholder="Mrs Ellen Jonah"
                              className="control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.employment.name}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="position"
                              name="employment.position"
                              data-group="referees"
                              placeholder="Senior Manager"
                              className="move-right control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.employment.position}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="company"
                              name="employment.company"
                              data-group="referees"
                              placeholder="resume.refereesbank"
                              className="move-right control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.employment.company}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="telephone"
                              name="employment.telephone"
                              data-group="referees"
                              placeholder="+233 2000000"
                              className="move-right control-input"
                              type="text"
                              value={resume.referees.employment.telephone}
                              onChange={this.onFieldChange}
                            />
                          </div>
                          <div className="margin-top-10 clear">
                            <label className="control-label" htmlFor="address">
                              Character
                            </label>
                            <Input
                              id="name"
                              name="character.name"
                              data-group="referees"
                              placeholder="Mrs Ellen Jonah"
                              className="control-input margin-bottom-5"
                              type="text" value={resume.referees.character.name}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="position"
                              name="character.position"
                              data-group="referees"
                              placeholder="Senior Manager"
                              className="move-right control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.character.position}
                              onChange={this.onFieldChange}
                            />
                            <Input
                              id="telephone"
                              name="character.telephone"
                              data-group="referees"
                              placeholder="+233 2000000"
                              className="move-right control-input margin-bottom-5"
                              type="text"
                              value={resume.referees.character.telephone}
                              onChange={this.onFieldChange}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="margin-top-20 clearfix">
                            <label className="control-label">Privacy</label>
                            <RadioGroup  name="public" onChange={this.onRadioChange} value={resume.meta.public}>
                                <Radio className="margin-left-10" group="meta" value={false}>private</Radio>
                                <Radio className="margin-left-10" group="meta" value={true}>public</Radio>
                            </RadioGroup>
                          </div>
                        </div>
                        <div>
                          <div className="margin-top-20 clearfix">
                            <label className="control-label"></label>
                            <Checkbox className="control-label" group="meta" name="signMeUpForUpdates" onChange={this.onCheckChange} checked={resume.meta.signMeUpForUpdates}>
                              Sign me up for mail updates
                            </Checkbox>
                          </div>
                        </div>
                        <div className="margin-bottom-50"></div>

                        <div className="ui-row margin-bottom-20">
                          <div className="col-24">
                            <button
                              type="submit"
                              className="display-block width-350 margin-top-20 sc-button sc-button-accent sc-button-color">
                              Save Changes
                            </button>
                          </div>
                        </div>
                    </form>
                    </div>
                    <div className="padding-top-20"></div>
                    <MiniFooter />
                  </div>
                </div>
              );
            }
          } else {
            return null;
          }
      })()
    );
  }
}

const mapStateToProps = (state) => ({
  waiting: state.Account.get('actionWaiting'),
  isAuthenticated: state.Account.get('isAuthenticated'),
  user: state.Account.toJSON().user,
  active: state.Resume.toJSON().active,
  resume: state.Resume.get('data').toJSON(),
});

const getStuff = ({dispatch, store: {getState}}) => {
  const user = getState().Account.toJSON().user;
  const isAuthenticated = getState().Account.get('isAuthenticated');

  if (isAuthenticated && user && user.email == '') {
    return Promise.resolve(dispatch(getAuthenticatedUser()));
  } else if (isAuthenticated && !user) {
    return Promise.resolve(dispatch(getAuthenticatedUser()));
  }

  return Promise.resolve();
};

const hooks = {
  // fetch: getStuff,
  defer: getStuff,
};

export default provideHooks(hooks)(connect(mapStateToProps)(Me));

