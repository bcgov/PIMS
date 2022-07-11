import { IStatus } from 'features/projects/interfaces';
import { WorkflowStatus } from 'hooks/api/projects';
import * as React from 'react';
import { FaRegCheckCircle, FaRegCircle } from 'react-icons/fa';
import { MdRemoveCircleOutline } from 'react-icons/md';
import styled from 'styled-components';
import { formatDate } from 'utils';

interface IStepSuccessIconProps {
  /** label displayed before the icon */
  preIconLabel?: string;
  /** label displayed after the icon */
  postIconLabel?: string;
  status?: IStatus;
  approvedOn?: string | Date;
}

export enum StatusIcons {
  SUCCESS = 'success',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

const ColoredWrapper = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const SpacedHeader = styled.h5`
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-family: 'BCSans', Fallback, sans-serif;
`;

const getPreIconLabel = (code?: string) =>
  code === WorkflowStatus.ApprovedForErp || code === WorkflowStatus.ApprovedForSpl
    ? 'Approved for Surplus Property Program'
    : 'Submitted';

const getPostIconLabel = (approvedOn?: string | Date, status?: IStatus) => {
  switch (status?.code) {
    case WorkflowStatus.ApprovedForErp:
    case WorkflowStatus.ApprovedForSpl:
      return `Approval Date: ${approvedOn ? formatDate(approvedOn) : 'Unknown Date'}`;
    case WorkflowStatus.PropertyReview:
      return 'In Review';
    default:
      return status?.name ?? 'Unknown';
  }
};

/**
 * Common component used to display a large success icon with text before and after.
 */
const StepStatusIcon: React.FunctionComponent<IStepSuccessIconProps> = ({
  preIconLabel,
  postIconLabel,
  status,
  approvedOn,
}: IStepSuccessIconProps) => {
  return (
    <ColoredWrapper className={`${status ?? 'default'}-status`}>
      <SpacedHeader>{preIconLabel ?? getPreIconLabel(status?.code)}</SpacedHeader>
      <RenderIcon statusCode={status?.code} />
      <SpacedHeader>{postIconLabel ?? getPostIconLabel(approvedOn, status)}</SpacedHeader>
    </ColoredWrapper>
  );
};

const RenderIcon = ({ statusCode }: { statusCode?: string }) => {
  switch (statusCode) {
    case WorkflowStatus.PropertyReview:
      return <FaRegCircle size={64} style={{ color: '#2E8540' }} />;
    case WorkflowStatus.Cancelled:
    case WorkflowStatus.Denied:
      return <MdRemoveCircleOutline size={64} style={{ color: '#d8292f' }} />;
    default:
      return <FaRegCheckCircle size={64} style={{ color: '#20a74d' }} />;
  }
};

export default StepStatusIcon;
