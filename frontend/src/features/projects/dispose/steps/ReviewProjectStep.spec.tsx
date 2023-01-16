import { ProjectActions } from 'constants/actionTypes';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { DisposeWorkflowStatus } from 'features/projects/constants';
import { IProject, IProjectTask, ITask } from 'features/projects/interfaces';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';
import * as Vitest from 'vitest';
import { vi } from 'vitest';

import ReviewProjectStep from './ReviewProjectStep';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency = 1;

vi.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as Vitest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

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
    statusId: 0,
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
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
    statusId: 0,
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  },
];

const mockProject: IProject = {
  projectNumber: 'test-01',
  name: 'my project',
  description: 'my project description',
  properties: [],
  agencyId: 1,
  statusId: 0,
  statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  tierLevelId: 1,
  tasks: mockTasks,
  note: 'my notes',
  id: 1,
  fiscalYear: 2020,
  projectAgencyResponses: [],
  publicNote: 'public',
  privateNote: 'private',
  notes: [],
  statusHistory: [],
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
  [reducerTypes.ProjectReducers.PROJECT]: mockProject,
  [reducerTypes.ProjectReducers.TASKS]: tasks,
  [reducerTypes.NETWORK]: {
    requests: { [ProjectActions.GET_PROJECT]: {} },
  },
});

const uiElement = (
  <Provider store={store}>
    <MemoryRouter initialEntries={[history.location]}>
      <ReviewProjectStep />
    </MemoryRouter>
  </Provider>
);

it('renders correctly', () => {
  const tree = renderer.create(uiElement).toJSON();
  expect(tree).toMatchSnapshot();
});
