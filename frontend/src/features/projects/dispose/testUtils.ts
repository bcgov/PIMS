import { IProjectTask, DisposeWorkflowStatus, IProject, ReviewWorkflowStatus, ITask } from '.';
import { ProjectActions } from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

export const mockTasks: IProjectTask[] = [
  {
    projectNumber: 123,
    taskId: 1,
    isOptional: true,
    isCompleted: false,
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

export const mockProject: IProject = {
  projectNumber: 'test-01',
  name: 'my project',
  description: 'my project description',
  privateNote: 'private note',
  publicNote: 'public note',
  properties: [],
  agencyId: 1,
  statusId: 0,
  statusCode: ReviewWorkflowStatus.ApprovedForErp,
  status: {
    id: 1,
    name: 'Approved for ERP',
    sortOrder: 0,
    route: '',
    description: '',
    workflow: '',
    code: ReviewWorkflowStatus.ApprovedForErp,
    isMilestone: true,
    tasks: [],
  },
  tierLevelId: 1,
  tasks: mockTasks,
  note: 'my notes',
  id: 1,
  fiscalYear: 2020,
  projectAgencyResponses: [],
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

const mockStore = configureMockStore([thunk]);
export const getStore = (mockProject: IProject) =>
  mockStore({
    [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
    [reducerTypes.ProjectReducers.PROJECT]: { project: mockProject },
    [reducerTypes.ProjectReducers.TASKS]: tasks,
    [reducerTypes.NETWORK]: {
      [ProjectActions.GET_PROJECT]: {},
    },
  });
