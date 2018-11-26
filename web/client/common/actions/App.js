import { readCookie } from '#app/util/cookie';

export function downloadFile(path) {
  return {
    type: 'DOWNLOAD',
    promise: () => Promise.resolve(window.open(`/download?path=${path}`)),
  };
}

// the environment code is borrowed from Andrew Ngu, https://github.com/andrewngu/sound-redux
function changeIsMobile(isMobile) {
  return {
    type: 'CHANGE_IS_MOBILE',
    isMobile,
  };
}

function changeWidthAndHeight(screenHeight, screenWidth) {
  return {
    type: 'CHANGE_WIDTH_AND_HEIGHT',
    screenHeight,
    screenWidth,
  };
}

export function setCookie(name, value) {
  return {
    type: 'SET_COOKIE',
    promise: (client) => client.POST(`/api/cookie/${name}/${value}`),
  };
}

// @todo::set to cookies
export function initEnvironment() {
  return (dispatch, getState) => {
    // if cookie not exist set cookie
    // if (!readCookie('clientWidth')) {
    //   dispatch(setCookie('clientWidth', window.innerWidth));
    //   dispatch(setCookie('clientHeight', window.innerHeight));
    // }

    const { isMobile } = getState().Environment.toJSON();
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    dispatch(changeIsMobile(isMobile));

    dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

    window.onresize = () => {
      dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));
    };
  };
}

export function getPrivacy() {
  return {
    type: 'GET_PRIVACY_POLICY',
    promise: (client) => client.GET('/privacy-policy.md'),
  }
}

export function showLoading(pathname) {
  return {
    type: 'SHOW_LOADING',
  };
}

export function hideLoading() {
  return {
    type: 'HIDE_LOADING',
  };
}