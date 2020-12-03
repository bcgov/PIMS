import React from 'react';
import ProjectDisposeView from './ProjectDisposeView';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, match as Match } from 'react-router-dom';
import * as actionTypes from 'constants/actionTypes';
import { render, cleanup, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import useStepper from './hooks/useStepper';
import { noop } from 'lodash';

import * as redux from 'react-redux';

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn().mockReturnValue({ then: jest.fn() });
useDispatchSpy.mockReturnValue(mockDispatchFn);

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

jest.mock('./hooks/useStepper');
jest.mock('./hooks/useStepper');
(useStepper as jest.Mock).mockReturnValue({
  currentStatus: {},
  project: { projectNumber: '' },
  projectStatusCompleted: noop,
  canGoToStatus: noop,
});

const match: Match = {
  path: '/dispose',
  url: '/dispose',
  isExact: false,
  params: {},
};

const loc = {
  pathname: '/dispose/project/draft',
  search: '?projectNumber=SPP-10001',
  hash: '',
} as Location;

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
    [actionTypes.ProjectActions.GET_PROJECT]: {
      isFetching: false,
    },
  },
});

const errorStore = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: {},
  [reducerTypes.ProjectReducers.WORKFLOW]: mockWorkflow,
  [reducerTypes.NETWORK]: {
    [actionTypes.ProjectActions.GET_PROJECT]: {
      isFetching: false,
      error: 'error',
    },
  },
});

const renderElement = (store: any) => (
  <Provider store={store}>
    <Router history={history}>
      <ProjectDisposeView match={match} location={loc} />
    </Router>
  </Provider>
);

describe('Project Dispose View', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
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
