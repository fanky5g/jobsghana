import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import classNames from 'classnames';
import DashLayout from '#app/containers/DashLayout';
import DevTools from '#app/common/middleware/DevTools';
import Link from 'react-router/lib/Link';
import { bindActionCreators } from 'redux';
import { initEnvironment } from '#app/common/actions/App';

if (process.env.BROWSER) {
  /* eslint global-require: "off" */
  require('react-mdl/extra/material');
  require('react-select/dist/react-select.css');
  require('react-datepicker/dist/react-datepicker.css');
  require('draft-js/dist/Draft.css');
  require('draft-js-emoji-plugin/lib/plugin.css');
}

class Dash extends PureComponent {
  static propTypes = {
    routes: PropTypes.array,
    environment: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    children: PropTypes.object,
    location: PropTypes.object.isRequired,
  };

  state = {
    isMounted: false,
  };

  componentDidMount() {
    this.onMount();
  }

  onMount = () => {
    const { dispatch } = this.props;
    this.setState({ isMounted: true });
    dispatch(initEnvironment());
  };

  render() {
    // this is where basic structure shud live
    const { dispatch, location, environment, Account } = this.props;
    const { screenHeight, isMobile, screenWidth } = environment;
    const { isMounted } = this.state;
    const currentRoute = this.props.routes[this.props.routes.length - 1];
    const children = React.cloneElement(this.props.children, {
      dispatch,
    });

    const isAuth = Account.get('isAuthenticated');
    const pageName = currentRoute && typeof currentRoute.name == 'string' ? currentRoute.name.split(' ').join('').toLowerCase() : '';

    const Dashboard = (
      <DashLayout
        user={Account.toJSON().user}
        dispatch={dispatch}
        Account={Account}
        location={location}
        currentRoute={currentRoute}
        isMounted={isMounted}
        routes={this.props.routes}
      >
        {children}
      </DashLayout>
    );

    return (
        <div id="app-view" className={classNames({ [`${pageName}page`]: true })}>
          <Helmet title={`${currentRoute.name}`} />
           {isMounted && <DevTools />}
          {Dashboard}
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  environment: state.Environment.toJSON(),
  Account: state.Account,
});

export default connect(mapStateToProps)(Dash);