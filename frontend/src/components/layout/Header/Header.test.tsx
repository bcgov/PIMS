import React from 'react';
import renderer from 'react-test-renderer';
import { useKeycloak } from '@react-keycloak/web';
import Header from './Header';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('@react-keycloak/web');

const mockStore = configureMockStore([thunk]);
const store = mockStore({});

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    location: {},
  }),
}));

test('header renders correctly', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const tree = renderer
    .create(
      <Provider store={store}>
        <Header />
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
