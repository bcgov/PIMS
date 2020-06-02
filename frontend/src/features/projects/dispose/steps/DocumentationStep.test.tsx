import React from 'react';
import renderer from 'react-test-renderer';
import DocumentationStep from './DocumentationStep';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ITask } from '../slices/projectTasksSlice';
// import { render } from '@testing-library/react';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const tasks: ITask[] = [
  {
    id: 1,
    name: 'task-0',
    sortOrder: 0,
    description: 'Task #1',
    taskType: 1,
  },
  {
    id: 2,
    name: 'task-1',
    sortOrder: 0,
    description: 'Task #2',
    taskType: 1,
  },
];

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: {},
  [reducerTypes.ProjectReducers.TASKS]: tasks,
});

const uiElement = (
  <Provider store={store}>
    <Router history={history}>
      <DocumentationStep />
    </Router>
  </Provider>
);

it('renders correctly', () => {
  const tree = renderer.create(uiElement).toJSON();
  expect(tree).toMatchSnapshot();
});

// WIP - passes 90% of time but randomly get the error 'connect ECONNREFUSED 127.0.0.1:80'
// xit('renders correct labels', () => {
//   const { getByText } = render(uiElement);
//   const labelOne = getByText('Task #1');
//   const labelTwo = getByText('Task #2');
//   expect(labelOne).toBeTruthy();
//   expect(labelTwo).toBeTruthy();
// });
