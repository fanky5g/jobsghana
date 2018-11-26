require('whatwg-fetch');

export function logoutBackend() {
  // supposed to send headers
  return fetch('/api/v1/users/logout', {
      method: 'GET',
      credentials: 'same-origin',
    })
}

export function logoutSuccess(data) {
  window.localStorage.removeItem('token');

  return {
    type: 'LOGOUT_SUCCESS',
    res: data,
  };
}

export function logout() {
  return dispatch => {
    // catch errors from logout
    logoutBackend().then(
        response => {
          if (response.ok) {
            return response.json();
          }
          return ({
            status: response.status,
            body: response.body,
          });
        }
      ).then((data) => {
        window.location.reload();
        // dispatch(logoutSuccess(data));
      })
      .catch(error => {
        if (typeof error.body === 'string') {
          try {
            error.body = JSON.parse(error.body);
          } catch (err) {
            console.log(err);
          }
        }

        if (error.body.message) {
          console.log(error.body.message);
        }
      });
  };
}

export function getAuthenticatedUser() {
  return (dispatch, getState) => {
    dispatch({
      type: 'GET_AUTHENTICATED_USER_REQUEST',
    });

    fetch('/api/v1/users/me', {
      method: 'POST',
      credentials: 'same-origin',
    }).then(res => {
      return res.json()
    }).then(user => {
      dispatch({
        type: 'GET_AUTHENTICATED_USER',
        res: user,
      });

      return dispatch({
        type: 'INIT_RESUME',
        resume: user.resume,
      });
    }).catch(err => {
      dispatch({
        type: 'GET_AUTHENTICATED_USER_FAILURE',
        err,
      });
    });
  };
}

export function resetActivePageAuthenticated() {
  return {
    type: 'RESET_ACTIVE_PAGE_AUTHENTICATED',
  };
}

export function addAuthPage(page) {
  return {
    type: 'ADD_AUTHENTICATED_PAGE',
    page,
  }
}

export function setPageUnauthenticated() {
  return {
    type: 'ACTIVE_PAGE_UNAUTHENTICATED',
  };
}

export function setPageAuthenticated() {
  return {
    type: 'ACTIVE_PAGE_AUTHENTICATED',
  };
}

export function setDoneAuth() {
  return {
    type: 'SET_DONE_AUTH',
  };
}

export function setOnline() {
  return {
    type: 'SET_ONLINE',
  };
}

export function setOffline() {
  return {
    type: 'SET_OFFLINE',
  };
}