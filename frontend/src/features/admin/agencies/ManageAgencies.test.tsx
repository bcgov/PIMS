import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as actionTypes from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import ManageAgencies from './ManageAgencies';
import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

const history = createMemoryHistory();
history.push('admin/agencies');
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
    },
    [reducerTypes.LOOKUP_CODE]: lCodes,
    [reducerTypes.NETWORK]: {
      [actionTypes.GET_AGENCIES]: {
        isFetching: false,
      },
    },
  });

describe('Manage Agencies Component', () => {
  const componentRender = (store: any) =>
    create(
      <Provider store={store}>
        <Router history={history}>
          <ManageAgencies />
        </Router>
      </Provider>,
    );

  const testRender = (store: any) =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <ManageAgencies />
        </Router>
      </Provider>,
    );

  it('Snapshot matches', () => {
    const component = componentRender(getStore());
    expect(component.toJSON()).toMatchSnapshot();
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
