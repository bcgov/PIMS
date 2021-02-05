import * as React from 'react';
import './SplReportLayout.scss';
import ReportList from './ReportList';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import classNames from 'classnames';
import { IReport, ISnapshot } from '../interfaces';
import ReportControls from './ReportControls';
import ReportForm from './ReportForm';
import ClickAwayListener from 'react-click-away-listener';

interface ISplReportLayoutProps {
  showSidebar: boolean;
  setShowSidebar: Function;
  onOpen: (report: IReport) => void;
  onFinal: (report: IReport) => void;
  onDelete: (report: IReport) => void;
  onSave: (report: IReport) => void;
  onAdd: (report: IReport) => void;
  onRefresh: (report: IReport) => void;
  onFromChange: (id: number) => void;
  onExport: (report: IReport, accept: 'csv' | 'excel') => void;
  reports: IReport[];
  snapshots?: ISnapshot[];
  currentReport?: IReport;
}

/**
 * Top level layout component. Provides layout css and structure for the SPL Reports component.
 */
const SplReportLayout: React.FunctionComponent<ISplReportLayoutProps> = ({
  showSidebar,
  setShowSidebar,
  onOpen,
  onFinal,
  onDelete,
  onSave,
  onRefresh,
  onAdd,
  onFromChange,
  onExport,
  reports,
  snapshots,
  currentReport,
  children,
}) => {
  return (
    <div className="spl-reports">
      <ClickAwayListener onClickAway={() => setShowSidebar(false)}>
        <div className={classNames('side-bar', showSidebar ? 'side-bar-show open' : 'close')}>
          <span>
            <ReportList
              {...{ onOpen, onFinal, onDelete, reports, onAdd, currentReport, setShowSidebar }}
            ></ReportList>
          </span>
          <button onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
      </ClickAwayListener>
      <div className="ml-4 report-content">
        <ReportControls
          reports={reports}
          currentReport={currentReport}
          onAdd={onAdd}
          onSave={onSave}
          onRefresh={onRefresh}
          onFromChange={onFromChange}
          onExport={onExport}
        />
        <ReportForm currentReport={currentReport} snapshots={snapshots} />
      </div>
      {children}
    </div>
  );
};

export default SplReportLayout;
