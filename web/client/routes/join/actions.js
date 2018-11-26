export const addUser = (userData) => {
	return {
		type: 'JOIN',
		promise: (client) => client.POST('/api/v1/users/join?role=user', {
			data: userData,
		}),
	};
};

export const resetRegistration = () => {
	return {
		type: 'RESET_REGISTRATION',
	};
};