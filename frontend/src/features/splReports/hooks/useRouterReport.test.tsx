import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { useRouterReport } from './useRouterReport';
import { renderHook } from '@testing-library/react-hooks';
import { IReport } from '../interfaces';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
const getStore = () => mockStore({});

const getWrapper = (store: any) => ({ children }: any) => (
  <Provider store={store}>
    <Router history={history}>{children}</Router>
  </Provider>
);

const reports: IReport[] = [
  {
    id: 1,
    to: '2020-10-14T17:45:39.7381599',
    name: 'test',
    isFinal: false,
    reportTypeId: 0,
  },
  {
    id: 2,
    to: '2020-10-14T17:45:39.7381599',
    name: 'test',
    isFinal: false,
    reportTypeId: 0,
  },
];

const defaultReport: any = {
  reportId: 2,
};

let currentReport: IReport | undefined = reports[0];
const setCurrentReport = (report: IReport) => {
  currentReport = report;
};

describe('useRouterReport hook tests', () => {
  afterEach(() => {
    currentReport = undefined;
    history.push({ search: '' });
  });
  it('the router hook will set the filter based on a query string', () => {
    history.push({ search: new URLSearchParams(defaultReport).toString() });

    const wrapper = getWrapper(getStore());
    renderHook(() => useRouterReport({ currentReport: undefined, setCurrentReport, reports }), {
      wrapper,
    });
    expect(currentReport?.id).toEqual(+defaultReport.reportId);
  });

  it('will set the filter to the first report if an invalid filter is provided', () => {
    history.push({ search: new URLSearchParams({ invalidId: '1' }).toString() });

    const wrapper = getWrapper(getStore());
    renderHook(() => useRouterReport({ currentReport: undefined, setCurrentReport, reports }), {
      wrapper,
    });
    expect(currentReport?.id).toEqual(1);
  });

  it('will set the location based on a passed filter', () => {
    const wrapper = getWrapper(getStore());
    renderHook(() => useRouterReport({ currentReport: reports[1], setCurrentReport, reports }), {
      wrapper,
    });
    expect(history.location.search).toEqual('?reportId=2');
  });
});
