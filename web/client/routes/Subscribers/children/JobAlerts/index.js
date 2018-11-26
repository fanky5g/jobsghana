import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner, Grid, Cell, Textfield, Button } from 'react-mdl';
import JobAlertListItem from './JobAlertListItem';
import classnames from 'classnames';
import { getJobAlertSubscribers, loadMoreJobAlertSubscribers } from './actions';
import { provideHooks } from 'redial';

class JobAlertSubscribers extends PureComponent {
  static propTypes = {
  	location: PropTypes.object,
  	routes: PropTypes.array,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  loadMore = () => {
    const { dispatch } = this.props;
    dispatch(loadMoreJobAlertSubscribers());
  };

  render() {
  	const { loading, moreLoading, subscribers, done } = this.props;

    return (
      <div className={classnames({subscribers: true, loading: loading, "mdl-shadow--2dp": !loading})}>
        <div className="account-list List">
          <Grid className="List__Header">
            <Cell col={6}><span>Email</span></Cell>
            <Cell col={6}><span>Actions</span></Cell>
          </Grid>
          <div className="List__container">
            {
              subscribers.length > 0 &&
              subscribers.map((entry, index) => (
                <JobAlertListItem
                  key={index}
                  entry={entry}
                />
              ))
            }
            {
              subscribers.length == 0 &&
              <div style={{margin: "0 auto", display: "inline-block", textAlign: "center", width: "100%", padding: "12px"}}>
                <span style={{fontSize: "14px", fontStyle: "italic"}}>No job alerts found</span>
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
  const loaded = getState().JobAlertSubscribers.toJSON().loaded;
  const loading = getState().JobAlertSubscribers.toJSON().loading;

  if (!loaded && !loading) {
    return Promise.resolve(dispatch(getJobAlertSubscribers()));
  }

  return Promise.resolve();
};

const hooks = {
  defer: loadInitial,
  // fetch: loadInitial,
};

const mapStateToProps = (state) => ({
  done: state.JobAlertSubscribers.get('done'),
	loading: state.JobAlertSubscribers.get('loading'),
  moreLoading: state.JobAlertSubscribers.get('moreLoading'),
  subscribers: state.JobAlertSubscribers.toJSON().data,
});

export default provideHooks(hooks)(connect(mapStateToProps)(JobAlertSubscribers));
