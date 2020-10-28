import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
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
  afterEach(() => {
    cleanup();
  });

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
          roles: ['admin-properties', 'admin-projects'],
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

    it('AppNavBar include Disposal Project Link', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['admin-properties', 'admin-projects'],
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

  it('AppNavBar include Reports Link', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        userInfo: {
          roles: ['reports-view', 'spl-reports'],
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
    const link = getByText('Reports');
    expect(link).toBeTruthy();
  });

  describe('AppNavbar user name display', () => {
    it('Displays keycloak display name if available', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            name: 'display name',
            firstName: 'name',
            roles: ['project-add'],
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
      const name = getByText('display name');
      expect(name).toBeVisible();
    });

    it('Displays first last name if no display name', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['project-add'],
            firstName: 'firstName',
            lastName: 'lastName',
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
      const name = getByText('firstName lastName');
      expect(name).toBeVisible();
    });

    it('Displays default if no user name information found', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['project-add'],
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
      const name = getByText('default');
      expect(name).toBeVisible();
    });
  });
  describe('AppNavbar user name display', () => {
    it('Displays keycloak display name if available', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            name: 'display name',
            firstName: 'name',
            roles: ['project-add'],
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
      const name = getByText('display name');
      expect(name).toBeVisible();
    });

    it('Displays first last name if no display name', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['project-add'],
            firstName: 'firstName',
            lastName: 'lastName',
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
      const name = getByText('firstName lastName');
      expect(name).toBeVisible();
    });

    it('Displays default if no user name information found', () => {
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          subject: 'test',
          userInfo: {
            roles: ['project-add'],
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
      const name = getByText('default');
      expect(name).toBeVisible();
    });
  });
});
