import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { useKeycloak } from '@react-keycloak/web';
import Header from './Header';

jest.mock('@react-keycloak/web');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

test('header renders correctly', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const tree = renderer.create(<Header />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('authenticated users are shown the logout button', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: true } });
  const { getByText } = render(<Header />);
  expect(getByText('Sign-out')).not.toBeNull();
});

test('unAuthenticated users are not shown the logout button', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const { queryByText } = render(<Header />);
  expect(queryByText(/sign-out/i)).toBeNull();
});

test('the logout button calls keycloaks logout() method', () => {
  const logout = jest.fn();
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { logout: logout, authenticated: true } });

  const { getByText } = render(<Header />);
  fireEvent.click(getByText('Sign-out'));

  expect(logout.mock.calls.length).toBe(1);
});
