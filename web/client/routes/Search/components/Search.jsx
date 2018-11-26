import React, { PureComponent } from 'react';
import { searchJob } from '#app/routes/Home/actions';
import { searchResume } from '#app/routes/find-resume/actions';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import JobSearchResults from './JobResults';
import MJobSearchResults from './JobResultsMobile';
import MResumeSearchResults from './ResumeResultsMobile';
import ResumeSearchResults from './ResumeResults';
import Footer from '#app/common/components/Footer';
import classnames from 'classnames';
import SearchHead from './SearchHead';
import AdBanner from '#app/common/components/Adbanner';
import Helmet from 'react-helmet';

export const EmptyResults = () => (
	<div className="_empty">
		<span>No results found</span>
	</div>
);

const dummy = () => {}

class Search extends PureComponent {
	state = {
		q: '',
		region: '',
	};

	onChange = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value,
		});
	};

	regionChanged = (region) => {
		this.setState({
			region: region,
		});
	};

	componentDidMount() {
		const { location: {query} } = this.props;
		const { type, q, region } = query;
		this.setState({
			q,
			region,
		});
	}

	onSearch = (evt) => {
		evt.preventDefault();
		const { location: { query }, dispatch } = this.props;
		const { type } = query;

		if (this.state.q != '') {
			if (type == '_job') {
				dispatch(searchJob(this.state.q, this.state.region));
			} else if (type == '_resume') {
				dispatch(searchResume(this.state.q, this.state.region));
			}
		}
	};

	setFirstEntry = (ref) => {
		this.setState({
			firstEntry: ref,
		});
	};

	render() {
		const { location: {query}, isMobile } = this.props;
		const { type } = query;

		const { region, q } = this.state;

		return (
			<div className="results">
				<Helmet title={q} />
				{
					((isMobileDevice) => {
						if (isMobileDevice) {
							const css = `
								body {
								    font-family: sans-serif;
								    margin: 0;
								    min-height: 318px;
								    background: #ffffff;
								    -webkit-text-size-adjust: none;
								}

							    @media screen and (min-width: 600px) {
								    body {
								        padding: 1px 16px 0;
								        max-width: 736px;
								        margin: 0 auto;
								        background-color: #E8E8E8;
								    }

								    .mdl-layout {
								    	position: relative;
					    				width: 100%;
					    				height: inherit;
								    }
								}
							`;

							return (
								<div className="results_container">
									<style>{css}</style>
									{
										(() => {
											if (type && type == '_job') {
												return (
													<MJobSearchResults
														searching={this.props.jSearching}
														skip={this.props.jSkip}
														take={this.props.jTake}
														elapsed={this.props.jElapsed}
														results={this.props.jobs}
														goToUrl={this.props.goToUrl}
														dispatch={this.props.dispatch}
														onChange={this.onChange}
														onSearch={this.onSearch}
														query={q}
														region={region}
													/>
												);
											} else if(type && type == '_resume') {
												return (
													<MResumeSearchResults
														searching={this.props.rSearching}
														skip={this.props.rSkip}
														take={this.props.rTake}
														elapsed={this.props.rElapsed}
														results={this.props.resumes}
														goToUrl={this.props.goToUrl}
														dispatch={this.props.dispatch}
														onChange={this.onChange}
														onSearch={this.onSearch}
														query={q}
														region={region}
													/>
												);
											} else {
												return <EmptyResults />;
											}
										})()
									}
								</div>
							);
						} else {
							return (
								<div className="content">
									<SearchHead
										type={type}
										query={q}
										region={region}
										onSearch={this.onSearch}
										onChange={this.onChange}
										regionChanged={this.regionChanged}
										ref={c => !this.state.shead && this.setState({ shead: c })} />
									{
										(() => {
											if (type && type == '_job') {
												return (
													<JobSearchResults
														searching={this.props.jSearching}
														skip={this.props.jSkip}
														take={this.props.jTake}
														elapsed={this.props.jElapsed}
														results={this.props.jobs}
														goToUrl={this.props.goToUrl}
														dispatch={this.props.dispatch}
													/>
												);
											} else if(type && type == '_resume') {
												return (
													<ResumeSearchResults
														searching={this.props.rSearching}
														skip={this.props.rSkip}
														take={this.props.rTake}
														elapsed={this.props.rElapsed}
														results={this.props.resumes}
														goToUrl={this.props.goToUrl}
														dispatch={this.props.dispatch}
														ppane={this.state.ppane}
														shead={this.state.shead}
														firstEntry={this.state.firstEntry}
														setFirstEntry={this.setFirstEntry}
													/>
												);
											} else {
												return <EmptyResults />;
											}
										})()
									}
								</div>
							);
						}
					})(isMobile)
				}
			</div>
		);
	}
}

const _search = (dispatch, query) => {
	if (typeof query == 'object' && query.hasOwnProperty('q')) {
      let q = '';
      let type = '';
      let region = '';

      q = query.q || q;
      region = query.region || region;
      type = query.type || type;

      if (type == '_job') {
      	return Promise.resolve(dispatch(searchJob(q, region)));
      } else if(type == '_resume') {
      	return Promise.resolve(dispatch(searchResume(q, region)));
      }
    }
    
    return Promise.resolve();
};

const hooks = {
  fetch: ({dispatch, query}) => {
  	return _search(dispatch, query);
  },
  defer: ({dispatch, query}) => {
  	return _search(dispatch, query);
  },
};

const mapStateToProps = (state) => ({
	jobs: state.JobSearch.toJSON().searchResults,
	jSkip: state.JobSearch.toJSON().skip,
	jTake: state.JobSearch.toJSON().take,
	jElapsed: state.JobSearch.toJSON().elapsed,
	jSearching: state.JobSearch.toJSON().searching,
	resumes: state.ResumeSearch.toJSON().searchResults,
	rSkip: state.ResumeSearch.toJSON().skip,
	rTake: state.ResumeSearch.toJSON().take,
	rElapsed: state.ResumeSearch.toJSON().elapsed,
	rSearching: state.ResumeSearch.toJSON().searching,
	// isMobile: state.Environment.toJSON().isMobile,
});

export default provideHooks(hooks)(connect(mapStateToProps)(Search));
