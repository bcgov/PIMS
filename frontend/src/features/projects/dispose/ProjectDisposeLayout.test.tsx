import { useKeycloak } from '@react-keycloak/web';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as actionTypes from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { match as Match, Router } from 'react-router-dom';
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

const match: Match = {
  path: '/dispose',
  url: '/dispose',
  isExact: false,
  params: {},
};

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
    <Router history={history}>
      <ProjectDisposeLayout match={match} location={loc} />
    </Router>
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

  it('displays draft page at draft route', () => {
    history.push('/dispose/projects/draft');
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Project No.');
    expect(stepHeader).toBeVisible();
  });

  it('displays select properties at select properties route', () => {
    history.push('/dispose/projects/properties');
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Search and select 1 or more properties for the project');
    expect(stepHeader).toBeVisible();
  });

  it('displays update properties at the update properties route', () => {
    history.push('/dispose/projects/information');
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Properties in the Project');
    expect(stepHeader).toBeVisible();
  });

  it('displays documentation at the documentation route', () => {
    history.push('/dispose/projects/documentation');
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Documentation');
    expect(stepHeader).toBeVisible();
  });

  it('displays approval at the approval route', () => {
    history.push('/dispose/projects/approval');
    const { getAllByText } = render(uiElement);
    const stepHeaders = getAllByText('Approval');
    expect(stepHeaders.length).toBe(2);
  });

  it('displays review at the review route', () => {
    history.push('/dispose/projects/review');
    const { getAllByText } = render(uiElement);
    const stepHeaders = getAllByText('Review');
    expect(stepHeaders.length).toBe(2);
  });

  it('404s if given an invalid dispose route', () => {
    history.push('/dispose/project/fake');
    render(uiElement);
    expect(history.location.pathname).toBe('/page-not-found');
  });

  it('has next functionality', async () => {
    history.push('/dispose/projects/approval');
    const { getByText, getByLabelText } = render(uiElement);
    const nextButton = getByText('Next');
    const check = getByLabelText('has approval/authority', { exact: false });
    await act(async () => {
      fireEvent.click(check);
      await waitFor(() => {
        expect((check as any).checked).toBe(true);
      });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(goToNextStep).toHaveBeenCalled();
      });
    });
  });
});
