import { cleanup, render } from '@testing-library/react';
import Claims from 'constants/claims';
import { useConfiguration } from 'hooks/useConfiguration';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import * as Router from 'react-router';
import useKeycloakMock from 'useKeycloakWrapperMock';

import { Logout } from './Logout';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;
jest.mock('hooks/useKeycloakWrapper');
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
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, userAgencies, userAgency, false),
    );
    (useConfiguration as jest.Mock).mockReturnValue({ siteMinderLogoutUrl: undefined });

    render(
      <Router.MemoryRouter>
        <Logout />
      </Router.MemoryRouter>,
    );

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('should redirect to siteminder logout page', () => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, userAgencies, userAgency, false),
    );
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
