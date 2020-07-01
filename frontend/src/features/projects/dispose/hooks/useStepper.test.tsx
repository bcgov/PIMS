import React from 'react';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import * as actionTypes from 'constants/actionTypes';
import { renderHook } from '@testing-library/react-hooks';
import useStepper, {
  isStatusCompleted,
  isStatusNavigable,
  getLastCompletedStatus,
} from './useStepper';
import { IStatus, IProject } from '..';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const mockWorkflow: IStatus[] = [
  {
    description:
      'A new draft project that is not ready to submit to apply to be added to the Surplus Property Program.',
    route: '/projects/draft',
    isMilestone: false,
    code: 'DR',
    id: 1,
    name: 'Draft',
    sortOrder: 0,
    workflow: '',
    tasks: [],
  },
  {
    description: 'Add properties to the project.',
    route: '/projects/properties',
    isMilestone: false,
    code: 'DR-P',
    id: 2,
    name: 'Select Properties',
    sortOrder: 1,
    workflow: '',
    tasks: [],
  },
  {
    description: 'Assign tier level, classification and update current financial information.',
    route: '/projects/information',
    isMilestone: false,
    code: 'DR-I',
    id: 3,
    name: 'Update Information',
    sortOrder: 2,
    workflow: '',
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
    sortOrder: 3,
    workflow: '',
    tasks: [],
  },
  {
    description: 'The project is ready to be approved by owning agency.',
    route: '/projects/approval',
    isMilestone: false,
    code: 'DR-A',
    id: 5,
    name: 'Approval',
    sortOrder: 4,
    workflow: '',
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
    sortOrder: 5,
    workflow: '',
    tasks: [],
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
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
});

describe('useStepper hook functionality', () => {
  let hook: any = undefined;
  beforeAll(() => {
    hook = renderHook(() => useStepper(), {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <Router history={history}>{children}</Router>
        </Provider>
      ),
    });
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe('getNextStep', () => {
    it('draft step', () => {
      const { getNextStep } = hook.result.current;
      const nextStep = getNextStep(mockWorkflow[0]);
      expect(nextStep).toBe(mockWorkflow[1]);
    });

    it('review step', () => {
      const { getNextStep } = hook.result.current;
      const nextStep = getNextStep(mockWorkflow[5]);
      expect(nextStep).toBe(undefined);
    });

    it('undefined step', () => {
      const { getNextStep } = hook.result.current;
      const nextStep = getNextStep(undefined);
      expect(nextStep).toBe(mockWorkflow[0]);
    });
  });
  describe('isStatusCompleted', () => {
    it('true if current status less then project status', () => {
      const isComplete = isStatusCompleted(mockWorkflow, mockWorkflow[0], {
        statusId: 2,
      } as IProject);
      expect(isComplete).toBe(true);
    });
    it('false if current status equal to project status', () => {
      const isComplete = isStatusCompleted(mockWorkflow, mockWorkflow[0], {
        statusId: 1,
      } as IProject);
      expect(isComplete).toBe(false);
    });

    it('false if current status greater then project status', () => {
      const isComplete = isStatusCompleted(mockWorkflow, mockWorkflow[1], {
        statusId: 1,
      } as IProject);
      expect(isComplete).toBe(false);
    });

    it('false if passed invalid data', () => {
      const isComplete = isStatusCompleted(mockWorkflow, mockWorkflow[1], undefined);
      expect(isComplete).toBe(false);
    });
  });
  describe('isStatusNavigable', () => {
    it('true if status is equal to project status', () => {
      const isNavigable = isStatusNavigable(mockWorkflow, mockWorkflow[0], {
        statusId: 1,
      } as IProject);
      expect(isNavigable).toBe(true);
    });

    it('false if status is greater then project status', () => {
      const isNavigable = isStatusNavigable(mockWorkflow, mockWorkflow[2], {
        statusId: 1,
      } as IProject);
      expect(isNavigable).toBe(false);
    });

    it('true if status is less then project status', () => {
      const isNavigable = isStatusNavigable(mockWorkflow, mockWorkflow[0], {
        statusId: 2,
      } as IProject);
      expect(isNavigable).toBe(true);
    });

    it('false if project is undefined and not at draft status', () => {
      const isNavigable = isStatusNavigable(mockWorkflow, mockWorkflow[1], undefined);
      expect(isNavigable).toBe(false);
    });

    it('true if project is undefined and at draft status', () => {
      const isNavigable = isStatusNavigable(mockWorkflow, mockWorkflow[0], undefined);
      expect(isNavigable).toBe(true);
    });
  });
  describe('getLastCompletedStatus', () => {
    it('returns current status if status is equal to project status', () => {
      const lastCompletedStatus = getLastCompletedStatus(mockWorkflow, mockWorkflow[0], {
        statusId: 1,
      } as IProject);
      expect(lastCompletedStatus).toBe(mockWorkflow[0]);
    });

    it('returns project status if status is less then project status', () => {
      const lastCompletedStatus = getLastCompletedStatus(mockWorkflow, mockWorkflow[0], {
        statusId: 2,
      } as IProject);
      expect(lastCompletedStatus).toBe(mockWorkflow[1]);
    });

    it('returns current status if status is greater then project status', () => {
      const lastCompletedStatus = getLastCompletedStatus(mockWorkflow, mockWorkflow[1], {
        statusId: 1,
      } as IProject);
      expect(lastCompletedStatus).toBe(mockWorkflow[1]);
    });

    it('returns undefined if current status is undefined', () => {
      const lastCompletedStatus = getLastCompletedStatus(
        mockWorkflow,
        undefined as any,
        {
          statusId: 1,
        } as IProject,
      );
      expect(lastCompletedStatus).toBe(undefined);
    });
  });
});
