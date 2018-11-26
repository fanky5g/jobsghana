import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner, Grid, Cell, Textfield, Button } from 'react-mdl';
import ResumeAlertListItem from './ResumeAlertListItem';
import classnames from 'classnames';
import { getResumeAlertSubscribers, loadMoreResumeAlertSubscribers } from './actions';
import { provideHooks } from 'redial';

class ResumeAlertSubscribers extends PureComponent {
  static propTypes = {
  	location: PropTypes.object,
  	routes: PropTypes.array,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  loadMore = () => {
    const { dispatch } = this.props;
    dispatch(loadMoreResumeAlertSubscribers());
  };

  render() {
  	const { loading, moreLoading, subscribers, done } = this.props;

    return (
      <div className={classnames({subscribers: true, loading: loading, "mdl-shadow--2dp": !loading})}>
        <div className="account-list List">
          <Grid className="List__Header">
            <Cell col={3}><span>Company</span></Cell>
            <Cell col={3}><span>Job Title</span></Cell>
            <Cell col={2}><span>Email</span></Cell>
            <Cell col={2}><span>Location</span></Cell>
            <Cell col={2}><span>Experience(yrs)</span></Cell>
          </Grid>
          <div className="List__container">
            {
              subscribers.length > 0 &&
              subscribers.map((entry, index) => (
                <ResumeAlertListItem
                  key={index}
                  entry={entry}
                />
              ))
            }
            {
              subscribers.length == 0 &&
              <div style={{margin: "0 auto", display: "inline-block", textAlign: "center", width: "100%", padding: "12px"}}>
                <span style={{fontSize: "14px", fontStyle: "italic"}}>No resume alerts</span>
              </div>
            }
          </div>
          <div className="container loadmore">
            {
              !moreLoading &&
              <Button raised disabled={done} ripple onClick={this.loadMore}>load more</Button>
            }
            {
              moreLoading &&
              <Spinner singleColor/>
            }
          </div>
        </div>
      </div>
    );
  }
}

const loadInitial = ({dispatch, store: {getState}}) => {
  const loaded = getState().ResumeAlertSubscribers.toJSON().loaded;
  const loading = getState().ResumeAlertSubscribers.toJSON().loading;

  if (!loaded && !loading) {
    return Promise.resolve(dispatch(getResumeAlertSubscribers()));
  }

  return Promise.resolve();
};

const hooks = {
  defer: loadInitial,
  // fetch: loadInitial,
};

const mapStateToProps = (state) => ({
  done: state.ResumeAlertSubscribers.get('done'),
	loading: state.ResumeAlertSubscribers.get('loading'),
  moreLoading: state.ResumeAlertSubscribers.get('moreLoading'),
  subscribers: state.ResumeAlertSubscribers.toJSON().data,
});

export default provideHooks(hooks)(connect(mapStateToProps)(ResumeAlertSubscribers));
