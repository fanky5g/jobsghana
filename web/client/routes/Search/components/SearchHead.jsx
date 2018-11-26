import React, { PureComponent } from 'react';
import Link from 'react-router/lib/Link';
import { Select } from 'antd';
const SelectOption = Select.Option;

class SearchHead extends PureComponent {
	render() {
		const { type, query, region, onSearch, onChange } = this.props;

		let regionSelect = (
	      <Select placeholder="Location" value={region != undefined ? region: ''} onChange={this.props.regionChanged}>
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
			<table role="banner" cellPadding="0" cellSpacing="0">
			    <tbody>
			        <tr>
			            <td width="1125">
			                <table className="lnav" cellPadding="0" cellSpacing="0">
			                    <tbody>
			                        <tr>
			                            <td
			                            	id="branding-td"
											style={{verticalAlign: "top"}}>
											<Link id="branding" to="/">
												<img
													className="logo"
													src="data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw=="
													alt="TalentCommunity Logo"
													style={{marginBottom: "6px", display: "block"}}
												/>
											</Link>
										</td>
			                            <td style={{paddingTop: "3px"}}>
			                                <form
			                                	className="jsf"
			                                	name="js"
			                                	id="jobsearch"
			                                	action="/search"
			                                	method="GET"
			                                	onSubmit={onSearch}>
			                                    <table cellPadding="3" cellSpacing="0">
			                                        <tbody>
			                                            <tr>
			                                                <td id="what_label_cell" className="label">
			                                                	{
			                                                		type == '_job' &&
			                                                    	<label htmlFor="what" aria-hidden="true" id="what_label">Job Title / Job Ref / Company</label>
			                                                	}
			                                                	{
			                                                		type == '_resume' &&
			                                                		<label htmlFor="what" aria-hidden="true" id="what_label">Job Title</label>
			                                                	}
			                                                </td>
			                                                <td id="where_label_cell" colSpan="3" className="label">
			                                                    <label htmlFor="where" aria-hidden="true" id="where_label">Region</label>
			                                                </td>
			                                            </tr>
			                                            <tr role="search">
			                                                <td className="npl epr">
			                                                	<span className="inwrap">
			                                                		<input
			                                                			name="q"
			                                                			className="input_text"
			                                                			size="31"
			                                                			maxLength="512"
			                                                			value={query}
			                                                			onChange={onChange}
			                                                			id="what"
			                                                			autoComplete="off" />
			                                                	</span>
			                                                </td>
			                                                <td className="npl epr">
			                                                	<span className="inwrap">
			                                                		{regionSelect}
			                                                	</span>
			                                                </td>
			                                                <td width="0" height="0">
			                                                	<input type="hidden" name="type" value={type} />
			                                                </td>
			                                                <td className="npl" style={{width: "1px"}}>
			                                                	<span className="inwrapBorder"
			                                                		style={{width: "auto", paddingRight: 0}}>
			                                                		<span className="inwrapBorderTop">
			                                                			<input id="fj" className="input_submit" onChange={onChange} type="submit" value={type == '_job' ? "Find Jobs": "Find Resume"} />
			                                                		</span>
			                                                	</span>
			                                                </td>
			                                            </tr>
			                                        </tbody>
			                                    </table>
			                                </form>
			                            </td>
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

export default SearchHead;