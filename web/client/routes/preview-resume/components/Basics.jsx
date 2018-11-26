import React from 'react';
import { objectEmpty } from '#app/util/resume';

const Basics = ({basics}) => (
	<div>
		<div className="margin-bottom-20">
			<h2 className="color-red">Profile:</h2>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Name:</label><span className="display-inline-block margin-left-10">{basics.name}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Date of Birth:</label><span className="display-inline-block margin-left-10">{basics.dob}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Address:</label><span className="display-inline-block margin-left-10">{basics.address}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Email:</label><span className="display-inline-block margin-left-10">{basics.email}</span>
			</div>
			<div className="margin-bottom-10">
				<label className="display-inline-block">Telephone:</label><span className="display-inline-block margin-left-10">{basics.phone}</span>
			</div>
		</div>
		<div className="margin-bottom-20">
			<h2 className="color-red display-inline-block">Personal Statement:</h2><p className="display-inline-block margin-left-10">{basics.personalStatement}</p>
		</div>
	</div>
);

export default Basics;