
const debug = require('debug')('users');

const initialState = [];

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERLIST':
      debug('Setting userlist', action.userList);
      return action.userList;
    default:
      return state;
  }
};

export default userReducer;