import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { useKeycloak } from '@react-keycloak/web';
import Header from './Header';

jest.mock('@react-keycloak/web');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    location: {},
  }),
}));

test('header renders correctly', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const tree = renderer.create(<Header />).toJSON();
  expect(tree).toMatchSnapshot();
});
