import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { rootReducer } from 'reducers/rootReducer';

export default function configureStore() {
  if (process.env.NODE_ENV === 'development') {
    return createStore(rootReducer, applyMiddleware(thunk, logger));
  }
  return createStore(rootReducer, applyMiddleware(thunk));
}
