import React from 'react';

const Preferences = ({preferences}) => (
	<div>
		<div className="margin-bottom-20">
			<h2 className="color-red">Preferences:</h2>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Job Sector:</label><span className="display-inline-block margin-left-10">{preferences.jobSector != "other" ? preferences.jobSector : preferences.jobSectorAlt}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Level:</label><span className="display-inline-block margin-left-10">{preferences.level}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Salary Expectation:</label><span className="display-inline-block margin-left-10">GHS{preferences.salaryExpectation}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Location:</label><span className="display-inline-block margin-left-10">{preferences.location}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Job Type:</label><span className="display-inline-block margin-left-10">{preferences.jobType}</span>
			</div>
		</div>
	</div>
);

export default Preferences;