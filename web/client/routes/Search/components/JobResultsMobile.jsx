import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-mdl';
import Link from 'react-router';
import MResult from './MResult';
import { Pagination, Input, Icon, Select } from 'antd';
import { setTake, setSkip } from '#app/routes/Home/actions';

import { EmptyResults } from './Search';
const SelectOption = Select.Option;

class JobResultsMobile extends PureComponent {
	static propTypes = {
		searching: PropTypes.bool.isRequired,
		skip: PropTypes.number.isRequired,
		elapsed: PropTypes.string.isRequired,
		results: PropTypes.array.isRequired,
	};

	paginate = (page, pageSize) => {
	    const { dispatch } = this.props;
	    const skip = (page - 1) * pageSize;
	    const take = pageSize * page;
	    dispatch(setSkip(skip));
	    dispatch(setTake(take));
	};
 
	render() {
		const { searching, skip, take, query } = this.props;
		const listResults = this.props.results.slice(skip, take);

		return (
			<div>
				<div className="resultsHead mobile">
					<form onSubmit={this.props.onSearch} name="search">
						<Input
		                  onPressEnter={this.props.onSearch}
		                  onChange={this.props.onChange}
		                  ref="input"
		                  id="query"
		                  name="q"
		                  placeholder="Search Job..."
		                  value={query}
		                  suffix={(
			                <div className="search_icon" id="icon_wrapper">
			                      <a style={{
			                        textAlign: "center",
			                        width: "24px",
			                        cursor: "pointer",
			                        display: "inline-block",
			                        position: "relative",
			                      }}
			                      onClick={this.props.onSearch}
			                      href="javascript:void(0)">
			                        <Icon
			                          className="search_input_m"
			                          id="search_input_m"
			                          type="search"
			                        />
			                      </a>
			                    </div>
			                )}/>
	                 </form>
                 </div>
				<div className="results-info-separate">
					Jobs {listResults.length > 0 ? skip + 1: 0} to {skip + listResults.length} of {this.props.results.length}
				</div>
				<div className="m_results">
					{
                		(() => {
                			if (searching) {
                				return (
						          <div style={{margin: '20px 40%'}}>
						            <Spinner singleColor />
						          </div>
                				)
                			} else if (listResults.length > 0) {
                				return listResults.map((result, index) => (
                					<MResult
                						key={index}
                						entry={result}
                						type="job"
                						{...this.props}
                					/>
                				))
                			} else if (listResults.length == 0) {
                				return (
                					<EmptyResults />
                				);
                			}
                		})()
					}
					{
	                    listResults.length > 0 &&
	                    <div className="row">
		                    <Pagination
		                      defaultCurrent={1}
		                      defaultPageSize={15}
		                      onChange={this.paginate}
		                      total={this.props.results.length}
		                    />
		                </div>
	                  }
				</div>
			</div>
		);
	}
}

export default JobResultsMobile;