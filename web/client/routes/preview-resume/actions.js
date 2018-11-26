require('whatwg-fetch');
import { notification } from 'antd';

export const setPreviewResume = (resume) => {
	return {
		type: 'SET_PREVIEW_RESUME',
		resume,
	}
};

export const accountViewed = (id) => {
	return {
		type: 'ACCOUNT_VIEWED',//do not catch this
		promise: (client) => client.POST('/api/v1/resume/viewed', {
			data: {id},
		}),
	};
};

export const getResume = (uid) => {
	if (uid) {
		return {
			type: 'GET_RESUME',
			promise: (client) => client.GET(`/api/v1/resume/get?uid=${uid}`),
		};	
	} else {
		return {
			type: 'GET_RESUME',
			promise: (client) => client.GET(`/api/v1/resume/get`),
		};
	}
};

export function initiateDownload(id) {
  	// supposed to send headers
  	return fetch('/api/v1/resume/download/start', {
	  method: 'POST',
	  credentials: 'same-origin',
	  headers: {
	    'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({id}),
  	});
};

export const downloadUserResume = (id) => {
	return dispatch => {
		initiateDownload(id).then(res => {
			if (res.ok) {

			}
			res.json().then(response => {
				if (res.ok) {
					if (response.message) {
						notification.success({message: response.message, duration: 5});
					}
					window.location.href = response.body.checkout_url;
				} else {
					notification.error({message: response.message, duration: 5})
				}
			});
		});
	};
};