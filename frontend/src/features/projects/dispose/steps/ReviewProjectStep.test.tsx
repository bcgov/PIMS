import React from 'react';
import renderer from 'react-test-renderer';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import ReviewProjectStep from './ReviewProjectStep';
import { DisposeWorkflowStatus, ITask, IProject, IProjectTask } from '../../common';
import { ProjectActions } from 'constants/actionTypes';

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
    [ProjectActions.GET_PROJECT]: {},
  },
});

const uiElement = (
  <Provider store={store}>
    <Router history={history}>
      <ReviewProjectStep />
    </Router>
  </Provider>
);

it('renders correctly', () => {
  const tree = renderer.create(uiElement).toJSON();
  expect(tree).toMatchSnapshot();
});
