
const initialState = {
  loaded: false,
};
const debug = require('debug')('userReducer');

const userReducer = (state = initialState, action) => {
  debug('Input: state: ', state, '. Action: ', action);

  switch (action.type) {
    case 'SET_USER': {
      const { uid, email } = action.user;
      return {
        ...state,
        uid,
        email,
      };
    }
    case 'USER_LOADED': {
      return {
        ...state,
        loaded: true,
      };
    }
    case 'LOG_OUT': {
      return initialState;
    }
    default:
      return { ...state };
  }
};

export default userReducer;
