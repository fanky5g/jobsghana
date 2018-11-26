import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Grid, Cell, Button, Spinner, IconButton, Menu, MenuItem } from 'react-mdl';
import classnames from 'classnames';
import { cleanResume, objectEmpty, buildResume } from '#app/util/resume';
import clone from 'lodash/cloneDeep';
import { Resume } from '#app/routes/preview-resume';

function popupwindow(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}


class User extends PureComponent {
	static propTypes = {
		account: PropTypes.object.isRequired,
		approved: PropTypes.bool.isRequired,
		approveAccount: PropTypes.func.isRequired,
	};

	isResumeEmpty = (resume) => {
	    if (!resume || (typeof resume == 'object' && Object.keys(resume).length == 0)) return true;
	    const copy = buildResume(clone(resume));
	    return objectEmpty(cleanResume(copy));
	};


	openDialog = () => {
		const { account } = this.props;
		popupwindow('/resume-preview?uid='+account.ID, 'Preview', 800, 600);
	};

	openMessageBox = () => {
		this.props.openMessageBox({
			email: this.props.account.resume.basics.email,
			name: this.props.account.resume.basics.name,
		});
	};

	render() {
		const { account, previewResume, approveAccount, currentUser } = this.props;
		const resume = buildResume(account.resume);
		const resumeIsEmpty = this.isResumeEmpty(account.resume);

		return (
			<div className={classnames({account: true, List__Item: true})}>
		      <Grid style={{outline: 'none'}}>
		      	  <div style={{width: '100%'}}>
		      	  	  <Cell col={5} className="List__Item_subcontainer">
			        	<span className="List__Item_name">{resume.basics.name}</span>
				      </Cell>
				      <Cell col={3} className="List__Item_subcontainer">
				        <span className="List__Item_name">{account.email}</span>
				      </Cell>
				      <Cell col={4} className="List__Item_subcontainer actions">
				    	<Button
				        	raised
				        	ripple
				        	disabled={account.approved || resumeIsEmpty}
				        	onClick={() => approveAccount(account.ID)}
				        >
				        	{account.approveLoading ? <Spinner style={{marginLeft: "12px", marginTop: "8px"}} />: 'Approve'}
				        </Button>
					    <Button
				        	raised
				        	ripple
				        	disabled={resumeIsEmpty}
				        	onClick={this.openDialog}
				        >
				      		View Resume
				        </Button>
                      	<div>
	                        <IconButton id={`more-account-options-${account.ID}`} name="more_vert" />
	                        <Menu
	                          target={`more-account-options-${account.ID}`}
	                          ripple
	                          className="mdl-shadow--3dp AppBar__menu-item-dropdown"
	                        >
	                          <MenuItem onClick={this.openMessageBox}>Message</MenuItem>
	                          <MenuItem onClick={() => {}}>Delete</MenuItem>
	                        </Menu>
                      	</div>
				      </Cell>
		      	  </div>
		      </Grid>
		    </div>
		);
	}
}

export default User;