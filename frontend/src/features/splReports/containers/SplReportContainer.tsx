import * as React from 'react';
import SplReportLayout from '../components/SplReportLayout';
import { useState, useEffect } from 'react';
import { IReport, ISnapshot, ISnapshotFilter } from '../interfaces';
import { useProjectSnapshotApi } from '../hooks/useProjectSnapshotApi';
import _ from 'lodash';
import { generateUtcNowDateTime } from 'utils';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import GenericModal from 'components/common/GenericModal';
import { toast } from 'react-toastify';
import { useRouterReport } from '../hooks/useRouterReport';

interface ISplReportContainerProps {}

const SplReportContainerContext = React.createContext<{
  snapshotFilter: ISnapshotFilter;
  setSnapshotFilter: (filter: ISnapshotFilter) => void;
}>({
  snapshotFilter: {
    fiscalYear: '',
    agency: '',
    projectNumber: '',
    sortBy: { projectId: 'asc', snapshotOn: 'desc' },
  },
  setSnapshotFilter: _.noop,
});

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
  useRouterReport({ currentReport, setCurrentReport, reports });
  const {
    getProjectReports,
    getProjectReportSnapshots,
    getProjectReportSnapshotsById,
    refreshProjectReportSnapshots,
    deleteProjectReport,
    addProjectReport,
    updateProjectReport,
    exportReport,
  } = useProjectSnapshotApi();
  const [snapshotFilter, setSnapshotFilter] = React.useState<ISnapshotFilter>({
    projectNumber: '',
    agency: '',
    fiscalYear: '',
    sortBy: { projectId: 'asc', snapshotOn: 'desc' },
  });

  const id = currentReport?.id;
  useEffect(() => {
    const fetch = async () => {
      if (id) {
        let snapshots = await getProjectReportSnapshotsById(id);
        snapshots = snapshots.map(
          s =>
            ({
              ...s,
              project: { ...s.project, agencyName: s.project?.agency || s.project?.subAgency },
            } as ISnapshot),
        );
        snapshots = _.orderBy(
          snapshots,
          _.keys(snapshotFilter.sortBy),
          _.keys(snapshotFilter.sortBy).map(k => snapshotFilter.sortBy[k]) as ('asc' | 'desc')[],
        );

        if (snapshotFilter.projectNumber) {
          snapshots = _.filter(
            snapshots,
            snapshot => snapshot.project?.projectNumber === snapshotFilter.projectNumber,
          );
        }
        if (snapshotFilter.agency) {
          snapshots = _.filter(
            snapshots,
            snapshot => snapshot.project?.agencyId === snapshotFilter.agency,
          );
        }
        if (snapshotFilter.fiscalYear) {
          snapshots = _.filter(
            snapshots,
            snapshot =>
              Number(snapshot.project?.actualFiscalYear) === Number(snapshotFilter.fiscalYear),
          );
        }
        setSnapshots(snapshots);
      }
    };
    fetch();
  }, [id, getProjectReportSnapshotsById, snapshotFilter]);

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
    <SplReportContainerContext.Provider
      value={{ snapshotFilter: snapshotFilter, setSnapshotFilter }}
    >
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
    </SplReportContainerContext.Provider>
  );
};

export const useSplReportContext = () => React.useContext(SplReportContainerContext);

export default SplReportContainer;
