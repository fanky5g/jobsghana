import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import {
  getAuthenticatedUser,
  resetActivePageAuthenticated,
  setPageUnauthenticated,
  setPageAuthenticated,
  setDoneAuth,
  setActive,
  setOnline,
  setOffline,
  addAuthPage,
} from '#app/common/actions/Auth';

export default function requireAuthentication(Component, predicate, navigateToLogin=true) {
  const checkPageAuth = (authPages, path) => {
    if (authPages.length > 0 && authPages.indexOf(path) != -1) {
      return Promise.resolve({
        json: () => {
          return Promise.resolve({ authorized: true });
        }
      });
    }

    if (typeof predicate == 'undefined') {
      return Promise.resolve({
        json: () => {
          return Promise.resolve({ authorized: true });
        }
      });
    }

    if (predicate && !Array.isArray(predicate)) {
      predicate = [predicate]
    }

    return fetch('/api/v1/users/authorise', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roles: predicate }),
    });
  };

  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      user: PropTypes.object,
      isAuthenticated: PropTypes.bool,
      authorized: PropTypes.bool,
      location: PropTypes.object,
    };

    static contextTypes = {
      router: PropTypes.object,
    };

    componentWillMount() {
      const { dispatch, user } = this.props;
      const { router } = this.context;

      if (!this.props.isAuthenticated && navigateToLogin) {
        const redirectAfterLogin = this.props.location.pathname;
        router.replace(`/login?returnTo=${redirectAfterLogin}`);
      }
    }

    componentWillReceiveProps(nextProps) {
      const { authorized, doneAuth } = nextProps;
      const { router } = this.context;

      if (doneAuth && !authorized) {
        router.replace('/unauthorized');
      }
    }

    componentWillUnmount() {
      const { dispatch } = this.props;
      dispatch(resetActivePageAuthenticated());
    }

    render() {
      const { isAuthenticated, authorized, doneAuth, userLoaded } = this.props;
      
      return (
        <div style={{ height: '100%' }}>
        {
          isAuthenticated && doneAuth && userLoaded && authorized  ?
            <Component
              {...this.props}
            /> : null
        }
        </div>
      );
    }
  }

  const hooks = {
    fetch: ({ dispatch, store: { getState } }) => {
      const isAuth = getState().Account.get('isAuthenticated');
      const userLoaded = typeof getState().Account.get('user') !== 'undefined';

      if (isAuth && !userLoaded) {
        return Promise.resolve(dispatch(getAuthenticatedUser()));
      }

      return Promise.resolve();
    },
    defer: ({ dispatch, store: { getState }, path }) => {
      const isAuth = getState().Account.get('isAuthenticated');
      const userLoaded = typeof getState().Account.get('user') !== 'undefined';
      const authPages =  getState().Account.toJSON().authPages;

      if (isAuth) {
        checkPageAuth(authPages, path)
        .then(response => response.json())
        .then(res => {
          if (typeof res == 'object' && res.hasOwnProperty('authorized') && res.authorized) {
            dispatch(setPageAuthenticated());
            dispatch(addAuthPage(path));
            setTimeout(function() {
              dispatch(setDoneAuth());
            }, 500);
            return true;
          }

          dispatch(setPageUnauthenticated());
          return false;
        })
        .catch(error => {
          if (error.message) {
            console.log(error.message);
          }
        });
      }

      return Promise.resolve();
    },
  };

  const mapStateToProps = (state) => ({
    user: state.Account.toJSON().user,
    isAuthenticated: state.Account.get('isAuthenticated'),
    userLoaded: typeof state.Account.get('user') !== 'undefined',
    authorized: state.Account.get('activePageAuthenticated'),
    doneAuth: state.Account.get('doneAuth'),
    online: state.Account.get('online'),
  });

  return provideHooks(hooks)(connect(mapStateToProps)(AuthenticatedComponent));
}
