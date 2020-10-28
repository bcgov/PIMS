import ProjectListView from './ProjectListView';
import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, cleanup } from '@testing-library/react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import { Provider } from 'react-redux';
import * as reducerTypes from 'constants/reducerTypes';
import service from '../apiService';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import Claims from 'constants/claims';

const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});

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

const testData = {
  items: [
    {
      projectNumber: 'SPP-10015',
      name: 'Project name 16',
      statusId: 0,
      status: 'Draft',
      tierLevelId: 1,
      tierLevel: 'Tier 1',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      agencyId: 35,
      agency: 'AEST',
      subAgency: 'UOV',
      properties: [
        {
          id: 1,
          propertyTypeId: 1,
          description:
            'Gym, teaching kitchen, energy lab, greenhouse. Building full name: Center for Excellence in Sustainability',
          classification: 'Core Operational',
          agencyId: 0,
          subAgency: 'Nichola Valley Institute of Technology',
          agencyCode: 'AEST',
          address: '4155 Belshaw St',
          city: 'Merritt',
          netBook: 0,
          assessed: 0,
          estimated: 0,
          landArea: 26.9,
          createdOn: '2020-05-28T18:48:03.181977',
          rowVersion: 'AAAAAAAAfRA=',
        },
      ],
      createdBy: 'User, Administrator',
      createdOn: '2020-05-28T18:48:03.181976',
      rowVersion: 'AAAAAAAAfQ8=',
    },
  ],
  page: 1,
  quantity: 10,
  pageIndex: 0,
  total: 1,
};

// Set all module functions to jest.fn
jest.mock('../apiService');
const mockedService = service as jest.Mocked<typeof service>;

const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    {
      name: 'classificationVal',
      id: '1',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const history = createMemoryHistory();

describe('Project list view tests', () => {
  // clear mocks before each test
  beforeEach(() => {
    mockedService.getProjectList.mockClear();
    mockedService.deleteProject.mockClear();
    mockKeycloak([]);
  });
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('Matches snapshot', () => {
    mockedService.getProjectList.mockResolvedValueOnce(testData as any);

    const tree = create(
      <Provider store={store}>
        <Router history={history}>
          <ProjectListView />
        </Router>
      </Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Displays message for empty list', async () => {
    mockedService.getProjectList.mockResolvedValueOnce({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    const { findByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <ProjectListView />
        </Router>
      </Provider>,
    );

    // default table message when there is no data to display
    const noResults = await findByText('No rows to display');
    expect(noResults).toBeInTheDocument();
  });

  it('Does not display export buttons by default', async () => {
    mockedService.getProjectList.mockResolvedValueOnce({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    const { queryByText, queryByTitle } = render(
      <Provider store={store}>
        <Router history={history}>
          <ProjectListView />
        </Router>
      </Provider>,
    );
    expect(queryByTitle('Export Generic Report')).not.toBeInTheDOM();
    expect(queryByTitle('Export CSV')).not.toBeInTheDOM();
    expect(queryByText('SPL Report')).not.toBeInTheDOM();
  });

  it('Displays export buttons with view reports permission', async () => {
    mockKeycloak([Claims.REPORTS_VIEW]);
    mockedService.getProjectList.mockResolvedValueOnce({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    const { queryByTitle } = render(
      <Provider store={store}>
        <Router history={history}>
          <ProjectListView />
        </Router>
      </Provider>,
    );
    expect(queryByTitle('Export Generic Report')).toBeInTheDOM();
    expect(queryByTitle('Export CSV')).toBeInTheDOM();
  });

  it('Displays export buttons with spl reports permission', async () => {
    mockKeycloak([Claims.REPORTS_SPL]);
    mockedService.getProjectList.mockResolvedValueOnce({
      quantity: 0,
      total: 0,
      page: 1,
      pageIndex: 0,
      items: [],
    });

    const { queryByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <ProjectListView />
        </Router>
      </Provider>,
    );
    expect(queryByText('SPL Report')).toBeVisible();
  });
});
