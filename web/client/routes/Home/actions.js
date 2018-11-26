export const searchJob = (query, region) => {
	return (dispatch, getStore) => {
		return dispatch({
			type: 'SEARCH_JOB',
			promise: (client) => client.GET(`/api/v1/jobs/find?query=${query}&region=${region}`),
		});
	};
};

export const clearSearchResults = () => {
	return {
		type: 'CLEAR_JOB_SEARCH_RESULTS',
	};
};

export const setPageAnimating = () => {
	return {
		type: 'SET_JOB_PAGE_ANIMATING',
	};
};

export const setQuery = (value) => {
	return {
		type: 'SET_JOB_QUERY',
		value,
	};
};

export const setTake = (value) => {
	return {
		type: 'SET_JOB_TAKE',
		value,
	};
};

export const setSkip = (value) => {
	return {
		type: 'SET_JOB_SKIP',
		value,
	};
};

export const unsetPageAnimating = () => {
	return {
		type: 'UNSET_JOB_PAGE_ANIMATING',
	};
};

export const setSearchBarAtop = () => {
	return {
		type: 'SET_JOB_SEARCHBAR_ATOP',
	};
};

export const unsetSearchBarAtop = () => {
	return {
		type: 'UNSET_JOB_SEARCHBAR_ATOP',
	};
};

export const setResumeLoading = () => {
	return {
		type: 'SET_JOB_LOADING',
	};
};

export const unsetResumeLoading = () => {
	return {
		type: 'UNSET_JOB_LOADING',
	};
};