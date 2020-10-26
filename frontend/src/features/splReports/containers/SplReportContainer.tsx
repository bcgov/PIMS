import * as React from 'react';
import SplReportLayout from '../components/SplReportLayout';
import { useState, useEffect } from 'react';
import { IReport, ISnapshot } from '../interfaces';
import { useProjectSnapshotApi } from '../hooks/useProjectSnapshotApi';
import _ from 'lodash';
import { generateUtcNowDateTime } from 'utils';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import {
  getServerQuery,
  getProjectFinancialReportUrl,
} from 'features/projects/list/ProjectListView';
import download from 'utils/download';
import { useDispatch } from 'react-redux';
import GenericModal from 'components/common/GenericModal';
import { toast } from 'react-toastify';
import { useRouterReport } from '../hooks/useRouterReport';

interface ISplReportContainerProps {}

/**
 * Container providing api and event handling logic for spl reports.
 */
const SplReportContainer: React.FunctionComponent<ISplReportContainerProps> = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentReport, setCurrentReport] = useState<IReport | undefined>(undefined);
  const [reports, setReports] = useState<IReport[]>([]);
  const [snapshots, setSnapshots] = useState<ISnapshot[] | undefined>();
  const [reportIdToDelete, setReportIdToDelete] = useState<number | undefined>();
  const [reportToSave, setReportToSave] = useState<IReport | undefined>();
  const dispatch = useDispatch();
  useRouterReport({ currentReport, setCurrentReport, reports });
  const {
    getProjectReports,
    getProjectReportSnapshots,
    getProjectReportSnapshotsById,
    refreshProjectReportSnapshots,
    deleteProjectReport,
    addProjectReport,
    updateProjectReport,
  } = useProjectSnapshotApi();

  const id = currentReport?.id;
  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const data = await getProjectReportSnapshotsById(id);
        setSnapshots(data);
      }
    };
    fetch();
  }, [id, getProjectReportSnapshotsById]);

  const getReports = React.useCallback(async () => {
    const data = await getProjectReports();
    setReports(data);
    if (data.length === 0) {
      setShowSidebar(true);
      setSnapshots([]);
    }
  }, [getProjectReports]);

  useDeepCompareEffect(() => {
    getReports();
  }, [getProjectReports, getReports, currentReport]);

  /**
   * API call wrapper functions
   */
  const deleteReport = async (report: IReport) => {
    report.id && (await deleteProjectReport(report));
    getReports();
    if (report.id === currentReport?.id) {
      setCurrentReport(undefined);
    }
  };
  const addReport = async (report: IReport) => {
    const addedReport = await addProjectReport(report);
    setCurrentReport(addedReport);
  };
  const updateReport = async (report: IReport) => {
    const updatedReport = await updateProjectReport(report);
    if (report.id === currentReport?.id) {
      setCurrentReport(updatedReport);
    } else {
      getReports();
    }
  };
  const refreshSnapshots = async (report: IReport) => {
    setSnapshots(undefined);
    const data = await refreshProjectReportSnapshots(report);
    const now = generateUtcNowDateTime();
    setCurrentReport({
      ...currentReport,
      to: now,
    } as IReport);
    setSnapshots(data);
  };
  const changeFrom = async (report: IReport) => {
    const data = await getProjectReportSnapshots(report);
    setCurrentReport(report);
    setSnapshots(data);
  };
  const exportReport = (report: IReport, accept: 'csv' | 'excel') => {
    const query = getServerQuery({ pageIndex: 0, pageSize: 1, filter: {}, agencyIds: [] });
    return dispatch(
      download({
        url: getProjectFinancialReportUrl({ ...query, all: true, reportId: report?.id }),
        fileName: `spl_report.${accept === 'csv' ? 'csv' : 'xlsx'}`,
        actionType: 'projects-report',
        headers: {
          Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
        },
      }),
    );
  };

  /**
   * Event Action Functions
   */
  const onDelete = (report: IReport) => {
    if (report.isFinal && _.find(reports, { id: report.id })?.isFinal) {
      toast.warning(
        "Deleting 'Final' reports is not allowed. You must remove the 'Final' flag on this report to delete it",
        { autoClose: 10000 },
      );
    } else {
      setCurrentReport(report);
      setReportIdToDelete(report.id);
    }
  };
  const onSave = (report: IReport) => {
    if (!report.isFinal && _.find(reports, { id: report.id })?.isFinal) {
      setReportToSave(report);
    } else {
      updateReport(report);
    }
  };
  const onFinal = (report: IReport) => {
    const finalReport = { ...report, isFinal: !report.isFinal };
    onSave(finalReport);
  };

  return (
    <SplReportLayout
      showSidebar={showSidebar}
      setShowSidebar={setShowSidebar}
      onOpen={report => setCurrentReport(report)}
      onDelete={onDelete}
      onFinal={onFinal}
      onRefresh={refreshSnapshots}
      onSave={onSave}
      onAdd={addReport}
      onExport={exportReport}
      onFromChange={(id: number) => {
        changeFrom({ ...currentReport, from: _.find(reports, { id: id })?.to } as IReport);
      }}
      reports={reports}
      snapshots={snapshots}
      currentReport={currentReport}
    >
      <GenericModal
        display={!!reportIdToDelete}
        title="Confirm Delete"
        okButtonText="Delete"
        okButtonVariant="danger"
        cancelButtonText="Cancel"
        cancelButtonVariant="secondary"
        message="Are you sure you want to delete this report? this action cannot be undone."
        handleOk={() => {
          const report = _.find(reports, { id: reportIdToDelete });
          report && deleteReport(report);
          setReportIdToDelete(undefined);
        }}
        handleCancel={() => setReportIdToDelete(undefined)}
      ></GenericModal>
      <GenericModal
        display={!!reportToSave}
        title="Really Remove 'Final' Flag?"
        okButtonText="Remove 'Final'"
        okButtonVariant="danger"
        cancelButtonText="Cancel"
        cancelButtonVariant="secondary"
        message="Are you sure you want to remove the 'Final' flag on this report? Removing the 'Final' flag will allow this report to be modified or deleted"
        handleOk={() => {
          reportToSave && updateReport(reportToSave);
          setReportToSave(undefined);
        }}
        handleCancel={() => setReportToSave(undefined)}
      ></GenericModal>
    </SplReportLayout>
  );
};

export default SplReportContainer;
