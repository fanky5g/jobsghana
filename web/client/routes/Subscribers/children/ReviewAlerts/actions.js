export const getReviewAlertSubscribers = () => {
    return (dispatch, getState) => {
        const skip = getState().MaillistSubscribers.get('skip');
        return dispatch({
            type: 'GET_REVIEWALERT_SUBSCRIBERS',
            promise: (client) => client.GET(`/api/v1/subscriptions/review_alert?skip=${skip}`),
        });
    };
};

export function loadMoreReviewAlertSubscribers() {
    return (dispatch, getState) => {
        const done = getState().MaillistSubscribers.get('done');
        const skip = getState().MaillistSubscribers.get('skip');
        if (!done) {
            return dispatch({
                type: 'LOAD_MORE_REVIEWALERT_SUBSCRIBERS',
                promise: (client) => client.GET(`/api/v1/subscriptions/review_alert?skip=${skip}`),
            });
        }
    };
}