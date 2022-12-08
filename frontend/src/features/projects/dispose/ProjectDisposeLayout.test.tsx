import { useKeycloak } from '@react-keycloak/web';
import { render } from '@testing-library/react';
import * as actionTypes from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import useProject from '../common/hooks/useProject';
import useStepForm from '../common/hooks/useStepForm';
import useStepper from './hooks/useStepper';
import ProjectDisposeLayout from './ProjectDisposeLayout';
import { mockWorkflow } from './testUtils';

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
jest.mock('./hooks/useStepper');
jest.mock('../common/hooks/useProject');
jest.mock('../common/hooks/useStepForm');
jest.mock('components/Table/Table', () => ({
  __esModule: true,
  default: () => <></>,
}));

const loc = {
  pathname: '/dispose/projects/draft',
  search: '?projectNumber=SPP-10001',
  hash: '',
} as Location;

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
    <MemoryRouter initialEntries={[history.location]}>
      <ProjectDisposeLayout match={null} location={loc} />
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
