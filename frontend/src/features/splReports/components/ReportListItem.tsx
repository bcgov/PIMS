import variables from '_variables.module.scss';
import TooltipWrapper from 'components/common/TooltipWrapper';
import * as React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { formatApiDateTime } from 'utils';

import { IReport } from '../interfaces';
import ElipsisControls from './ElipsisControls';

interface IReportListitemProps {
  /** The underlying report that this control is mapped to. */
  report: IReport;
  /** The class of this report item. */
  className?: string;
  /** function to invoke when this list item's name is clicked. */
  onOpen: (report: IReport) => void;
  /** function to invoke when the checkbox is clicked */
  onFinal: (report: IReport) => void;
  /** function to invoke when the open dropdown item is clicked */
  onDelete: (report: IReport) => void;
}

const ListItemRow = styled(Row)`
  background-color: white;
  min-height: 2rem;
  align-items: center;
  margin: 0;
`;

/**
 * This element will replace overly long report text with ...
 */
const Report = styled(Col)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  :hover {
    color: ${variables.iconLightColor};
    cursor: pointer;
  }
`;

const CheckBox = styled(Form.Check)`
  height: auto;
`;

const FlexCol = styled(Col)`
  display: flex;
  align-items: center;
  margin-left: -55px;
  padding: 0;
`;

const getName = (report: IReport) =>
  !!report.name?.length ? report.name : formatApiDateTime(report.to);

/**
 * Control that represents a report list item with click functionality, a checkbox representing final report state, and elipsis controls.
 */
const ReportListitem: React.FunctionComponent<IReportListitemProps> = ({
  report,
  onOpen,
  onDelete,
  onFinal,
  className,
}) => {
  return (
    <>
      <ListItemRow className={className}>
        <TooltipWrapper toolTipId="open-report" toolTip="Open Report">
          <Report onClick={() => onOpen(report)} md={9} title={getName(report)}>
            {getName(report)}
          </Report>
        </TooltipWrapper>
        <FlexCol md={3}>
          <CheckBox type="checkbox" checked={report.isFinal} disabled={true}></CheckBox>
          <ElipsisControls {...{ onOpen, onFinal, onDelete, report }} />
        </FlexCol>
      </ListItemRow>
    </>
  );
};

export default ReportListitem;
