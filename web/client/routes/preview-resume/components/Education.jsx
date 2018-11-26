import React from 'react';
import moment from 'moment';
			

const Education = ({education}) => (
	<section id="education">
		<h2 className="color-red margin-top-20">Education:</h2>
		{
			education.length > 0 &&
			education.map((entry, index) => (
				<div key={index} className="margin-bottom-20">
					<div className="margin-bottom-10">
						<label className="display-inline-block">Institution:</label><span className="display-inline-block margin-left-10">{entry.institution}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Qualification:</label><span className="display-inline-block margin-left-10">{entry.qualification}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Year:</label><span className="display-inline-block margin-left-10">{moment(entry.startDate).format('YYYY')} - {moment(entry.endDate).format('YYYY')}</span>
					</div>
				</div>
			))
		}
	</section>
);

export default Education;