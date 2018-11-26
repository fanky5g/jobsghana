export const searchResume = (query, region) => {
	return {
		type: 'SEARCH_RESUME',
		promise: (client) => client.GET(`/api/v1/resume/find?query=${query}&location=${region}`),
	};
};

export const clearSearchResults = () => {
	return {
		type: 'CLEAR_RESUME_SEARCH_RESULTS',
	};
};

export const setPageAnimating = () => {
	return {
		type: 'SET_RESUME_PAGE_ANIMATING',
	};
};

export const setQuery = (value) => {
	return {
		type: 'SET_RESUME_QUERY',
		value,
	};
};

export const setTake = (value) => {
	return {
		type: 'SET_RESUME_TAKE',
		value,
	};
};

export const setSkip = (value) => {
	return {
		type: 'SET_RESUME_SKIP',
		value,
	};
};

export const unsetPageAnimating = () => {
	return {
		type: 'UNSET_RESUME_PAGE_ANIMATING',
	};
};

export const setSearchBarAtop = () => {
	return {
		type: 'SET_RESUME_SEARCHBAR_ATOP',
	};
};

export const unsetSearchBarAtop = () => {
	return {
		type: 'UNSET_RESUME_SEARCHBAR_ATOP',
	};
};

export const setResumeLoading = () => {
	return {
		type: 'SET_RESUME_LOADING',
	};
};

export const unsetResumeLoading = () => {
	return {
		type: 'UNSET_RESUME_LOADING',
	};
};