import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Grid, Cell, Button, Spinner } from 'react-mdl';
import classnames from 'classnames';

class ReviewAlertListItem extends PureComponent {
	static propTypes = {
		entry: PropTypes.object.isRequired,
	};

	render() {
		const { entry } = this.props;

		return (
			<div className="subscriber List__Item">
		      <Grid style={{outline: 'none'}}>
		      	  <div style={{width: '100%'}}>
		      	  	  <Cell col={6} className="List__Item_subcontainer">
			        	<span className="List__Item_name">{entry.email}</span>
				      </Cell>
				      <Cell col={6} className="List__Item_subcontainer actions">
					    <Button
				        	raised
				        	ripple
				        	onClick={() => {}}
				        >
				      		Delete
				        </Button>
				      </Cell>
		      	  </div>
		      </Grid>
		    </div>
		);
	}
}

export default ReviewAlertListItem;