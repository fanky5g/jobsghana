import React from 'react';
import moment from 'moment';

const Work = ({work}) => (
	<section id="work_entry margin-top-20">
		<h2 className="color-red">Work Experience:</h2>
		{
			work.length > 0 &&
			work.map((entry, index) => (
				<div key={index} className="margin-bottom-20">
					<div className="margin-bottom-10">
						<label className="display-inline-block">Role:</label><span className="display-inline-block margin-left-10">{entry.role}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Company:</label><span className="display-inline-block margin-left-10">{entry.company}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Time/Period:</label><span className="display-inline-block margin-left-10">{moment(entry.startDate).format('MMM DD, YYYY')} - {moment(entry.endDate).format('MMM DD, YYYY')}</span>
					</div>
					{
						entry.duties.length &&
						<div>
							<label className="display-inline-block">Duties:</label>
							<div className="display-inline-block margin-left-10">
								{
									entry.duties.map((duty, index) => (
										<span className="display-block" key={index}>{duty}</span>
									))
								}
							</div>
						</div>
					}
				</div>
			))
		}
	</section>
);

export default Work;