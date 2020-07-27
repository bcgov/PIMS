import {
  IProjectTask,
  DisposeWorkflowStatus,
  IProject,
  ReviewWorkflowStatus,
  ITask,
  SPPApprovalTabs,
  NoteTypes,
} from '../common';
import { ProjectActions } from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as API from 'constants/API';

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
  notes: [
    {
      noteType: NoteTypes.General,
      note: 'general',
    },
    {
      noteType: NoteTypes.Public,
      note: 'public',
    },
    {
      noteType: NoteTypes.Private,
      note: 'private',
    },
    {
      noteType: NoteTypes.Exemption,
      note: 'exemption',
    },
    {
      noteType: NoteTypes.AgencyInterest,
      note: 'agencyinterest',
    },
    {
      noteType: NoteTypes.Financial,
      note: 'financial',
    },
    {
      noteType: NoteTypes.PreMarketing,
      note: 'premarketing',
    },
    {
      noteType: NoteTypes.Marketing,
      note: 'marketing',
    },
    {
      noteType: NoteTypes.ContractInPlace,
      note: 'contractinplace',
    },
    {
      noteType: NoteTypes.Reporting,
      note: 'reporting',
    },
    {
      noteType: NoteTypes.LoanTerms,
      note: 'loanterms',
    },
    {
      noteType: NoteTypes.Adjustment,
      note: 'adjustment',
    },
    {
      noteType: NoteTypes.SppCost,
      note: 'sppcost',
    },
    {
      noteType: NoteTypes.SppGain,
      note: 'sppgain',
    },
    {
      noteType: NoteTypes.SalesHistory,
      note: 'saleshistory',
    },
    {
      noteType: NoteTypes.CloseOut,
      note: 'closeout',
    },
    {
      noteType: NoteTypes.Comments,
      note: 'comments',
    },
  ],
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
    workflowCode: '',
    code: ReviewWorkflowStatus.ApprovedForErp,
    isMilestone: true,
    tasks: [],
    isOptional: false,
    isActive: true,
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

export const mockWorkflow = [
  {
    description:
      'A new draft project that is not ready to submit to apply to be added to the Surplus Property Program.',
    route: '/projects/draft',
    isMilestone: false,
    code: 'DR',
    id: 1,
    name: 'Draft',
    isDisabled: false,
    sortOrder: 0,
    isOptional: false,
    workflowCode: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUM=',
    isActive: true,
    tasks: [],
  },
  {
    description: 'Add properties to the project.',
    route: '/projects/properties',
    isMilestone: false,
    code: 'DR-P',
    id: 2,
    name: 'Select Properties',
    isDisabled: false,
    sortOrder: 1,
    isOptional: false,
    workflowCode: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUQ=',
    isActive: true,
    tasks: [],
  },
  {
    description: 'Assign tier level, classification and update current financial information.',
    route: '/projects/information',
    isMilestone: false,
    code: 'DR-I',
    id: 3,
    name: 'Update Information',
    isDisabled: false,
    sortOrder: 2,
    isOptional: false,
    workflowCode: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUU=',
    isActive: true,
    tasks: [],
  },
  {
    description:
      'Required documentation has been completed and sent (Surplus Declaration \u0026 Readiness Checklist, Triple Bottom Line).',
    route: '/projects/documentation',
    isMilestone: false,
    code: 'DR-D',
    id: 4,
    name: 'Required Documentation',
    isDisabled: false,
    sortOrder: 3,
    isOptional: false,
    workflowCode: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUY=',
    isActive: true,
    tasks: [],
  },
  {
    description: 'The project is ready to be approved by owning agency.',
    route: '/projects/approval',
    isMilestone: false,
    code: 'DR-A',
    id: 5,
    name: 'Approval',
    isDisabled: false,
    sortOrder: 4,
    isOptional: false,
    workflowCode: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUc=',
    isActive: true,
    tasks: [],
  },
  {
    description:
      'The project has been submitted for review to be added to the Surplus Property Program.',
    route: '/projects/review',
    isMilestone: false,
    code: 'DR-RE',
    id: 6,
    name: 'Review',
    isDisabled: false,
    sortOrder: 5,
    isOptional: false,
    workflowCode: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUg=',
    isActive: true,
    tasks: [],
  },
];

const mockStore = configureMockStore([thunk]);
export const getStore = (mockProject: IProject, tab?: SPPApprovalTabs) =>
  mockStore({
    [reducerTypes.LOOKUP_CODE]: {
      lookupCodes: [
        {
          code: 'BCT',
          name: 'BC Transit',
          id: 1,
          type: API.AGENCY_CODE_SET_NAME,
        },
      ],
    },
    [reducerTypes.ProjectReducers.PROJECT]: { project: mockProject },
    [reducerTypes.ProjectReducers.TASKS]: tasks,
    [reducerTypes.NETWORK]: {
      [ProjectActions.GET_PROJECT]: {},
    },
    [reducerTypes.ProjectReducers.SPL_TAB]: tab,
  });
