import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Input, Button, Icon } from 'antd';
import { Spinner } from 'react-mdl';

class JobSearch extends PureComponent {
	render() {
		return (
      <div className="wrap-center">
        <div className="intro-strap">
            <div className="brand">
              <img
                src="/static/images/logo-web.png"
                className="icon" alt="TalentCommunity Logo" title="TalentCommunity Logo"/>
            </div>
            <div className="dec_">
                <h1 className="hph1">Discover job opportunities from multiple</h1>
                <h2>websites <span>with </span> just one <span>search</span></h2>
            </div>
        </div>
        <div className="showOnlyJS">
          <form name="search" method="GET" autoComplete="off" id="jobsearch" onSubmit={this.props.onSearchSubmit}>
            <div id="searchfor">
              <div className="search-wrapper">
                <label htmlFor="keywords">Job Title / Job Ref / Company Name</label>
                <Input
                  onPressEnter={this.props.onSearchSubmit}
                  onChange={this.props.queryChange}
                  ref="input"
                  id="query"
                  name="q"
                  value={this.props.query}
                  tabIndex="-1"
                  suffix={(
                    <div className="search_icon" id="icon_wrapper">
                          <a style={{
                            textAlign: "center",
                            width: "24px",
                            cursor: "pointer",
                            display: "inline-block",
                            position: "relative",
                          }}
                          onClick={this.props.onSelect}
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
              {this.props.regionSelect}
              </div>
            </div>
            <Button htmlType="submit" className="submit">Find Jobs Now</Button>
          </form>
        </div>
        <div className="noscript">
          <form name="search" method="GET" id="jobsearch" action="/search">
            <div id="searchfor">
              <div className="search-wrapper">
                <label htmlFor="keywords">Job Title / Job Ref / Company Name</label>
                <Input
                  onPressEnter={this.props.onSearchSubmit}
                  onChange={this.props.queryChange}
                  ref="input"
                  id="query"
                  name="q"
                  value={this.props.query}
                  suffix={(
                    <div className="search_icon" id="icon_wrapper">
                          <a style={{
                            textAlign: "center",
                            width: "24px",
                            cursor: "pointer",
                            display: "inline-block",
                            position: "relative",
                          }}
                          onClick={this.props.onSelect}
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
                <select name="region" className="ant-select">
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
              </div>
              <input type="hidden" name="type" value="_job" />
            <Button htmlType="submit" className="submit">Find Jobs Now</Button>
          </form>
        </div>
      </div>
		);
	}
}

export default JobSearch;