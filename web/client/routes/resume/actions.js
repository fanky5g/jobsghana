import steps from './steps';

export const initResume = (data) => {
	return {
		type: 'INIT_RESUME',
		resume: data,
	};
};

export const addSubField = (sectionName) => {
	return {
		type: 'ADD_FIELD',
		field: sectionName,
	};
};

export const removeFieldAt = (sectionName, index) => {
	return {
		type: 'REMOVE_FIELD',
		field: sectionName,
		removeAt: index,
	};
};

export const editFieldAt = (field, key, value, index = -1) => {
	return {
		type: 'SET_FIELD',
		field,
		value,
		key,
		index,
	};
};

export const saveResume = (id, resume) => {
	return (dispatch, getState) => {
		const stageID = getState().Resume.get('currentStep');
		return dispatch({
			type: 'SAVE_RESUME',
			promise: (client) => client.POST(`/api/v1/accounts/saveResume?stage=${stageID}&numStages=${steps.length}`, {
				data: { resume, id },
			}),
		});
	};
};

export const setStep = (step) => {
	return {
		type: 'SET_CURRENT_STEP',
		step,
	};
};