import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { rootReducer } from 'store/rootReducer';

function configureStore() {
  if (process.env.NODE_ENV !== 'production') {
    return createStore(
      rootReducer,
      composeWithDevTools(applyMiddleware(thunk, logger, loadingBarMiddleware())),
    );
  }
  return createStore(rootReducer, applyMiddleware(thunk, loadingBarMiddleware()));
}

export const store = configureStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
