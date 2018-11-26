import React, { PureComponent } from 'react';
import Link from 'react-router/lib/Link';
import { displayDate } from '#app/lib/date';
import { getYearsOfExperience } from '#app/util/resume';
import { downloadUserResume } from '#app/routes/preview-resume/actions';

class MResult extends PureComponent {
    downloadResume = (index) => {
        const { dispatch, entry } = this.props;
        dispatch(downloadUserResume(entry.uid));
    };

	render() {
        const { entry } = this.props;

		return (
            (() => {
                if (this.props.type == 'job') {
                    return (
                    	<Link className="tapItem result" to={entry.url} target="_blank">
							<div className="item">
	                        <table cellPadding="0" cellSpacing="0">
								<tbody>
									<tr>
										<td className="resultContent">
											<div className="heading4 color-text-primary singleLineTitle tapItem-gutter">
												<h2 className="jobtitle jobTitle-color-purple">
													{entry.desc}
												</h2>
											</div>
											<div className="heading6 company_location tapItem-gutter">
												{
													(() => {
														if (entry.company && entry.region) {
															return (
																<pre>
																	<span className="companyName">{entry.company}</span>
																	<span className="separator"> - </span>
																	<span className="companyLocation">
																		{entry.region}
																	</span>
																</pre>
															);
														} else if (entry.company && !entry.region) {
															return (
																<pre>
																	<span className="companyName">{entry.company}</span>
																</pre>
															);
														} else if (!entry.company && entry.region) {
															return (
																<pre>
																	<span className="companyLocation">
																		{entry.region}
																	</span>
																</pre>
															);
														}
													})()
												}
											</div>
											{
												entry.posted_on &&
												<div className="heading6 tapItem-gutter">
													<span className="date">posted:&nbsp;{displayDate(entry.posted_on)}</span>
												</div>
											}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Link>
                    );
                } else if (this.props.type == 'resume') {
					const experience = getYearsOfExperience(entry.resume.work);
                    let yearsOfExperience = 'Entry Level';
                    if (experience) {
                        yearsOfExperience = `${experience} yrs experience`;
                    }
                    
                    return (
                    	<Link className="tapItem result" to={`/preview?uid=${entry.uid}`}>
							<div className="item">
		                        <table cellPadding="0" cellSpacing="0">
									<tbody>
										<tr>
											<td className="resultContent">
												<div className="heading4 color-text-primary singleLineTitle tapItem-gutter">
													<h2 className="jobtitle jobTitle-color-purple">
														{`${entry.jobTitle} - ${entry.location}`}
													</h2>
												</div>
												{
													Array.isArray(entry.skills) &&
	                            					entry.skills.map((skill, index) => (
														<div className="skill" key={index}>
					                                        {skill.name} - &nbsp;
					                                        <span className="level">{skill.level}</span>
					                                    </div>
	                            					))
												}
												<div className="heading6 tapItem-gutter">
													<span className="experience">{yearsOfExperience}</span>
												</div>
												<div className="result-link-bar-container">
		                                            <div className="result-link-bar">
		                                                <Link className="view_resume" onClick={() =>this.downloadResume()}>download resume</Link>&nbsp;-&nbsp;
		                                                <span className="last_updated">Updated: {displayDate(entry.last_updated, 'MMM D')}</span>
		                                            </div>
		                                        </div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</Link>
                    );
                }
            })()
		);
	}
}

export default MResult;