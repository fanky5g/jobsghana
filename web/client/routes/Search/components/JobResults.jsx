import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Result from './Result';
import { Spinner } from 'react-mdl';
import AdBanner from '#app/common/components/Adbanner';
import { setQuery, setTake, setSkip } from '#app/routes/Home/actions';
import { Pagination } from 'antd';
import MiniFooter from '#app/common/components/MiniFooter';

import { EmptyResults } from './Search';

class JobResults extends PureComponent {
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
		const { searching, skip, take } = this.props;
		const listResults = this.props.results.slice(skip, take);

		return (
			<table role="main" style={{borderWidth: 0}} cellPadding="0" cellSpacing="0" id="resultsBody">
			    <tbody>
			        <tr>
			            <td>
			                <table cellSpacing="0" cellPadding="0" width="100%" id="pageContent">
			                    <tbody>
			                        <tr style={{verticalAlign: "top"}}>
			                        	<td id="refineresultscol" style={{verticalAlign: "top"}}>
			                        		<AdBanner slot='4024293851' />
			                        	</td>
			                            <td id="resultsCol" style={{verticalAlign: "top"}}>
			                            	<div className="resultsTop">
			                            		<div id="searchCount" className="elapsed">
        											{ this.props.elapsed }
        										</div>
			                            		<div id="searchCount">
        											Jobs {listResults.length > 0 ? skip + 1: 0} to {skip + listResults.length} of {this.props.results.length}
        										</div>
        									</div>
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
			                            					<Result
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
			                            </td>
			                            {
			                            // 	<td role="complementary" id="auxCol" style={{verticalAlign: "top"}}>
				                         		// <AdBanner slot='4024293851' />
				                           //  </td>
			                            }
			                        </tr>
			                    </tbody>
			                </table>
			            </td>
			        </tr>
			    </tbody>
			</table>
		);
	}
}

export default JobResults;