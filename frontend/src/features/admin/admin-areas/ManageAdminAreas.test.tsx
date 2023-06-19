import { fireEvent, render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import ManageAdminAreas from './ManageAdminAreas';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);
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

describe('Edit Admin Areas', () => {
  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = false;
  });

  it('renders correctly', () => {
    mockAxios.onAny().reply(200, { items: [{ name: 'test' }] });
    const { asFragment } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <ManageAdminAreas />
        </MemoryRouter>
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
        <MemoryRouter initialEntries={[history.location]}>
          <ManageAdminAreas />
        </MemoryRouter>
      </Provider>,
    );
    expect(getByText('Test 1')).toBeInTheDocument();
    expect(getByText('Test 2')).toBeInTheDocument();
  });

  it('admin areas populated correctly as filter option', () => {
    const { container, getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <ManageAdminAreas />
        </MemoryRouter>
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
        <MemoryRouter initialEntries={[history.location]}>
          <ManageAdminAreas />
        </MemoryRouter>
      </Provider>,
    );
    const toolTip = container.querySelector('svg[class="tooltip-icon"]');
    fireEvent.mouseOver(toolTip!);
    expect(
      getByText('Click the corresponding row to edit the administrative area'),
    ).toBeInTheDocument();
  });
});
