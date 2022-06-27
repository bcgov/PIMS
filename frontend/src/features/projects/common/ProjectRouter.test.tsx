import { useKeycloak } from '@react-keycloak/web';
import { render } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actionTypes from 'constants/actionTypes';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { match as Match, Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import useProject from '../common/hooks/useProject';
import useStepForm from '../common/hooks/useStepForm';
import { mockWorkflow } from '../dispose/testUtils';
import ProjectRouter from './ProjectRouter';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
jest.mock('../common/hooks/useProject');
jest.mock('../common/hooks/useStepForm');
jest.mock('components/Table/Table', () => ({
  __esModule: true,
  default: () => <></>,
}));
jest.mock('@react-keycloak/web');
const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      userInfo: {
        agencies: [1],
        roles: claims,
      },
      subject: 'test',
      authenticated: true,
    },
  });
};
const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});

const match: Match = {
  path: '/',
  url: '/',
  isExact: false,
  params: {},
};

const loc = {
  pathname: '/projects/assess/properties?projectNumber=SPP-10001',
  search: '?projectNumber=SPP-10001',
  hash: '',
} as Location;

const store = mockStore({
  [reducerTypes.ProjectReducers.PROJECT]: { project: {} },
  [reducerTypes.ProjectReducers.WORKFLOW]: mockWorkflow,
  [reducerTypes.NETWORK]: {
    requests: {
      [actionTypes.ProjectActions.GET_PROJECT_WORKFLOW]: {
        isFetching: false,
      },
    },
  },
  [reducerTypes.LOOKUP_CODE]: { lookupCodes: [] },
});

const uiElement = (
  <Provider store={store}>
    <Router history={history}>
      <ProjectRouter match={match} location={loc} />
    </Router>
  </Provider>
);
describe('project router', () => {
  const goToNextStep = jest.fn();
  const onSubmit = jest.fn();
  const onSave = jest.fn();
  beforeAll(() => {
    (useProject as jest.Mock).mockReturnValue({
      project: {
        projectNumber: 'SPP-10001',
        statusId: 5,
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
      },
    });
    (useStepForm as jest.Mock).mockReturnValue({
      noFetchingProjectRequests: true,
      canUserOverride: () => false,
      canUserEditForm: () => true,
      onSubmit: onSubmit,
      onSave: onSave,
      canUserApproveForm: () => true,
      addOrUpdateProject: () => ({
        then: (func: Function) => func({}),
      }),
    });
    mockKeycloak([Claims.ADMIN_PROJECTS, Claims.PROJECT_VIEW, Claims.DISPOSE_APPROVE]);
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    goToNextStep.mockReset();
  });

  it('displays select properties page at correct route', () => {
    history.push('/projects/assess/properties/update');
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Search and select 1 or more properties for the project');
    expect(stepHeader).toBeVisible();
  });

  it('displays review approval form at correct route', () => {
    history.push('/projects/assess/properties');
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Project Application Review');
    expect(stepHeader).toBeVisible();
  });

  it('displays summary page at the correct route', () => {
    history.push('/projects/summary');
    const { getByText } = render(uiElement);
    const stepHeader = getByText('Project No.:');
    expect(stepHeader).toBeVisible();
  });

  it('404s if given an invalid dispose route', () => {
    history.push('/projects/invalid');
    render(uiElement);
    expect(history.location.pathname).toBe('/page-not-found');
  });
});
