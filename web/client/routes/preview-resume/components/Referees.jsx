import React from 'react';

const Referees = ({referees}) => (
	<div>
		<h2 className="color-red">Referees</h2>
		<div className="margin-bottom-20">
			{
				referees.academic &&
				<div className="margin-bottom-10">
					<h2 className="color-red padding-left-10">Academic:</h2>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Name:</label><span className="display-inline-block margin-left-10">{referees.academic.name}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Institution:</label><span className="display-inline-block margin-left-10">{referees.academic.institution}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Position:</label><span className="display-inline-block margin-left-10">{referees.academic.position}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Telephone:</label><span className="display-inline-block margin-left-10">{referees.academic.telephone}</span>
					</div>
				</div>
			}
		</div>
		<div className="margin-bottom-20">
			{
				referees.employment &&
				<div className="margin-bottom-10">
					<h2 className="color-red padding-left-10">Employment:</h2>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Name:</label><span className="display-inline-block margin-left-10">{referees.employment.name}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Company:</label><span className="display-inline-block margin-left-10">{referees.employment.company}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Position:</label><span className="display-inline-block margin-left-10">{referees.employment.position}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Telephone:</label><span className="display-inline-block margin-left-10">{referees.employment.telephone}</span>
					</div>
				</div>
			}
		</div>
		<div className="margin-bottom-20">
			{
				referees.academic &&
				<div className="margin-bottom-10">
					<h2 className="color-red padding-left-10">Character:</h2>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Name:</label><span className="display-inline-block margin-left-10">{referees.character.name}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Position:</label><span className="display-inline-block margin-left-10">{referees.character.position}</span>
					</div>
					<div className="margin-bottom-10">
						<label className="display-inline-block">Telephone:</label><span className="display-inline-block margin-left-10">{referees.character.telephone}</span>
					</div>
				</div>
			}
		</div>
	</div>
);

export default Referees;