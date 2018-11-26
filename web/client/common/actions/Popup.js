export function openPopup() {
  return {
    type: 'OPEN_POPUP',
  };
}

export function closePopup() {
  document.body.classList.remove("modal-open");
  const modalBackdrop = document.getElementsByClassName("modal-backdrop");
    if (modalBackdrop.length) {
      modalBackdrop[0].classList.remove("in");
    }
  return {
    type: 'CLOSE_POPUP',
  };
}

export function addVisitedPopup(popupIndex) {
  return {
    type: 'ADD_VISITED_POPUP',
    popupIndex,
  };
}

export function setPopupLength(count) {
  return {
    type: 'SET_POPUP_LENGTH',
    count,
  };
}

export function subscibeReviewAlert(state) {
  return {
    type: 'SUBSCRIBE_REVIEW_ALERT',
    promise: (client) => client.POST('/api/v1/subscriptions/review_alert', {
      data: {email: state.email},
    }),
  };
}

export function subscribeResumeAlert(state) {
  return {
    type: 'SUBSCRIBE_RESUME_ALERT',
    promise: (client) => client.POST('/api/v1/subscriptions/resume_request', {
      data: state,
    }),
  };
}

export function clearPopupMessage() {
  return {
    type: 'CLEAR_POPUP_MESSAGE',
  };
}