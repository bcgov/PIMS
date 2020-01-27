import React from 'react';
import { createMemoryHistory } from 'history'
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom'
import renderer from 'react-test-renderer';

jest.mock('@react-keycloak/web');
import { useKeycloak } from '@react-keycloak/web';
import Login from '../pages/Login';

//boilerplate function used by most tests to wrap the Login component with a router.
const renderLogin = () => {
  const history = createMemoryHistory();
  return render(
    <Router history={history}>
      <Login />
    </Router>
  );
}

test('login renders correctly', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const history = createMemoryHistory();
  const tree = renderer
    .create(<Router history={history}><Login></Login></Router>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('authenticated users are redirected to the mapview', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: true } });
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <Login />
    </Router>
  );
  expect(history.location.pathname).toBe('/mapview');
});

test('unAuthenticated users are shown the login screen', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const { getByRole } = renderLogin();
  expect(getByRole('heading')).toHaveTextContent('Search and manage government properties');
});

test('a spinner is displayed if keycloak has not yet been initialized', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: undefined });
  const { container } = renderLogin();
  expect(container.firstChild).toHaveClass('spinner-border');
});

test('the login button calls keycloaks login() method', () => {
  const login = jest.fn();
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { login: login, authenticated: false } });

  const { getByText } = renderLogin();
  fireEvent.click(getByText(/sign in/i));

  expect(login.mock.calls.length).toBe(1);
});