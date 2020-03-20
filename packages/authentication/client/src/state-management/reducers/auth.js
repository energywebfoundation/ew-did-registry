import { LOGIN, LOGOUT } from '../types';

const initialState = {
  isLogedIn: false,
}

const login = (payload) => ({
  isLogedIn: true,
  DID: payload.DID
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