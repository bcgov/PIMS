import * as React from 'react';
import ReportListitem from './ReportListItem';
import { IReport } from '../interfaces';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { defaultReport } from './ReportControls';
import TooltipWrapper from 'components/common/TooltipWrapper';

interface IReportListProps {
  /** a list of all spl reports in the system */
  reports: IReport[];
  /** The action to take if a report is selected */
  onOpen: (report: IReport) => void;
  /** The action to take if a report is set to final */
  onFinal: (report: IReport) => void;
  /** The action to take if a report is deleted */
  onDelete: (report: IReport) => void;
  /** the action to take if a new report is added */
  onAdd: (report: IReport) => void;
}

const SidebarHeader = styled.span`
  display: flex;
  justify-content: space-between;
`;

/**
 * Sidebar displaying a list of reports, and controls to manage those reports.
 */
const ReportList: React.FunctionComponent<IReportListProps> = ({
  onDelete,
  onFinal,
  onOpen,
  onAdd,
  reports,
}) => {
  return (
    <>
      <SidebarHeader>
        <h2>SPL Reports</h2>
        <Button>
          <TooltipWrapper toolTipId="no-spl-reports" toolTip="Click here to create an SPL report">
            <FaPlus size={32} onClick={() => onAdd(defaultReport)} />
          </TooltipWrapper>
        </Button>
      </SidebarHeader>
      {reports.length ? (
        reports.map((report, index) => (
          <ReportListitem
            key={`${report.name}${index}`}
            {...{ report, onOpen, onDelete, onFinal }}
          ></ReportListitem>
        ))
      ) : (
        <p>Click '+' to add an SPL report</p>
      )}
    </>
  );
};

export default ReportList;
