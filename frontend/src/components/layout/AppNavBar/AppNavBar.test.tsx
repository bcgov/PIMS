import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { mountToJson } from 'enzyme-to-json';
import AppNavBar from './AppNavBar';

jest.mock('@react-keycloak/web');
Enzyme.configure({ adapter: new Adapter() });
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: ['1'],
    },
    subject: 'test',
  },
});
const mockStore = configureMockStore([thunk]);

const history = createMemoryHistory();
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
});

describe('AppNavBar', () => {
  it('AppNavBar snapshot test.', () => {
    const tree = mount(
      <Provider store={store}>
        <Router history={history}>
          <AppNavBar />
        </Router>
      </Provider>,
    );
    expect(mountToJson(tree.find(AppNavBar))).toMatchSnapshot();
  });

  it('AppNavBar include View Projects Link', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        userInfo: {
          roles: ['property-view'],
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <AppNavBar />
        </Router>
      </Provider>,
    );
    const link = getByText('View Projects');
    expect(link).toBeTruthy();
  });

  describe('AppNavBar Links Based on Security', () => {
    it('AppNavBar include Approval Requests Link', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['dispose-approve'],
          },
        },
      });
      const { getByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <AppNavBar />
          </Router>
        </Provider>,
      );
      const link = getByText('Approval Requests');
      expect(link).toBeTruthy();
    });

    describe('AppNavBar Administation Dropdown', () => {
      it('AppNavBar include Administration Dropdown', () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              groups: ['System Administrator'],
            },
          },
        });
        const { getByText } = render(
          <Provider store={store}>
            <Router history={history}>
              <AppNavBar />
            </Router>
          </Provider>,
        );
        const element = getByText('Administration');

        expect(element).toBeTruthy();
      });

      it('AppNavBar include Admin Access Requests Link', () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              groups: ['System Administrator'],
            },
          },
        });
        const { getByText } = render(
          <Provider store={store}>
            <Router history={history}>
              <AppNavBar />
            </Router>
          </Provider>,
        );
        fireEvent.click(getByText('Administration'));
        const element = getByText('Access Requests');

        expect(element).toBeTruthy();
      });

      it('AppNavBar include Admin Users Link', () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              groups: ['System Administrator'],
            },
          },
        });
        const { getByText } = render(
          <Provider store={store}>
            <Router history={history}>
              <AppNavBar />
            </Router>
          </Provider>,
        );

        fireEvent.click(getByText('Administration'));
        const element = getByText('Users');

        expect(element).toBeTruthy();
      });
    });

    describe('AppNavBar Manage Property Dropdown', () => {
      it('AppNavBar include Manage Property Dropdown', () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: ['property-add', 'property-view'],
            },
          },
        });
        const { getByText } = render(
          <Provider store={store}>
            <Router history={history}>
              <AppNavBar />
            </Router>
          </Provider>,
        );
        const element = getByText('Manage Property');

        expect(element).toBeTruthy();
      });

      it('AppNavBar include Submit Property Link', () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: ['property-add', 'property-view'],
            },
          },
        });
        const { getByText } = render(
          <Provider store={store}>
            <Router history={history}>
              <AppNavBar />
            </Router>
          </Provider>,
        );

        fireEvent.click(getByText('Manage Property'));
        const element = getByText('Submit Property');

        expect(element).toBeTruthy();
      });

      it('AppNavBar include View Inventory Link', () => {
        (useKeycloak as jest.Mock).mockReturnValue({
          keycloak: {
            subject: 'test',
            userInfo: {
              roles: ['property-view'],
            },
          },
        });
        const { getByText } = render(
          <Provider store={store}>
            <Router history={history}>
              <AppNavBar />
            </Router>
          </Provider>,
        );

        fireEvent.click(getByText('Manage Property'));
        const element = getByText('View Inventory');

        expect(element).toBeTruthy();
      });
    });

    it('AppNavBar include View Projects Link', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['property-view'],
          },
        },
      });
      const { getByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <AppNavBar />
          </Router>
        </Provider>,
      );
      const element = getByText('View Projects');

      expect(element).toBeTruthy();
    });

    it('AppNavBar include Disposal Project Link', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['dispose-request'],
          },
        },
      });

      const { getByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <AppNavBar />
          </Router>
        </Provider>,
      );
      const link = getByText('Dispose Properties');
      expect(link).toBeTruthy();
    });
  });
});
