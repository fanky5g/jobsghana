export const getResumeAlertSubscribers = () => {
    return (dispatch, getState) => {
        const skip = getState().MaillistSubscribers.get('skip');
        return dispatch({
            type: 'GET_RESUMEALERT_SUBSCRIBERS',
            promise: (client) => client.GET(`/api/v1/subscriptions/resume_alert?skip=${skip}`),
        });
    };
};

export function loadMoreResumeAlertSubscribers() {
    return (dispatch, getState) => {
        const done = getState().MaillistSubscribers.get('done');
        const skip = getState().MaillistSubscribers.get('skip');
        if (!done) {
            return dispatch({
                type: 'LOAD_MORE_RESUMEALERT_SUBSCRIBERS',
                promise: (client) => client.GET(`/api/v1/subscriptions/resume_alert?skip=${skip}`),
            });
        }
    };
}