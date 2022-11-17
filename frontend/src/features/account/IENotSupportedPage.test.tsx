import { cleanup } from '@testing-library/react';
import { ADD_ACTIVATE_USER } from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { IENotSupportedPage } from './IENotSupportedPage';

jest.mock('axios');
jest.mock('@react-keycloak/web');
const mockStore = configureMockStore([thunk]);

const store = mockStore({
  [reducerTypes.NETWORK]: {
    requests: { [ADD_ACTIVATE_USER]: {} },
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
          <MemoryRouter initialEntries={[history.location]}>
            <IENotSupportedPage></IENotSupportedPage>
          </MemoryRouter>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
