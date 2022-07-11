import { useKeycloak } from '@react-keycloak/web';
import { fireEvent, render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ManageAdminAreas from './ManageAdminAreas';

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
const mockAxios = new MockAdapter(axios);

const history = createMemoryHistory();
const lCodes = {
  lookupCodes: [
    {
      name: 'Test 1',
      isDisabled: false,
      id: '1',
      code: '1',
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
    {
      name: 'Test 2',
      isDisabled: false,
      id: '2',
      code: '2',
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});
it('renders correctly', () => {
  mockAxios.onAny().reply(200, { items: [{ name: 'test' }] });
  const { asFragment } = render(
    <Provider store={store}>
      <Router history={history}>
        <ManageAdminAreas />
      </Router>
    </Provider>,
  );
  expect(asFragment()).toMatchSnapshot();
});

xit('displays items in table', () => {
  mockAxios.onGet().reply(200, {
    items: [
      {
        abbreviation: '2',
        createdOn: '2021-09-16T23:33:06.1766667',
        groupName: 'Group Name 1',
        id: 2,
        isDisabled: false,
        name: 'Test 1',
        rowVersion: 'AAAAAAAADLg=',
        sortOrder: 0,
        type: 'AdministrativeArea',
        updatedByEmail: 'unknown',
        updatedByName: 'unknown',
      },
      {
        abbreviation: '3',
        createdOn: '2021-09-16T23:33:06.1766667',
        groupName: 'Group Name 2',
        id: 2,
        isDisabled: false,
        name: 'Test 2',
        rowVersion: 'AAAAAAAADLg=',
        sortOrder: 0,
        type: 'AdministrativeArea',
        updatedByEmail: 'unknown',
        updatedByName: 'unknown',
      },
    ],
  });

  const { getByText } = render(
    <Provider store={store}>
      <Router history={history}>
        <ManageAdminAreas />
      </Router>
    </Provider>,
  );
  expect(getByText('Test 1')).toBeInTheDocument();
  expect(getByText('Test 2')).toBeInTheDocument();
});

it('admin areas populated correctly as filter option', () => {
  const { container, getByText } = render(
    <Provider store={store}>
      <Router history={history}>
        <ManageAdminAreas />
      </Router>
    </Provider>,
  );
  const nameFilter = container.querySelector('input[name="id"]');
  fireEvent.change(nameFilter!, { target: { value: 'Test 2' } });
  const option = getByText('Test 2');
  expect(option).toBeInTheDocument();
});

it('displays tooltip corrrectly', () => {
  const { container, getByText } = render(
    <Provider store={store}>
      <Router history={history}>
        <ManageAdminAreas />
      </Router>
    </Provider>,
  );
  const toolTip = container.querySelector('svg[class="tooltip-icon"]');
  fireEvent.mouseOver(toolTip!);
  expect(
    getByText('Click the corresponding row to edit the administrative area'),
  ).toBeInTheDocument();
});
