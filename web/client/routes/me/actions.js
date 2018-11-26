export const editResume = (id, resume) => {
	return {
		type: 'EDIT_RESUME',
		promise: (client) => client.POST('/api/v1/accounts/editResume', {
			data: { resume, id },
		}),
		resume
	};
};