import React from 'react';
import { createMemoryHistory } from 'history';
import { act } from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as actionTypes from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import { ensureGridApiHasBeenSet } from '../../../utils/testUtils';
import ManageAccessRequests from './ManageAccessRequests';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

Enzyme.configure({ adapter: new Adapter() });

const history = createMemoryHistory();
history.push('admin');
const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useRouteMatch: () => ({ url: '/admin', path: '/admin' }),
}));

const initialState = {
  [reducerTypes.ACCESS_REQUEST]: {
    pagedAccessRequests: { page: 0, total: 0, quantity: 0, items: [] },
  },
  [reducerTypes.NETWORK]: {
    [actionTypes.GET_REQUEST_ACCESS]: {
      isFetching: false,
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
};
// Empty response
const store = mockStore(initialState);
const successStore = mockStore({
  [reducerTypes.ACCESS_REQUEST]: {
    pagedAccessRequests: {
      page: 1,
      total: 2,
      quantity: 2,
      items: [
        {
          id: 1,
          roles: [{ id: '1' }],
          agencies: [{ id: '1' }],
          user: {
            displayName: 'testUser',
          },
        },
        {
          id: 2,
          roles: [{ id: '2' }],
          agencies: [{ id: '1' }],
          user: {
            displayName: 'testUser',
          },
        },
      ],
    },
  },
  [reducerTypes.NETWORK]: {
    [actionTypes.GET_REQUEST_ACCESS]: {
      isFetching: false,
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const componentRender = async (store: any) => {
  let provider;
  act(() => {
    provider = mount(
      <Provider store={store}>
        <ManageAccessRequests />
      </Provider>,
    );
  });
  return provider;
};

describe('component with access requests', () => {
  let component: any;
  let agGrid: AgGridReact;
  beforeEach(async done => {
    component = await componentRender(successStore);
    agGrid = component.find(AgGridReact).instance() as AgGridReact;
    ensureGridApiHasBeenSet(component).then(
      () => done(),
      () => fail('Grid API not set within expected time limits'),
    );
  });

  it('renders all rows', () => {
    expect(!!agGrid.api).toBeTruthy();
    agGrid.api?.selectAll();
    expect(agGrid.api?.getSelectedNodes().length).toStrictEqual(2);
  });
});

describe('component functionality', () => {
  let component: any;
  let agGrid: AgGridReact;
  beforeEach(async done => {
    component = await componentRender(store);
    agGrid = component.find(AgGridReact).instance() as AgGridReact;
    ensureGridApiHasBeenSet(component).then(
      () => done(),
      () => fail('Grid API not set within expected time limits'),
    );
  });

  it('renders no rows to show', () => {
    expect(!!agGrid.api).toBeTruthy();
    agGrid.api?.selectAll();
    expect(agGrid.api?.getSelectedNodes().length).toStrictEqual(0);
  });
});
