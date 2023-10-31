import { act, cleanup, render } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actionTypes from 'constants/actionTypes';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import useStepper from './hooks/useStepper';
import ProjectDisposeView from './ProjectDisposeView';

const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
const mockKeycloak = (userRoles: string[] | Claims[]) => {
  (useKeycloakWrapper as jest.Mock).mockReturnValue(
    new (useKeycloakMock as any)(userRoles, userAgencies, userAgency, true),
  );
};

const mockStore = configureMockStore([thunk]);

jest.mock('./hooks/useStepper');
(useStepper as jest.Mock).mockReturnValue({
  currentStatus: {},
  project: { projectNumber: '' },
  projectStatusCompleted: noop,
  canGoToStatus: noop,
});

const mockWorkflow = [
  {
    description:
      'A new draft project that is not ready to submit to apply to be added to the Surplus Property Program.',
    route: '/project/draft',
    workflow: 'SubmitDisposal',
    id: 0,
    name: 'Draft',
    isDisabled: false,
    sortOrder: 0,
    type: 'ProjectStatus',
  },
];

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: {},
  [reducerTypes.ProjectReducers.WORKFLOW]: mockWorkflow,
  [reducerTypes.NETWORK]: {
    requests: {
      [actionTypes.ProjectActions.GET_PROJECT]: {
        isFetching: false,
      },
    },
  },
});

const errorStore = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: {},
  [reducerTypes.ProjectReducers.WORKFLOW]: mockWorkflow,
  [reducerTypes.NETWORK]: {
    requests: {
      [actionTypes.ProjectActions.GET_PROJECT]: {
        isFetching: false,
        error: 'error',
      },
    },
  },
});

const renderElement = (store: any) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={['/dispose?projectNumber=SPP-10001']}>
      <ProjectDisposeView />
    </MemoryRouter>
  </Provider>
);

describe('Project Dispose View', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    mockKeycloak([Claims.PROJECT_ADD]);
  });

  beforeEach(() => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onAny().reply(200, {});
  });

  it('renders', () => {
    act(() => {
      const { container } = render(renderElement(store));
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('throws error with correct project # when unable to fetch project', () => {
    expect(() => {
      render(renderElement(errorStore));
    }).toThrow('Unable to load project number SPP-10001');
  });
});
