import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Input, Button, Icon, Select } from 'antd';
import { Spinner } from 'react-mdl';

const SelectOption = Select.Option;

class ResumeSearch extends PureComponent {
  state = {
    inRegion: '',
    query: '',
  };

  queryChange = (evt) => {
    const {  query } = this.props;
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
      type: '_resume',
    });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    if (this.state.query == '') return;
  
    this.props.goToUrl('/search', {
      q: this.state.query,
      region: this.state.inRegion,
      type: '_resume',
    });
  };


	render() {
    const regionSelect = (
      <Select placeholder="Greater Accra" onChange={this.regionChanged}>
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
      <div className="cv-search-c">
        <div className="wrap-center">
          <div className="search-head">
              <div className="brand">
                <img
                  src="/static/images/logo-web.png"
                  className="icon" alt="TalentCommunity Logo" title="TalentCommunity Logo"/>
              </div>
          </div>
          <form name="search" method="GET" autoComplete="off" id="jobsearch" onSubmit={this.onSubmit}>
            <div id="searchfor">
              <div className="search-wrapper">
                <label htmlFor="keywords">Job Title</label>
                <Input
                  onPressEnter={this.onSearchSubmit}
                  onChange={this.queryChange}
                  ref="input"
                  id="query"
                  name="q"
                  value={this.state.query}
                  suffix={(
                    <div className="search_icon" id="icon_wrapper">
                          <a style={{
                            textAlign: "center",
                            width: "24px",
                            cursor: "pointer",
                            display: "inline-block",
                            position: "relative",
                          }}
                          onClick={this.onSearchSubmit}
                          href="javascript:void(0)">
                            <Icon
                              className="search_input_m"
                              id="search_input_m"
                              type="search"
                            />
                          </a>
                        </div>
                    )}/>
              </div>
              <div className="location-wrapper">
              <label htmlFor="location">Location</label>
              {regionSelect}
              </div>
            </div>

            <Button htmlType="submit" className="submit">Find Resumes</Button>
          </form>
          <div className="dec_">
            <span>Find <strong>job seekers</strong> from <strong>all regions</strong> with just <strong>one search.</strong></span>
          </div>
        </div>
      </div>
		);
	}
}

export default ResumeSearch;