export const getSubscribers = () => {
    return (dispatch, getState) => {
        const skip = getState().MaillistSubscribers.get('skip');
        return dispatch({
            type: 'GET_NEWSLETTER_SUBSCRIBERS',
            promise: (client) => client.GET(`/api/v1/subscriptions/newsletter?skip=${skip}`),
        });
    };
};

export function loadMoreSubscribers() {
    return (dispatch, getState) => {
        const done = getState().MaillistSubscribers.get('done');
        const skip = getState().MaillistSubscribers.get('skip');
        if (!done) {
            return dispatch({
                type: 'LOAD_MORE_NEWSLETTER_SUBSCRIBERS',
                promise: (client) => client.GET(`/api/v1/subscriptions/newsletter?skip=${skip}`),
            });
        }
    };
}