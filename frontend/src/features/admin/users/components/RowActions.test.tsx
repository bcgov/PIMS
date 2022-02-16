import { fireEvent, render, waitFor } from '@testing-library/react';
import { cleanup } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { RowActions } from './RowActions';

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
    users: {
      pagedUsers: {
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
      <MemoryRouter initialEntries={[history.location]}>
        <RowActions {...{ ...(props as any) }} />
      </MemoryRouter>
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
    const { container, findByText } = testRender(getStore(), tempProps);
    mockAxios.onPut().reply(200);
    fireEvent.click(container);
    const enableButton = await findByText('Enable');
    fireEvent.click(enableButton);
    await waitFor(() => expect(mockAxios.history.put).toHaveLength(1));
    await waitFor(() => expect(mockAxios.history.put[0].url).toBe('/api/keycloak/users/1'));
  });
  it('disable button', async () => {
    const tempProps = { ...props };
    tempProps.row.original.isDisabled = false;
    const { container, findByText } = testRender(getStore(), tempProps);
    mockAxios.onPut().reply(200);
    fireEvent.click(container);
    const disableButton = await findByText('Disable');
    fireEvent.click(disableButton);
    await waitFor(() => expect(mockAxios.history.put).toHaveLength(1));
    await waitFor(() => expect(mockAxios.history.put[0].url).toBe('/api/keycloak/users/1'));
  });
  it('open button', async () => {
    const { container, findByText } = testRender(getStore(), props);
    mockAxios.onGet().reply(200);
    fireEvent.click(container);
    const openButton = await findByText('Open');
    fireEvent.click(openButton);
    await waitFor(() => expect(history.location.pathname).toBe('/admin/user/1'));
  });
});
