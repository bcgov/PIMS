import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reducerTypes from 'constants/reducerTypes';
import { useRouterFilter } from './useRouterFilter';
import { renderHook } from '@testing-library/react-hooks';
import queryString from 'query-string';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
const getStore = (filter: any) =>
  mockStore({
    [reducerTypes.FILTER]: filter,
  });

const getWrapper = (store: any) => ({ children }: any) => (
  <Provider store={store}>
    <Router history={history}>{children}</Router>
  </Provider>
);

const emptyFilter = {
  searchBy: 'address',
  pid: '',
  address: '',
  administrativeArea: '',
  projectNumber: '',
  agencies: '',
  classificationId: '',
  minLotSize: '',
  maxLotSize: '',
  propertyType: 'Land',
  rentableArea: '',
  includeAllProperties: '',
  maxAssessedValue: '',
  maxMarketValue: '',
  maxNetBookValue: '',
  name: '',
};

const defaultFilter = {
  searchBy: 'address',
  pid: '1',
  address: '2',
  administrativeArea: '3',
  projectNumber: '4',
  agencies: '5',
  classificationId: '6',
  minLotSize: '7',
  maxLotSize: '8',
  parcelId: '9',
  propertyType: '10',
  rentableArea: '',
  includeAllProperties: '',
  maxAssessedValue: '',
  maxMarketValue: '',
  maxNetBookValue: '',
  name: '',
};

let filter: any = defaultFilter;
const setFilter = (f: any) => {
  filter = f;
};

describe('useRouterFilter hook tests', () => {
  beforeEach(() => {
    filter = defaultFilter;
    history.push({});
  });

  it('will set the filter based on a query string', () => {
    const expectedFilter = { ...defaultFilter, pid: '2' };
    history.push({ search: new URLSearchParams(expectedFilter).toString() });

    const wrapper = getWrapper(getStore({}));
    renderHook(() => useRouterFilter({ filter, setFilter, key: 'test' }), { wrapper });
    expect(filter).toEqual(expectedFilter);
  });

  it('will not reset the query string', () => {
    const expectedFilter = { ...defaultFilter, pid: '2' };
    history.push({ search: new URLSearchParams(expectedFilter).toString() });

    const filterWithValues: any = { ...expectedFilter };
    Object.keys(filterWithValues).forEach(
      k => filterWithValues[k] === '' && delete filterWithValues[k],
    );

    const wrapper = getWrapper(getStore({}));
    renderHook(() => useRouterFilter({ filter, setFilter, key: 'test' }), { wrapper });
    expect(history.location.search).toEqual('?' + queryString.stringify(filterWithValues));
  });

  it('will not set the filter based on an invalid query string', () => {
    history.push({ search: new URLSearchParams({ searchBy: 'address' }).toString() });

    const wrapper = getWrapper(getStore({}));
    renderHook(() => useRouterFilter({ filter, setFilter, key: 'test' }), { wrapper });
    expect(filter).toEqual(emptyFilter);
  });

  it('will set the filter based on redux', () => {
    const expectedFilter = { ...defaultFilter, pid: '2' };
    const wrapper = getWrapper(getStore({ test: expectedFilter }));
    renderHook(() => useRouterFilter({ filter, setFilter, key: 'test' }), {
      wrapper,
    });
    expect(filter).toEqual(expectedFilter); // TODO: It should equal the expectedFilter...
  });

  it('will not set the filter based on redux if there is no matching key', () => {
    const wrapper = getWrapper(getStore({ test: defaultFilter }));
    renderHook(() => useRouterFilter({ filter, setFilter, key: 'mismatch' }), { wrapper });
    expect(filter).toEqual(defaultFilter);
  });

  it('will set the location based on a passed filter', () => {
    const wrapper = getWrapper(getStore({ test: defaultFilter }));
    renderHook(() => useRouterFilter({ filter: defaultFilter, setFilter, key: 'mismatch' }), {
      wrapper,
    });
    const filterWithValues: any = { ...defaultFilter };
    Object.keys(filterWithValues).forEach(
      k => filterWithValues[k] === '' && delete filterWithValues[k],
    );
    expect(history.location.search).toEqual('?' + queryString.stringify(filterWithValues));
  });
});
