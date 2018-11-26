export const getRandomJobs = (n) => {
	return {
		type: 'GET_RANDOM_JOBS',
		promise: (client) => client.GET(`/api/v1/jobs/get_random?n=${n}`),
	};
};

export const subscribeToJobAlerts = (state) => {
	return {
		type: 'SUBSCRIBE_JOB_ALERT',
		promise: (client) => client.POST('/api/v1/subscriptions/job_alerts', {
			data: state,
		}),
	};
};