import React from 'react';
import moment from 'moment';
			

const Certifications = ({certifications}) => (
	<section id="education">
		<h2 className="color-red margin-top-20 margin-bottom-10">Certifications:</h2>
		{
			certifications.length > 0 &&
			certifications.map((entry, index) => (
				<div className="margin-bottom-10" key={index}>{entry}</div>
			))
		}
	</section>
);

export default Certifications;