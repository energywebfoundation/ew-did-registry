import { LOGIN, LOGOUT } from '../types';

const initialState = {
  isLoggedIn: false,
}

const login = (payload) => ({
  isLoggedIn: true,
  ...payload
});

const logout = () => initialState;

const handlers = {
  [LOGIN]: login,
  [LOGOUT]: logout
};

export default (state = initialState, action) => {
  console.log(` -- Incoming action:`, action);
  const handler = handlers[action.type];
  const newState = handler ? handler(action.payload) : state;
  console.log(` -- Updating store -- auth --`, newState);
  return newState;
};