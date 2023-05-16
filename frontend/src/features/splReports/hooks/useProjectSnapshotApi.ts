import { AxiosInstance } from 'axios';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import {
  getProjectFinancialReportUrl,
  getServerQuery,
} from 'features/projects/list/ProjectListView';
import * as _ from 'lodash';
import { useCallback } from 'react';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store';
import download from 'utils/download';

import { IReport } from '../interfaces';
import { ISnapshot } from './../interfaces';

export interface IGeocoderResponse {
  siteId: string;
  fullAddress: string;
  address1: string;
  city: string;
  provinceCode: string;
  latitude: number;
  longitude: number;
  score: number;
}

export interface IGeocoderPidsResponse {
  siteId: string;
  pids: string[];
}

export interface PimsAPI extends AxiosInstance {
  getProjectSnapshots: () => Promise<IReport[]>;
  deleteProjectSnapshot: (id: number) => void;
}

const getAxios = (dispatch: Function, toasts?: LifecycleToasts) => {
  const axios = CustomAxios({ lifecycleToasts: toasts }) as PimsAPI;

  axios.defaults.baseURL = baseUrl;

  axios.interceptors.request.use(
    (config) => {
      dispatch(showLoading());
      return config;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error) => dispatch(hideLoading()),
  );

  axios.interceptors.response.use(
    (config) => {
      dispatch(hideLoading());
      return config;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error) => dispatch(hideLoading()),
  );
  return axios;
};

const baseUrl = `${ENVIRONMENT.apiUrl}/projects/reports`;

const deleteToasts: LifecycleToasts = {
  loadingToast: () => toast.dark('Deleting Report'),
  successToast: () => toast.dark('Report Deleted'),
  errorToast: () => toast.error('Unable to Delete Report'),
};

const addToasts: LifecycleToasts = {
  loadingToast: () => toast.dark('Adding Report'),
  successToast: () => toast.dark('Report Added'),
  errorToast: () => toast.error('Unable to Add Report'),
};

const updateToasts: LifecycleToasts = {
  loadingToast: () => toast.dark('Updating Report'),
  successToast: () => toast.dark('Report Updated'),
  errorToast: () => toast.error('Unable to Update Report'),
};

const snapshotToasts: LifecycleToasts = {
  errorToast: () => toast.dark('Failed to load snapshots'),
};

/**
 * Network API hook. Provide a set of functions to access and manipulate API data related to SPL Reports.
 */
export const useProjectSnapshotApi = () => {
  const dispatch = useAppDispatch();
  const defaultAxios = useCallback(
    getAxios(dispatch, { errorToast: () => toast.error('Failed to load reports') }),
    [dispatch],
  );

  const getProjectReports = useCallback(async (): Promise<IReport[]> => {
    const { data } = await defaultAxios.get<IReport[]>('');
    return _.orderBy(data, (r: IReport) => r.to, ['desc']);
  }, [defaultAxios]);

  const getProjectReportSnapshotsById = useCallback(
    async (id: number): Promise<ISnapshot[]> => {
      const { data } = await defaultAxios.get<ISnapshot[]>(`snapshots/${id}`);
      return _.orderBy(data, ['projectId', 'snapshotOn'], ['asc', 'desc']);
    },
    [defaultAxios],
  );

  const getProjectReportSnapshots = useCallback(
    async (report: IReport): Promise<ISnapshot[]> => {
      const { data } = await getAxios(dispatch, snapshotToasts).post<ISnapshot[]>(
        `snapshots/${report.id}`,
        report,
      );
      return _.orderBy(data, ['projectId', 'snapshotOn'], ['asc', 'desc']);
    },
    [dispatch],
  );

  const refreshProjectReportSnapshots = useCallback(
    async (report: IReport): Promise<ISnapshot[]> => {
      const { data } = await getAxios(dispatch, snapshotToasts).get<ISnapshot[]>(
        `refresh/${report.id}`,
      );
      return data;
    },
    [dispatch],
  );

  const deleteProjectReport = useCallback(
    async (report: IReport) => {
      await getAxios(dispatch, deleteToasts).delete<IReport>(`/${report.id}`, { data: report });
    },
    [dispatch],
  );

  const addProjectReport = useCallback(
    async (report: IReport) => {
      const { data } = await getAxios(dispatch, addToasts).post<IReport>('', { data: report });
      return data;
    },
    [dispatch],
  );

  const updateProjectReport = useCallback(
    async (report: IReport) => {
      const { data } = await getAxios(dispatch, updateToasts).put<IReport>(`/${report.id}`, report);
      return data;
    },
    [dispatch],
  );

  const exportReport = (report: IReport, accept: 'csv' | 'excel') => {
    const query = getServerQuery({ pageIndex: 0, pageSize: 1, filter: {}, agencyIds: [] });
    return download({
      url: getProjectFinancialReportUrl({ ...query, all: true, reportId: report?.id }),
      fileName: `pims-spl-report.${accept === 'csv' ? 'csv' : 'xlsx'}`,
      actionType: 'projects-report',
      headers: {
        Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
      },
    })(dispatch);
  };

  return {
    getProjectReports,
    getProjectReportSnapshotsById,
    getProjectReportSnapshots,
    refreshProjectReportSnapshots,
    deleteProjectReport,
    addProjectReport,
    updateProjectReport,
    exportReport,
  };
};
