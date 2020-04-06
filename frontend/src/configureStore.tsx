import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { rootReducer } from 'reducers/rootReducer';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

export default function configureStore() {
  if (process.env.NODE_ENV === 'development') {
    return createStore(rootReducer, applyMiddleware(thunk, logger, loadingBarMiddleware()));
  }
  return createStore(rootReducer, applyMiddleware(thunk, loadingBarMiddleware()));
}
