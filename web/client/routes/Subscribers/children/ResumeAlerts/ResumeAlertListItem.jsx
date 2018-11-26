import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Grid, Cell, Button, Spinner } from 'react-mdl';
import classnames from 'classnames';

class ResumeAlertListItem extends PureComponent {
	static propTypes = {
		entry: PropTypes.object.isRequired,
	};

	render() {
		const { entry } = this.props;

		return (
			<div className="subscriber List__Item">
		      <Grid style={{outline: 'none'}}>
		      	  <div style={{width: '100%'}}>
		      	  	  <Cell col={3} className="List__Item_subcontainer">
			        	<span className="List__Item_name">{entry.companyName}</span>
				      </Cell>
				      <Cell col={3} className="List__Item_subcontainer">
			        	<span className="List__Item_name">{entry.jobTitle}</span>
				      </Cell>
				      <Cell col={2} className="List__Item_subcontainer">
			        	<span className="List__Item_name">{entry.email}</span>
				      </Cell>
				      <Cell col={2} className="List__Item_subcontainer">
			        	<span className="List__Item_name">{entry.location}</span>
				      </Cell>
				      <Cell col={2} className="List__Item_subcontainer">
			        	<span className="List__Item_name">{entry.experience}</span>
				      </Cell>
		      	  </div>
		      </Grid>
		    </div>
		);
	}
}

export default ResumeAlertListItem;