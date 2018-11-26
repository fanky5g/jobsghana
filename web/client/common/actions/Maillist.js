export function AddToMaillist(email) {
	return {
		type: 'ADD_TO_MAILLIST',
		promise: (client) => client.POST('/api/v1/career-advice/maillist', {
			data: {email},
		}),
	};
}

export function ResetMaillist() {
	return {
		type: 'RESET_MAILLIST',
	};
}