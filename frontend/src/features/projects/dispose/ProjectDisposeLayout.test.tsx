import React from 'react';
import renderer from 'react-test-renderer';
import ProjectDisposeLayout from './ProjectDisposeLayout';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, match as Match } from 'react-router-dom';
import * as actionTypes from 'constants/actionTypes';
import useStepper from './hooks/useStepper';
import useStepForm from '../common/hooks/useStepForm';
import { noop } from 'lodash';
import { render, fireEvent, wait } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useProject from '../common/hooks/useProject';

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
  pathname: '/dispose/project/draft',
  search: '?projectNumber=SPP-10001',
  hash: '',
} as Location;

const mockWorkflow = [
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
    workflow: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUM=',
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
    workflow: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUQ=',
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
    workflow: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUU=',
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
    workflow: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUY=',
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
    workflow: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUc=',
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
    workflow: 'SUBMIT-DISPOSAL',
    type: 'ProjectStatus',
    createdOn: '2020-06-29T04:46:45.2666667',
    rowVersion: 'AAAAAAAACUg=',
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
      project: { projectNumber: '', statusId: 5 },
      projectStatusCompleted: noop,
      canGoToStatus: noop,
      getStatusByCode: noop,
      goToNextStep: goToNextStep,
      getNextStep: () => mockWorkflow[5],
    });
    (useProject as jest.Mock).mockReturnValue({
      project: { projectNumber: '', statusId: 5 },
    });
    (useStepForm as jest.Mock).mockReturnValue({
      noFetchingProjectRequests: true,
      canUserEditForm: () => true,
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
    const tree = renderer.create(uiElement).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays draft page at draft route', () => {
    history.location.pathname = '/dispose/projects/draft';
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Project No.');
    expect(stepHeader).toBeVisible();
  });

  it('displays select properties at select properties route', () => {
    history.location.pathname = '/dispose/projects/properties';
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Search and select 1 or more properties for the project');
    expect(stepHeader).toBeVisible();
  });

  it('displays update properties at the update properties route', () => {
    history.location.pathname = '/dispose/projects/information';
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Properties in the Project');
    expect(stepHeader).toBeVisible();
  });

  it('displays documentation at the documentation route', () => {
    history.location.pathname = '/dispose/projects/documentation';
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Documentation');
    expect(stepHeader).toBeVisible();
  });

  it('displays approval at the approval route', () => {
    history.location.pathname = '/dispose/projects/approval';
    const { getAllByText } = render(uiElement);
    const stepHeaders = getAllByText('Approval');
    expect(stepHeaders.length).toBe(2);
  });

  it('displays review at the review route', () => {
    history.location.pathname = '/dispose/projects/review';
    const { getAllByText } = render(uiElement);
    const stepHeaders = getAllByText('Review');
    expect(stepHeaders.length).toBe(2);
  });

  it('404s if given an invalid dispose route', () => {
    history.location.pathname = '/dispose/project/draft';
    render(uiElement);
    expect(history.location.pathname).toBe('/page-not-found');
  });

  it('has next functionality', async done => {
    history.location.pathname = '/dispose/projects/approval';
    const { getByText, getByLabelText } = render(uiElement);
    const nextButton = getByText('Next');
    const check = getByLabelText(/Pims User/, { exact: false });
    await act(async () => {
      fireEvent.click(check);
      await wait(() => {
        expect((check as any).checked).toBe(true);
      });
      fireEvent.click(nextButton);

      await wait(() => {
        expect(goToNextStep).toHaveBeenCalled();
      });
    });
    done();
  });
});
