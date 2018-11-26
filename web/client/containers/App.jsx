import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import classNames from 'classnames';
import AppLayout from '#app/containers/AppLayout';
import DevTools from '#app/common/middleware/DevTools';
import Link from 'react-router/lib/Link';
import { bindActionCreators } from 'redux';
import { initEnvironment } from '#app/common/actions/App';
import Loading from '#app/common/components/Loading';

if (process.env.BROWSER) {
   // eslint global-require: "off" 
  require('react-mdl/extra/material');
}

class AppView extends PureComponent {
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
    document.body.className = document.body.className.replace(/(^|\s)is-noJs(\s|$)/, "$1is-js$2");  
  };

  render() {
    // this is where basic structure shud live
    const { dispatch, location, environment, isAuthenticated, routeLoading } = this.props;
    const { screenHeight, isMobile, screenWidth } = environment;
    const { isMounted } = this.state;
    const currentRoute = this.props.routes[this.props.routes.length - 1];
    const children = React.cloneElement(this.props.children, {
      dispatch,
      screenWidth,
    });
    const pageName = currentRoute && typeof currentRoute.name == 'string' ? currentRoute.name.split(' ').join('').toLowerCase() : '';

    return (
        <div id="app-view" className={classNames({ [`${pageName}page`]: true })}>
          <Helmet title={`${currentRoute.name}`} />
           {isMounted && <DevTools />}
           {isMounted && <Loading routeLoading={routeLoading}/>}
          <AppLayout
            dispatch={dispatch}
            location={location}
            isMounted={isMounted}
            pageName={currentRoute.name}
            isAuthenticated={isAuthenticated}
            screenWidth={screenWidth}
            isMobile={isMobile}
          >
          {children}
          </AppLayout>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  environment: state.Environment.toJSON(),
  isAuthenticated: state.Account.get('isAuthenticated'),
  routeLoading: state.App.get('routeLoading'),
});

export default connect(mapStateToProps)(AppView);