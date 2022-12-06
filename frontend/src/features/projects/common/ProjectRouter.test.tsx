import { useKeycloak } from '@react-keycloak/web';
import { render } from '@testing-library/react';
import * as actionTypes from 'constants/actionTypes';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import * as Router from 'react-router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import useProject from '../common/hooks/useProject';
import { mockWorkflow } from '../dispose/testUtils';
import ProjectRouter from './ProjectRouter';

const mockStore = configureMockStore([thunk]);

jest.mock('../common/hooks/useProject');
jest.mock('../common/hooks/useStepForm');
jest.mock('components/Table/Table', () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock('@react-keycloak/web');
const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      userInfo: {
        agencies: [1],
        roles: claims,
      },
      subject: 'test',
      authenticated: true,
    },
  });
};

const search = '?projectNumber=TEST-10001';

const history = createMemoryHistory();
history.push(`/projects${search}`);

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: { project: {} },
  [reducerTypes.ProjectReducers.WORKFLOW]: mockWorkflow,
  [reducerTypes.NETWORK]: {
    requests: {
      [actionTypes.ProjectActions.GET_PROJECT_WORKFLOW]: {
        isFetching: false,
      },
    },
  },
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
});

describe('project router', () => {
  // Mock react-router useNavigate
  const navigate = jest.fn();
  beforeEach(() => {
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => navigate);
  });

  beforeAll(() => {
    mockKeycloak([Claims.ADMIN_PROJECTS, Claims.PROJECT_VIEW, Claims.DISPOSE_APPROVE]);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  /**
   * NAVIGATES to dispose/projects/review
   */
  it('navigates to dispose/projects/review', () => {
    (useProject as jest.Mock).mockReturnValue({
      project: {
        projectNumber: 'TEST-10001',
        statusCode: 'DR-RE',
        status: {
          route: '/projects/review',
        },
      },
    });

    render(
      <Provider store={store}>
        <Router.MemoryRouter initialEntries={[history.location]}>
          <ProjectRouter />
        </Router.MemoryRouter>
      </Provider>,
    );

    expect(navigate).toHaveBeenCalledWith(`/dispose/projects/review${search}`);
  });

  /**
   * NAVIGATES to assess/properties
   */
  it('navigates to assess/properties', () => {
    (useProject as jest.Mock).mockReturnValue({
      project: {
        projectNumber: 'TEST-10001',
        statusCode: 'AS-I',
        status: {
          route: '/projects/assess/properties',
        },
      },
    });

    render(
      <Provider store={store}>
        <Router.MemoryRouter initialEntries={[history.location]}>
          <ProjectRouter />
        </Router.MemoryRouter>
      </Provider>,
    );

    expect(navigate).toHaveBeenCalledWith(`/projects/assess/properties${search}`);
  });

  /**
   * NAVIGATES to assess/properties/update
   */
  it('navigates to assess/properties/update', () => {
    (useProject as jest.Mock).mockReturnValue({
      project: {
        projectNumber: 'TEST-10001',
        statusCode: 'AS-I',
        status: {
          route: '/projects/assess/properties/update',
        },
      },
    });

    render(
      <Provider store={store}>
        <Router.MemoryRouter initialEntries={[history.location]}>
          <ProjectRouter />
        </Router.MemoryRouter>
      </Provider>,
    );

    expect(navigate).toHaveBeenCalledWith(`/projects/assess/properties/update${search}`);
  });

  /**
   * NAVIGATES to summary
   */
  it('navigates to summary', () => {
    (useProject as jest.Mock).mockReturnValue({
      project: {
        projectNumber: 'TEST-10001',
      },
    });
    mockKeycloak([]);

    render(
      <Provider store={store}>
        <Router.MemoryRouter initialEntries={[history.location]}>
          <ProjectRouter />
        </Router.MemoryRouter>
      </Provider>,
    );

    expect(navigate).toHaveBeenCalledWith(`/projects/summary${search}`);
  });
});
