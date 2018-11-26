import React from 'react';

const Awards = ({awards}) => (
	<section id="awards">
		<h2 className="color-red margin-bottom-20">Awards</h2>
		{
			awards.length > 0 &&
			awards.map((entry, index) => (
				<div key={index} className="margin-bottom-20">
					<div className="margin-bottom-10">
						<label className="display-inline-block">Award/Accomplishment</label><span className="display-inline-block margin-left-10">{entry.title}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Year:</label><span className="display-inline-block margin-left-10">{entry.year}</span>
					</div>
				</div>
			))
		}
	</section>
);

export default Awards;

