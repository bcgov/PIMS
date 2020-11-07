import * as React from 'react';
import styled from 'styled-components';
import { formatApiDateTime } from 'utils';
import TooltipWrapper from 'components/common/TooltipWrapper';

interface ILastUpdatedByProps {
  updatedByName?: string;
  updatedByEmail?: string;
  updatedOn?: string;
  createdOn?: string;
}

const UpdateText = styled.p`
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const LinkButton = styled.span`
  background: none;
  border: none;
  padding: 0;
  color: #069;
  text-decoration: underline;
`;

/**
 * Display formatted last update user name, email, and date/time.
 */
const LastUpdatedBy: React.FunctionComponent<ILastUpdatedByProps> = ({
  createdOn,
  updatedOn,
  updatedByName,
  updatedByEmail,
}) => {
  return updatedOn || createdOn ? (
    <UpdateText>
      Last Updated By:&nbsp;
      <TooltipWrapper toolTipId="lastUpdatedEmail" toolTip={updatedByEmail ?? 'unknown'}>
        <LinkButton>{updatedByName ?? 'unknown'}</LinkButton>
      </TooltipWrapper>
      &nbsp;
      {formatApiDateTime(updatedOn ?? createdOn)}
    </UpdateText>
  ) : null;
};

export default LastUpdatedBy;
