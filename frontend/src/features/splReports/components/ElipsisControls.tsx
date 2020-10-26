import * as React from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { IReport } from '../interfaces';
import './ElipsisControls.scss';

interface IElipsisControlsProps {
  /** The underlying report that this control is mapped to. */
  report: IReport;
  /** function to invoke when the open dropdown item is clicked */
  onOpen: (report: IReport) => void;
  /** function to invoke when the Mark as Final dropdown item is clicked */
  onFinal: (report: IReport) => void;
  /** function to invoke when the open dropdown item is clicked */
  onDelete: (report: IReport) => void;
}

/**
 * Dropdown controls spawned from an elipsis button. uses open, final, and delete functions.
 */
const ElipsisControls: React.FunctionComponent<IElipsisControlsProps> = ({
  report,
  onOpen,
  onFinal,
  onDelete,
}) => {
  return (
    <DropdownButton
      id={`${report.id}-elipsis-controls`}
      bsPrefix="elipsis"
      className="elipsis-dropdown"
      title={<FaEllipsisH />}
    >
      <Dropdown.Item eventKey="1" onClick={() => onOpen(report)}>
        Open
      </Dropdown.Item>
      <Dropdown.Item eventKey="2" onClick={() => onFinal(report)}>
        {report.isFinal ? 'Remove Final' : 'Mark as Final'}
      </Dropdown.Item>
      <Dropdown.Item className="danger" eventKey="3" onClick={() => onDelete(report)}>
        Delete
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default ElipsisControls;
