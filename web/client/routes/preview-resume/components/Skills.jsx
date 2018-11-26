import React from 'react';

const Skills = ({skills}) => (
	<section id="skills">
		<h2 className="color-red margin-top-20">Skills:</h2>
		{
			skills.length > 0 &&
			skills.map((entry, index) => (
				<div key={index} className="margin-bottom-10">
					<div className="margin-bottom-10">
						<label className="display-inline-block"></label><span className="display-inline-block margin-left-10">{entry.name}</span>
					</div>
					{
						entry.level &&
						<div className="margin-bottom-10">
							<label className="display-inline-block">Level:</label><span className="display-inline-block margin-left-10">{entry.level}</span>
						</div>
					}
				</div>
			))
		}
	</section>
);

export default Skills;