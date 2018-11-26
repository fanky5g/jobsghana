export const getAccounts = () => {
    return (dispatch, getState) => {
        const skip = getState().Accounts.get('skip');
        return dispatch({
            type: 'GET_ACCOUNTS',
            promise: (client) => client.GET(`/api/v1/accounts?skip=${skip}`),
        });
    };
};

export function loadMoreAccounts() {
    return (dispatch, getState) => {
        const done = getState().Accounts.get('done');
        const skip = getState().Accounts.get('skip');
        if (!done) {
            return dispatch({
                type: 'LOAD_MORE_ACCOUNTS',
                promise: (client) => client.GET(`/api/v1/accounts?skip=${skip}`),
            });
        }
    };
}

export function approve(id) {
    return {
        type: 'APPROVE_ACCOUNT',
        promise: (client) => client.POST('/api/v1/accounts/approve', {
            data: {
                id,
            },
        }),
        id,
    };
}

export function sendTargetedMail(data) {
    return {
        type: 'SEND_TARGETED_MAIL',//uncaught
        promise: (client) => client.POST('/api/v1/accounts/directmessage', {
            data: data,
        }),
    };
}