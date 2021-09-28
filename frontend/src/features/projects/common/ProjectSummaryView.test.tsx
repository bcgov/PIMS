import React from 'react';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ProjectActions } from 'constants/actionTypes';
import { render } from '@testing-library/react';
import { useKeycloak } from '@react-keycloak/web';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { IProjectTask, ITask, IProject } from 'features/projects/interfaces';
import { ProjectSummaryView } from '../dispose';

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
    statusId: 0,
    statusCode: ReviewWorkflowStatus.PropertyReview,
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
    statusCode: ReviewWorkflowStatus.PropertyReview,
  },
];

const getMockProject = (statusCode?: string): IProject => ({
  projectNumber: 'test-01',
  name: 'my project',
  description: 'my project description',
  privateNote: 'private note',
  properties: [],
  agencyId: 1,
  statusId: 0,
  tierLevelId: 1,
  tasks: mockTasks,
  note: 'my notes',
  notes: [],
  publicNote: '',
  id: 1,
  fiscalYear: 2020,
  projectAgencyResponses: [],
  statusCode: statusCode ?? ReviewWorkflowStatus.PropertyReview,
  status: {
    id: 0,
    name: 'test',
    sortOrder: 0,
    description: '',
    isMilestone: false,
    tasks: [],
    route: '',
    code: statusCode ?? ReviewWorkflowStatus.PropertyReview,
    isOptional: false,
    isActive: false,
    workflowCode: '',
  },
  marketedOn: '2020-01-01',
  offerAcceptedOn: '2020-01-01',
  purchaser: 'purchaser',
  offerAmount: 2,
  disposedOn: '2020-01-01',
  gainBeforeSpl: -13,
  programCost: 4,
  actualFiscalYear: '2020',
  plannedFutureUse: 'future',
  preliminaryFormSignedBy: 'prelimsign',
  finalFormSignedBy: 'finalsign',
  interestComponent: 5,
  loanTermsNote: 'loannote',
  ocgFinancialStatement: 6,
  salesCost: 7,
  netProceeds: -17,
  market: 9,
  netBook: 10,
  gainNote: 'gainNote',
  programCostNote: 'programcostnote',
  priorYearAdjustmentAmount: 9,
  remediationNote: 'remediationNote',
  adjustmentNote: 'adjustmentNote',
  closeOutNote: 'closeOutNote',
  salesHistoryNote: 'salesHistoryNote',
  comments: 'comments',
  removalFromSplRequestOn: '2020-01-01',
  removalFromSplApprovedOn: '2020-01-01',
  removalFromSplRationale: 'rationale',
});

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

const getStore = (statusCode?: string) =>
  mockStore({
    [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
    [reducerTypes.ProjectReducers.PROJECT]: { project: getMockProject(statusCode) },
    [reducerTypes.ProjectReducers.TASKS]: tasks,
    [reducerTypes.NETWORK]: {
      [ProjectActions.GET_PROJECT]: {},
    },
  });

const getSummary = (statusCode?: string) => (
  <Provider store={getStore(statusCode)}>
    <Router history={history}>
      <ProjectSummaryView />
    </Router>
  </Provider>
);

describe('Review Summary View', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    const mockAxios = new MockAdapter(axios);
    mockAxios.onAny().reply(200, {});
    mockKeycloak([]);
  });
  it('renders submitted correctly', () => {
    const { container } = render(getSummary(ReviewWorkflowStatus.PropertyReview));
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders denied correctly', () => {
    const { container } = render(getSummary(ReviewWorkflowStatus.Denied));
    expect(container.firstChild).toMatchSnapshot();
  });
  it('renders approved correctly', () => {
    const { container } = render(getSummary(ReviewWorkflowStatus.ApprovedForErp));
    expect(container.firstChild).toMatchSnapshot();
  });
  describe('field behaviour', () => {
    it('edit button is not visible', () => {
      const { queryByText } = render(getSummary());
      const editButton = queryByText(/Edit/);
      expect(editButton).toBeFalsy();
    });
    it('form fields are disabled', () => {
      const { queryAllByRole } = render(getSummary());
      const notes = queryAllByRole('textbox');
      notes.forEach(note => {
        expect(note).toBeVisible();
        expect(note).toBeDisabled();
      });
    });
  });
});
