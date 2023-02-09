import { render } from '@testing-library/react';
import * as actionTypes from 'constants/actionTypes';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import useProject from '../common/hooks/useProject';
import useStepForm from '../common/hooks/useStepForm';
import useStepper from './hooks/useStepper';
import ProjectDisposeLayout from './ProjectDisposeLayout';
import { mockWorkflow } from './testUtils';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const mockStore = configureMockStore([thunk]);

jest.mock('./hooks/useStepper');
jest.mock('../common/hooks/useProject');
jest.mock('../common/hooks/useStepForm');
jest.mock('components/Table/Table', () => ({
  __esModule: true,
  default: () => <></>,
}));

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: {},
  [reducerTypes.ProjectReducers.WORKFLOW]: mockWorkflow,
  [reducerTypes.NETWORK]: {
    requests: {
      [actionTypes.ProjectActions.GET_PROJECT]: {
        isFetching: false,
      },
    },
  },
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
});

const uiElement = (
  <Provider store={store}>
    <MemoryRouter initialEntries={['/dispose?projectNumber=SPP-10001']}>
      <ProjectDisposeLayout />
    </MemoryRouter>
  </Provider>
);

describe('dispose project draft step display', () => {
  const goToNextStep = jest.fn();
  const onSubmit = jest.fn();
  const onSave = jest.fn();

  beforeAll(() => {
    (useStepper as jest.Mock).mockReturnValue({
      currentStatus: mockWorkflow[4],
      project: {
        projectNumber: '',
        statusId: 5,
        netBook: 1,
        market: 1,
        assessed: 2,
        name: 'name',
        properties: [{}],
      },
      projectStatusCompleted: noop,
      canGoToStatus: noop,
      getStatusByCode: noop,
      goToNextStep: goToNextStep,
      getNextStep: () => mockWorkflow[5],
      workflowStatuses: mockWorkflow,
    });
    (useProject as jest.Mock).mockReturnValue({
      project: { projectNumber: '', statusId: 5 },
    });
    (useStepForm as jest.Mock).mockReturnValue({
      noFetchingProjectRequests: true,
      canUserEditForm: () => true,
      canUserSubmitForm: () => true,
      onSubmit: onSubmit,
      onSave: onSave,
      addOrUpdateProject: () => ({
        then: (func: Function) => func({}),
      }),
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    goToNextStep.mockReset();
  });

  it('stepper renders correctly based off of workflow', () => {
    const { container } = render(uiElement);
    expect(container.firstChild).toMatchSnapshot();
  });
});
