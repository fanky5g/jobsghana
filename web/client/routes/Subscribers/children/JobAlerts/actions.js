export const getJobAlertSubscribers = () => {
    return (dispatch, getState) => {
        const skip = getState().MaillistSubscribers.get('skip');
        return dispatch({
            type: 'GET_JOBALERT_SUBSCRIBERS',
            promise: (client) => client.GET(`/api/v1/subscriptions/job_alert?skip=${skip}`),
        });
    };
};

export function loadMoreJobAlertSubscribers() {
    return (dispatch, getState) => {
        const done = getState().MaillistSubscribers.get('done');
        const skip = getState().MaillistSubscribers.get('skip');
        if (!done) {
            return dispatch({
                type: 'LOAD_MORE_JOBALERT_SUBSCRIBERS',
                promise: (client) => client.GET(`/api/v1/subscriptions/job_alert?skip=${skip}`),
            });
        }
    };
}