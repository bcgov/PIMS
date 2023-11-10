import { cleanup, render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import noop from 'lodash/noop';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import ManageAgencies from './ManageAgencies';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const history = createMemoryHistory();
history.push('/admin/agencies');
const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
  ] as ILookupCode[],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useRouteMatch: () => ({ url: '/admin/agencies', path: '/admin/agencies' }),
}));
const getStore = () =>
  mockStore({
    [reducerTypes.AGENCIES]: {
      pagedAgencies: {
        page: 1,
        pageIndex: 0,
        quantity: 10,
        total: 2,
        items: [
          {
            code: 'BCA',
            id: 41,
            isDisabled: false,
            name: 'BC Assessment',
            sendEmail: false,
            sortOrder: 0,
            type: 'Agency',
          },
          {
            code: 'TEST',
            id: 42,
            isDisabled: false,
            name: 'BC Test',
            sendEmail: true,
            sortOrder: 0,
            type: 'Agency',
            parentId: 12,
          },
        ],
      },
      rowsPerPage: 10,
    },
    [reducerTypes.LOOKUP_CODE]: lCodes,
    [reducerTypes.NETWORK]: {
      requests: {
        [actionTypes.GET_AGENCIES]: {
          isFetching: false,
        },
      },
    },
  });

describe('Manage Agencies Component', () => {
  beforeAll(() => {
    const { getComputedStyle } = window;
    window.getComputedStyle = (elt) => getComputedStyle(elt);
  });
  afterEach(() => {
    cleanup();
  });

  const testRender = (store: any) =>
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[history.location]}>
            <ManageAgencies />
          </MemoryRouter>
        </Provider>
      </Formik>,
    );

  it('Snapshot matches', () => {
    const { container } = testRender(getStore());
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays correct agency labels', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('BC Assessment')).toBeVisible();
    expect(queryByText('BC Test')).toBeVisible();
  });

  it('displays appropriate codes', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('BCA')).toBeVisible();
    expect(queryByText('TEST')).toBeVisible();
  });

  it('displays appropriate cols', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('Agency name')).toBeVisible();
    expect(queryByText('Short name')).toBeVisible();
    expect(queryByText('Description')).toBeVisible();
    expect(queryByText('Parent Agency')).toBeVisible();
  });
});
