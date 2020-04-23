import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export * from './actions';
export * from './types';

export default createStore(
  rootReducer,
  applyMiddleware(thunk)
);