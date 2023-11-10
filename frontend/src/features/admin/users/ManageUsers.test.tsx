import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import moment from 'moment';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';
import { fillInput } from 'utils/testUtils';

import { ManageUsers } from './ManageUsers';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const history = createMemoryHistory();
history.push('/admin');
const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'disabledRole', id: '2', isDisabled: true, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};
const mockAxios = new MockAdapter(axios);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useRouteMatch: () => ({ url: '/admin', path: '/admin' }),
}));
const getStore = (includeDate?: boolean) =>
  mockStore({
    [reducerTypes.USERS]: {
      pagedUsers: {
        pageIndex: 0,
        total: 2,
        quantity: 2,
        items: [
          {
            id: '1',
            username: 'tester',
            firstName: 'firstName',
            lastName: 'lastName',
            isDisabled: false,
            position: 'tester position',
            agencies: [{ id: '1', name: 'HLTH' }],
            roles: [{ id: '1', name: 'admin' }],
            lastLogin: includeDate ? '2020-10-14T17:45:39.7381599' : null,
          },
          {
            id: '2',
            username: 'testername2',
            firstName: 'testUser',
            lastName: 'testUser',
            isDisabled: true,
            position: 'tester',
            agencies: [{ id: '1', name: 'HLTH' }],
            roles: [{ id: '1', name: 'admin' }],
            lastLogin: includeDate ? '2020-10-14T17:46:39.7381599' : null,
          },
        ],
      },
      filter: { firstName: '' },
      rowsPerPage: 10,
    },
    [reducerTypes.LOOKUP_CODE]: lCodes,
    [reducerTypes.NETWORK]: {
      requests: {
        [actionTypes.GET_USERS]: {
          isFetching: false,
        },
      },
    },
  });

describe('Manage Users Component', () => {
  beforeEach(() => {
    mockAxios.resetHistory();
  });

  afterEach(() => {
    cleanup();
  });
  const testRender = (store: any) =>
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[history.location]}>
            <ManageUsers />
          </MemoryRouter>
        </Provider>
      </Formik>,
    );

  it('Snapshot matches', () => {
    const { container } = testRender(getStore());
    expect(container.firstChild).toMatchSnapshot();
  });

  it('Table row count is 2', () => {
    const { container } = testRender(getStore());
    const rows = container.querySelectorAll('.tbody .tr');
    expect(rows.length).toBe(2);
  });

  it('displays agencies dropdown', async () => {
    const { getByRole, container } = testRender(getStore());
    const agency = container.querySelector('input[name="agency"]');

    await waitFor(() => {
      fireEvent.change(agency!, {
        target: {
          value: 'age',
        },
      });
    });
    expect(getByRole('listbox')).toBeInTheDocument();
  });

  it('displays enabled roles', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('roleVal')).toBeVisible();
  });

  it('Does not display disabled roles', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('disabledRole')).toBeNull();
  });

  it('Displays the correct last login time', () => {
    const dateTime = moment.utc('2020-10-14T17:45:39.7381599').local().format('YYYY-MM-DD hh:mm a');
    const { getByText } = testRender(getStore(true));
    expect(getByText(dateTime)).toBeVisible();
  });

  it('downloads data when excel icon clicked', async () => {
    const { getByTestId } = testRender(getStore());
    const excelIcon = getByTestId('excel-icon');
    mockAxios.onGet().reply(200);

    act(() => {
      fireEvent.click(excelIcon);
    });
    await waitFor(() => {
      expect(mockAxios.history.get.length).toBe(1);
    });
  });

  it('can search for users', async () => {
    const { container } = testRender(getStore());
    fillInput(container, 'firstName', 'firstName');
    const searchButton = container.querySelector('#search-button');
    mockAxios.onPost().reply(200);
    act(() => {
      fireEvent.click(searchButton!);
    });
    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
    });
  });
});
