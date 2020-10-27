import * as React from 'react';
import { Button } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { FaPlus } from 'react-icons/fa';
import { defaultReport } from './ReportControls';
import { IReport } from '../interfaces';

interface IAddReportControlProps {
  /** the function to call when the add button is clicked. */
  onAdd: (report: IReport) => void;
  className?: string;
}

/**
 * A simple control containing a header and an add button.
 */
const AddReportControl: React.FunctionComponent<IAddReportControlProps> = ({
  onAdd,
  className,
}) => {
  return (
    <span className={`d-flex justify-content-between align-items-center add-spl ${className}`}>
      <h2>SPL Reports</h2>
      <Button className="h-auto">
        <TooltipWrapper toolTipId="no-spl-reports" toolTip="Create New Report">
          <FaPlus size={20} onClick={() => onAdd(defaultReport)} />
        </TooltipWrapper>
      </Button>
    </span>
  );
};

export default AddReportControl;
