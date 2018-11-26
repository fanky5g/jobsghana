import { notification } from 'antd';

export default function login(credentials) {
  return dispatch => {
  	 authenticate(credentials, (error, res) => {
  	 	if (error && error.message) {
  	 		notification.error({message: error.message, duration: 5});
  	 		return {};
  	 	}

  	 	if (res && res.message) {
  	 		notification.error({message: res.message, duration: 5});
  	 		return {};
  	 	}

  	 	const token = res.body.token;
   		const storage = window.localStorage;
      storage.setItem('token', JSON.stringify(token));
  	 	return dispatch(setAuthenticated(res.body.token, res.body.type));
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

export function setAuthenticated(token, type) {
	return {
		type: 'SET_USER_AUTHENTICATED',
		token,
    actype: type,
	};
}