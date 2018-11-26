import React from 'react';

const References = ({references}) => (
	<section id="references">
		<h2>References</h2>
		{
			references.map((entry, index) => (
				<div className="item" key={index}>
					{
						entry.reference &&
						<blockquote className="reference">
							{entry.reference}
						</blockquote>
					}
					{
						entry.name &&
						<div className="name">
							&mdash; {entry.name}
						</div>
					}
				</div>
			))
		}
	</section>
);

export default References;