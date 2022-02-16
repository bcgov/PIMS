import { useKeycloak } from '@react-keycloak/web';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ProjectActions } from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import { DisposeWorkflowStatus } from 'features/projects/constants';
import { IProjectTask } from 'features/projects/interfaces';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import DocumentationStep from './DocumentationStep';

const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});
jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
      roles: [],
    },
    subject: 'test',
  },
});

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const tasks: IProjectTask[] = [
  {
    projectNumber: 1,
    isCompleted: false,
    isOptional: false,
    completedOn: new Date(),
    taskId: 1,
    name: 'task-0',
    sortOrder: 0,
    description: 'Task #1',
    taskType: 1,
    statusId: 0,
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  },
  {
    projectNumber: 1,
    isCompleted: false,
    isOptional: false,
    completedOn: new Date(),
    taskId: 2,
    name: 'task-1',
    sortOrder: 0,
    description: 'Task #2',
    taskType: 1,
    statusId: 0,
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  },
];

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: { project: { tasks: tasks } },
  [reducerTypes.ProjectReducers.TASKS]: tasks,
  [reducerTypes.NETWORK]: {
    [ProjectActions.GET_PROJECT]: {},
  },
});

const uiElement = (
  <Provider store={store}>
    <MemoryRouter initialEntries={[history.location]}>
      <DocumentationStep />
    </MemoryRouter>
  </Provider>
);

describe('Documentation Step', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders correctly', () => {
    const { container } = render(uiElement);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correct labels', () => {
    const { getByText } = render(uiElement);
    expect(getByText('Task #1')).toBeInTheDocument();
    expect(getByText('Task #2')).toBeInTheDocument();
  });

  it('documentation validation works', async () => {
    const { getAllByText, container } = render(uiElement);
    const form = container.querySelector('form');
    await waitFor(() => {
      fireEvent.submit(form!);
    });
    expect(getAllByText('Required')).toHaveLength(2);
  });
});
