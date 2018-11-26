import React from 'react';
			

const Competencies = ({competencies}) => (
	<section id="education">
		<h2 className="color-red margin-top-20">Competencies:</h2>
		{
			competencies.length > 0 &&
			competencies.map((entry, index) => (
				<div className="margin-bottom-10" key={index}>{entry}</div>
			))
		}
	</section>
);

export default Competencies;