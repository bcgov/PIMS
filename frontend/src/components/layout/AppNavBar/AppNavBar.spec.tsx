import Adapter from '@cfaester/enzyme-adapter-react-18';
import { cleanup, fireEvent, render } from '@testing-library/react';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import Roles from 'constants/roles';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import { mountToJson } from 'enzyme-to-json';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';
import * as Vitest from 'vitest';
import { vi } from 'vitest';

import AppNavBar from './AppNavBar';

Enzyme.configure({ adapter: new Adapter() });

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency = 1;

vi.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as Vitest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const mockStore = configureMockStore([thunk]);

const history = createMemoryHistory();
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
});

describe('AppNavBar', () => {
  afterEach(() => {
    cleanup();
  });

  it('AppNavBar snapshot test.', () => {
    const tree = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <AppNavBar />
        </MemoryRouter>
      </Provider>,
    );
    expect(mountToJson(tree.find(AppNavBar))).toMatchSnapshot();
  });

  describe('AppNavBar Links Based on Security', () => {
    describe('AppNavBar Administation Dropdown', () => {
      it('AppNavBar include Administration Dropdown', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Roles.SYSTEM_ADMINISTRATOR], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        const element = getByText('Administration');

        expect(element).toBeVisible();
      });

      it('AppNavBar include Admin Users Link', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Roles.SYSTEM_ADMINISTRATOR], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );

        fireEvent.click(getByText('Administration'));
        const element = getByText('Users');

        expect(element).toBeVisible();
      });
      it('AppNavBar include Admin Access Requests Link', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Roles.SYSTEM_ADMINISTRATOR], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        fireEvent.click(getByText('Administration'));
        const element = getByText('Access Requests');

        expect(element).toBeVisible();
      });

      it('AppNavBar include Admin Agencies link', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Roles.SYSTEM_ADMINISTRATOR], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        fireEvent.click(getByText('Administration'));
        const element = getByText('Agencies');

        expect(element).toBeVisible();
      });
    });

    it('AppNavBar include Submit Property Link', () => {
      (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
        new (useKeycloakMock as any)([Claims.PROPERTY_ADD, Claims.PROPERTY_VIEW], []),
      );
      const { getByText } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[history.location]}>
            <AppNavBar />
          </MemoryRouter>
        </Provider>,
      );
      const link = getByText('Submit Property');
      expect(link).toBeTruthy();
    });

    it('AppNavBar include View Inventory Link', () => {
      (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
        new (useKeycloakMock as any)([Claims.PROPERTY_ADD, Claims.PROPERTY_VIEW], []),
      );
      const { getByText } = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[history.location]}>
            <AppNavBar />
          </MemoryRouter>
        </Provider>,
      );

      const link = getByText('View Property Inventory');

      expect(link).toBeTruthy();
    });

    describe('AppNavBar Disposal Projects dropdown', () => {
      it('AppNavBar include Disposal Projects dropdown for Approval requests only', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Claims.DISPOSE_APPROVE], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        const element = getByText('Disposal Projects');

        expect(element).toBeVisible();
      });

      it('AppNavBar include Create Disposal Project Link', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Claims.ADMIN_PROPERTIES, Claims.ADMIN_PROJECTS], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        fireEvent.click(getByText('Disposal Projects'));
        const link = getByText('Create Disposal Project');

        expect(link).toBeVisible();
      });

      it('AppNavBar include View Projects Link', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Claims.ADMIN_PROPERTIES, Claims.ADMIN_PROJECTS], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        fireEvent.click(getByText('Disposal Projects'));
        const link = getByText('View Projects');

        expect(link).toBeVisible();
      });

      it('AppNavBar include Approval Requests Link', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Claims.DISPOSE_APPROVE], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        fireEvent.click(getByText('Disposal Projects'));
        const link = getByText('Approval Requests');

        expect(link).toBeVisible();
      });
    });

    describe('AppNavBar Reports Dropdown', () => {
      it('AppNavBar include Reports Dropdown', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Claims.REPORTS_VIEW, Claims.REPORTS_SPL], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        const link = getByText('Reports');
        expect(link).toBeVisible();
      });

      it('AppNavBar include SPL Reports link', () => {
        (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
          new (useKeycloakMock as any)([Claims.REPORTS_VIEW, Claims.REPORTS_SPL], []),
        );
        const { getByText } = render(
          <Provider store={store}>
            <MemoryRouter initialEntries={[history.location]}>
              <AppNavBar />
            </MemoryRouter>
          </Provider>,
        );
        fireEvent.click(getByText('Reports'));
        const link = getByText('SPL Report');

        expect(link).toBeVisible();
      });
    });
  });
});
