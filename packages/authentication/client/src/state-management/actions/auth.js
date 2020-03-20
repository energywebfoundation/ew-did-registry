import { LOGIN, LOGOUT } from '../types';

export const login = (DID) => {
  return {
    type: LOGIN,
    payload: { DID }
  }
}

export const logout = () => ({
  type: LOGOUT
});