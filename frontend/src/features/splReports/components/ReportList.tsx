import * as React from 'react';
import ReportListitem from './ReportListItem';
import { IReport } from '../interfaces';
import AddReportControl from './AddReportControl';

interface IReportListProps {
  /** a list of all spl reports in the system */
  reports: IReport[];
  /** The currently selected report in this listview. */
  currentReport?: IReport;
  /** The action to take if a report is selected */
  onOpen: (report: IReport) => void;
  /** The action to take if a report is set to final */
  onFinal: (report: IReport) => void;
  /** The action to take if a report is deleted */
  onDelete: (report: IReport) => void;
  /** the action to take if a new report is added */
  onAdd: (report: IReport) => void;
}

/**
 * Sidebar displaying a list of reports, and controls to manage those reports.
 */
const ReportList: React.FunctionComponent<IReportListProps> = ({
  onDelete,
  onFinal,
  onOpen,
  onAdd,
  currentReport,
  reports,
}) => {
  return (
    <>
      <AddReportControl onAdd={onAdd} />
      {reports.map((report, index) => (
        <ReportListitem
          key={`${report.name}${index}`}
          className={currentReport?.id === report?.id ? 'active' : ''}
          {...{ report, onOpen, onDelete, onFinal }}
        ></ReportListitem>
      ))}
    </>
  );
};

export default ReportList;
