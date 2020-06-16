import React from 'react';
import renderer from 'react-test-renderer';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { IProject, IProjectTask } from '..';
import { DisposeWorkflowStatus, ITask } from '../interfaces';
import { ProjectActions } from 'constants/actionTypes';
import ReviewApproveStep from './ReviewApproveStep';
import { render } from '@testing-library/react';
import { useKeycloak } from '@react-keycloak/web';
import { Claims } from 'constants/claims';

jest.mock('@react-keycloak/web');
const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      userInfo: {
        agencies: [1],
        roles: claims,
      },
      subject: 'test',
    },
  });
};

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const mockTasks: IProjectTask[] = [
  {
    projectNumber: 123,
    taskId: 1,
    isOptional: true,
    isCompleted: true,
    name: 'task-0',
    description: 'one',
    taskType: 1,
    sortOrder: 0,
    completedOn: new Date(),
    statusId: DisposeWorkflowStatus.RequiredDocumentation,
  },
  {
    projectNumber: 123,
    taskId: 2,
    isOptional: true,
    isCompleted: true,
    name: 'task-1',
    description: 'two',
    taskType: 1,
    sortOrder: 0,
    completedOn: new Date(),
    statusId: DisposeWorkflowStatus.RequiredDocumentation,
  },
];

const mockProject: IProject = {
  projectNumber: 'test-01',
  name: 'my project',
  description: 'my project description',
  properties: [],
  agencyId: 1,
  statusId: 0,
  tierLevelId: 1,
  tasks: mockTasks,
  note: 'my notes',
  id: 1,
};

export const tasks: ITask[] = [
  {
    taskId: 1,
    name: 'task-0',
    sortOrder: 0,
    description: 'test',
    taskType: 1,
  },
  {
    taskId: 2,
    name: 'task-1',
    sortOrder: 0,
    description: 'test',
    taskType: 1,
  },
];

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
  [reducerTypes.ProjectReducers.PROJECT]: { project: mockProject },
  [reducerTypes.ProjectReducers.TASKS]: tasks,
  [reducerTypes.NETWORK]: {
    [ProjectActions.GET_PROJECT]: {},
  },
});

const getReviewApproveStep = (storeOverride?: any) => (
  <Provider store={storeOverride ?? store}>
    <Router history={history}>
      <ReviewApproveStep />
    </Router>
  </Provider>
);

describe('Review Approve Step', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    mockKeycloak([]);
  });
  it('renders correctly', () => {
    const tree = renderer.create(getReviewApproveStep()).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('edit button is visible when agency matches and user has correct claims', () => {
    mockKeycloak([Claims.PROJECT_EDIT]);
    const { getByText } = render(getReviewApproveStep());
    const editButton = getByText(/Edit/);
    expect(editButton).toBeTruthy();
  });
  it('edit button is not visible when user does not have required agency/claims', () => {
    const { queryByText } = render(getReviewApproveStep());
    const editButton = queryByText(/Edit/);
    expect(editButton).toBeFalsy();
  });
});
