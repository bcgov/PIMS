import { useProjectSnapshotApi } from './useProjectSnapshotApi';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import React from 'react';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const getStore = () => mockStore({});
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');
mockedAxios.create = jest.fn(() => mockedAxios);

const getWrapper = (store: any) => ({ children }: any) => (
  <Provider store={store}>
    <Router history={history}>{children}</Router>
  </Provider>
);

describe('useProjectSnapshotApi hook tests', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
    mockedAxios.put.mockReset();
    mockedAxios.delete.mockReset();
  });
  it('It will call /reports when getProjectReports called', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderHook(() => useProjectSnapshotApi().getProjectReports(), {
      wrapper: getWrapper(getStore()),
    });
    expect(mockedAxios.get).toHaveBeenCalledWith<[string]>('');
  });
  it('It will call /reports/snapshots/{id} when getProjectReportSnapshotsById called', () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    renderHook(() => useProjectSnapshotApi().getProjectReportSnapshotsById(1), {
      wrapper: getWrapper(getStore()),
    });
    expect(mockedAxios.get).toHaveBeenCalledWith('snapshots/1');
  });
  it('It will call /reports/snapshots/{snapshot} when getProjectReportSnapshots called', () => {
    mockedAxios.post.mockResolvedValue({ data: [] });
    renderHook(() => useProjectSnapshotApi().getProjectReportSnapshots({ id: 1 } as any), {
      wrapper: getWrapper(getStore()),
    });
    expect(mockedAxios.post).toHaveBeenCalledWith('snapshots/1', { id: 1 });
  });
  it('It will call /reports/refresh/{report.id} when refreshProjectReportSnapshots called', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderHook(() => useProjectSnapshotApi().refreshProjectReportSnapshots({ id: 1 } as any), {
      wrapper: getWrapper(getStore()),
    });
    expect(mockedAxios.get).toHaveBeenCalledWith('refresh/1');
  });
  it('It will call HTTP DELETE /reports/{report.id} when deleteProjectReport called', () => {
    mockedAxios.delete.mockResolvedValue({ data: {} });
    renderHook(() => useProjectSnapshotApi().deleteProjectReport({ id: 1 } as any), {
      wrapper: getWrapper(getStore()),
    });
    expect(mockedAxios.delete).toHaveBeenCalledWith('/1', { data: { id: 1 } });
  });
  it('It will call HTTP POST /reports/{report.id} when addProjectReport called', () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    renderHook(() => useProjectSnapshotApi().addProjectReport({ id: 1 } as any), {
      wrapper: getWrapper(getStore()),
    });
    expect(mockedAxios.post).toHaveBeenCalledWith('', { data: { id: 1 } });
  });
  it('It will call HTTP PUT /reports/{report.id} when updateProjectReport called', () => {
    mockedAxios.put.mockResolvedValue({ data: {} });
    renderHook(() => useProjectSnapshotApi().updateProjectReport({ id: 1 } as any), {
      wrapper: getWrapper(getStore()),
    });
    expect(mockedAxios.put).toHaveBeenCalledWith('/1', { id: 1 });
  });
});
