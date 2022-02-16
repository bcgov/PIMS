import { Menu } from 'components/menu/Menu';
import { AccessRequestStatus } from 'constants/accessStatus';
import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { CellProps } from 'react-table';
import { useAppSelector } from 'store';
import { useAccessRequest } from 'store/slices/hooks';

import { IAccessRequestModel } from '../interfaces';

export const RowActions = (props: CellProps<IAccessRequestModel>) => {
  const api = useAccessRequest();
  const accessRequest = props.row.original;

  const isStatusMatch = (value: AccessRequestStatus) => accessRequest.status === value;

  const originalAccessRequest = useAppSelector((store) =>
    store.accessRequest.pagedAccessRequests.items.find((ar) => ar.id === accessRequest.id),
  );

  const approve = () => {
    if (originalAccessRequest) {
      api.getSubmitAdminAccessRequestAction({
        ...originalAccessRequest,
        status: AccessRequestStatus.Approved,
      });
    }
  };
  const decline = () => {
    if (originalAccessRequest) {
      api.getSubmitAdminAccessRequestAction({
        ...originalAccessRequest,
        status: AccessRequestStatus.Declined,
      });
    }
  };

  const hold = () => {
    if (originalAccessRequest) {
      api.getSubmitAdminAccessRequestAction({
        ...originalAccessRequest,
        status: AccessRequestStatus.OnHold,
      });
    }
  };

  const deleteRequest = () => {
    if (originalAccessRequest) {
      api.getAccessRequestsDeleteAction(originalAccessRequest.id, {
        ...originalAccessRequest,
        status: AccessRequestStatus.OnHold,
      });
    }
  };

  const isLastRow = accessRequest.id === props.data[props.data.length - 1].id;

  return (
    <Menu
      alignTop={isLastRow && props.data.length >= 20}
      disableScroll={true}
      options={[
        {
          label: 'Approve',
          disabled: isStatusMatch(AccessRequestStatus.Approved),
          onClick: approve,
        },
        {
          label: 'Hold',
          disabled: isStatusMatch(AccessRequestStatus.OnHold),
          onClick: hold,
        },
        {
          label: 'Decline',
          disabled: isStatusMatch(AccessRequestStatus.Declined),
          onClick: decline,
        },
        { label: 'Delete', onClick: deleteRequest },
      ]}
    >
      <FiMoreHorizontal />
    </Menu>
  );
};
