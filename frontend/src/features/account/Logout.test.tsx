import { useKeycloak } from '@react-keycloak/web';
import { cleanup, render } from '@testing-library/react';
import { useConfiguration } from 'hooks/useConfiguration';
import React from 'react';
import * as Router from 'react-router';

import { Logout } from './Logout';

jest.mock('@react-keycloak/web');
jest.mock('hooks/useConfiguration');

describe('logout', () => {
  // Mock react-router useNavigate
  const navigate = jest.fn();
  beforeEach(() => {
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => navigate);
  });

  afterEach(() => {
    cleanup();
  });

  it('should redirect to login page', () => {
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
    (useConfiguration as jest.Mock).mockReturnValue({ siteMinderLogoutUrl: undefined });

    render(
      <Router.MemoryRouter>
        <Logout />
      </Router.MemoryRouter>,
    );

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('should redirect to siteminder logout page', () => {
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
    (useConfiguration as jest.Mock).mockReturnValue({
      siteMinderLogoutUrl: 'http://fakesiteminder.com',
    });

    render(
      <Router.MemoryRouter>
        <Logout />
      </Router.MemoryRouter>,
    );

    expect(navigate).toHaveBeenCalledWith(
      'http://fakesiteminder.com?returl=undefined/login&retnow=1',
    );
  });
});
