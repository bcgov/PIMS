import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { IENotSupportedPage } from './IENotSupportedPage';
import { cleanup } from '@testing-library/react';
import * as reducerTypes from 'constants/reducerTypes';
import { ADD_ACTIVATE_USER } from 'constants/actionTypes';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import renderer from 'react-test-renderer';

jest.mock('axios');
jest.mock('@react-keycloak/web');
const mockStore = configureMockStore([thunk]);

const store = mockStore({
  [reducerTypes.NETWORK]: {
    [ADD_ACTIVATE_USER]: {},
  },
});

describe('login error page', () => {
  afterEach(() => {
    cleanup();
  });
  it('login error page renders correctly', () => {
    const history = createMemoryHistory();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <IENotSupportedPage></IENotSupportedPage>
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
