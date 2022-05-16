import React from 'react';
import { RowActions } from './RowActions';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reducerTypes from 'constants/reducerTypes';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { cleanup } from '@testing-library/react-hooks';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
const mockAxios = new MockAdapter(axios);

const getItems = (disabled?: boolean) => [
  {
    id: '1',
    username: 'testername1',
    firstName: 'testUserFirst1',
    lastName: 'testUserLast1',
    isDisabled: !!disabled,
    position: 'tester position',
    agencies: [{ id: '1', name: 'HLTH' }],
    roles: [{ id: '1', name: 'admin' }],
    lastLogin: '2020-10-14T17:45:39.7381599',
  },
];

const getStore = (disabled?: boolean) =>
  mockStore({
    [reducerTypes.ACCESS_REQUEST]: {
      pagedAccessRequests: {
        pageIndex: 0,
        total: 1,
        quantity: 1,
        items: getItems(disabled),
      },
      filter: {},
      rowsPerPage: 10,
    },
  });
const props = { data: getItems(), row: { original: { id: '1', isDisabled: false } } };
const testRender = (store: any, props: any) =>
  render(
    <Provider store={store}>
      <Router history={history}>
        <RowActions {...{ ...(props as any) }} />
      </Router>
    </Provider>,
  );

describe('rowAction functions', () => {
  beforeEach(() => {
    mockAxios.resetHistory();
  });
  afterEach(() => {
    cleanup();
  });
  it('enable button', async () => {
    const tempProps = { ...props };
    tempProps.row.original.isDisabled = true;
    const { container, getByText } = testRender(getStore(), tempProps);
    mockAxios.onPut().reply(200);
    fireEvent.click(container);
    const approveButton = getByText('Approve');
    fireEvent.click(approveButton);
    await waitFor(() => expect(mockAxios.history.put).toHaveLength(1));
    await waitFor(() =>
      expect(mockAxios.history.put[0].url).toBe('/api/keycloak/users/access/request'),
    );
  });
  it('disable button', async () => {
    const tempProps = { ...props };
    tempProps.row.original.isDisabled = false;
    const { container, getByText } = testRender(getStore(), props);
    mockAxios.onPut().reply(200);
    fireEvent.click(container);
    const holdButton = getByText('Hold');
    fireEvent.click(holdButton);
    await waitFor(() => expect(mockAxios.history.put).toHaveLength(1));
    await waitFor(() =>
      expect(mockAxios.history.put[0].url).toBe('/api/keycloak/users/access/request'),
    );
  });
  it('open button', async () => {
    const { container, getByText } = testRender(getStore(), props);
    mockAxios.onGet().reply(200);
    fireEvent.click(container);
    const declineButton = getByText('Decline');
    fireEvent.click(declineButton);
    await waitFor(() => expect(mockAxios.history.put).toHaveLength(1));
    await waitFor(() =>
      expect(mockAxios.history.put[0].url).toBe('/api/keycloak/users/access/request'),
    );
  });
});
