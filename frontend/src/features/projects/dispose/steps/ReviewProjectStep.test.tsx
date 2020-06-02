import React from 'react';
import renderer from 'react-test-renderer';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import ReviewProjectStep from './ReviewProjectStep';
import { ITask } from '../slices/projectTasksSlice';
import { IProject, IProjectTask } from '..';

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
    taskType: '1',
    sortOrder: 0,
    completedOn: new Date(),
  },
  {
    projectNumber: 123,
    taskId: 2,
    isOptional: true,
    isCompleted: true,
    name: 'task-1',
    description: 'two',
    taskType: '1',
    sortOrder: 0,
    completedOn: new Date(),
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
};

export const tasks: ITask[] = [
  {
    id: 1,
    name: 'task-0',
    sortOrder: 0,
    description: 'test',
    taskType: 1,
  },
  {
    id: 2,
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
