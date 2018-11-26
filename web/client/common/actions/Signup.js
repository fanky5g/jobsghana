require('whatwg-fetch');
import { getAuthenticatedUser } from '#app/common/actions/Auth';
import { setAuthenticated } from '#app/routes/Login/actions';
import { notification } from 'antd';

export function signup(credentials) {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_RESUMEBUILDER_LOADING',
        });

        createUser(credentials).then(res => {
            if (!res.ok) {
                if (res.headers.get('Content-Type').toLowerCase().includes('application/json')) {
                    res.json()
                    .then(err => {
                        console.log(err);
                        notification.error({duration: 5, message: err.message});
                        return dispatch({
                            type: 'SET_RESUMEBUILDER_DONE_LOADING',
                        });
                    }).catch(err => console.log(err));
                }

                return;
            }

            authenticate({ email: credentials.email, password: credentials.password }, (err, res) => {
                if (err) {
                    console.log(err);
                }

                dispatch(setAuthenticated(res.body.token, res.body.type));
                setTimeout(() => {
                  dispatch(getAuthenticatedUser());
                  dispatch({ type: 'SET_RESUMEBUILDER_DONE_LOADING', credentials});
                }, 100);
            });
        }).catch(error => {
            console.log(err);
            notification.error({duration: 5, message: error.message});
            return dispatch({
                type: 'SET_RESUMEBUILDER_DONE_LOADING',
            });
        });
    };
}

const authenticate = (credentials, callback) => {
    fetch('/api/v1/users/authenticate', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        .then(response => response.json())
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            callback(error);
        });
};

export function createUser(credentials) {
    return fetch('/api/v1/users/join?role=user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
}