import TooltipWrapper from 'components/common/TooltipWrapper';
import * as React from 'react';
import styled from 'styled-components';
import { formatApiDateTime } from 'utils';

interface ILastUpdatedByProps {
  updatedByName?: string;
  updatedByEmail?: string;
  updatedOn?: string;
  createdOn?: string;
}

const UpdateText = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0px;
`;

const LinkButton = styled.span`
  color: #18548c;
  text-decoration: underline;
  max-width: 200px;
`;

/**
 * Display formatted last update user name, email, and date/time.
 */
const LastUpdatedBy: React.FC<ILastUpdatedByProps> = ({
  createdOn,
  updatedOn,
  updatedByName,
  updatedByEmail,
}) => {
  if (updatedOn) {
    return (
      <UpdateText>
        Last Updated By:&nbsp;
        <TooltipWrapper toolTipId="lastUpdatedEmail" toolTip={updatedByEmail ?? undefined}>
          <LinkButton>{updatedByName ?? 'unknown'}</LinkButton>
        </TooltipWrapper>
        &nbsp;
        {formatApiDateTime(updatedOn)}
      </UpdateText>
    );
  } else if (createdOn) {
    return (
      <UpdateText>
        Created By:&nbsp;
        <TooltipWrapper toolTipId="lastUpdatedEmail" toolTip={updatedByEmail ?? undefined}>
          <LinkButton>{updatedByName ?? 'unknown'}</LinkButton>
        </TooltipWrapper>
        &nbsp;
        {formatApiDateTime(createdOn)}
      </UpdateText>
    );
  }
  return null;
};

export default LastUpdatedBy;
