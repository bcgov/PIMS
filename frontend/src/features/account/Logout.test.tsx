import { useKeycloak } from '@react-keycloak/web';
import { cleanup, render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useConfiguration } from 'hooks/useConfiguration';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { LogoutPage } from './Logout';

jest.mock('@react-keycloak/web');
jest.mock('hooks/useConfiguration');
// @ts-ignore
delete window.location;
// @ts-ignore
window.location = { replace: jest.fn() };

describe('logout', () => {
  const history = createMemoryHistory();
  let { location } = window;

  beforeAll(() => {
    window.location = { replace: jest.fn() } as any;
  });

  afterAll(() => (window.location = location));

  afterEach(() => {
    cleanup();
  });

  it('should redirect to login page', () => {
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
    (useConfiguration as jest.Mock).mockReturnValue({ siteMinderLogoutUrl: undefined });

    render(<LogoutPage />);

    expect(location.pathname).toBe('/login');
  });

  it('should redirect to siteminder logout page', async () => {
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
    (useConfiguration as jest.Mock).mockReturnValue({
      siteMinderLogoutUrl: 'http://fakesiteminder.com',
    });

    render(
      <MemoryRouter initialEntries={[history.location]}>
        <LogoutPage />
      </MemoryRouter>,
    );

    await waitFor(() => expect(window.location.replace).toHaveBeenCalledTimes(1));
  });
});
