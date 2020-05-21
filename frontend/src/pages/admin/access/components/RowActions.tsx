import { CellProps } from 'react-table';
import { AccessRequestStatus } from 'constants/accessStatus';
import { Menu } from 'components/menu/Menu';
import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { IAccessRequestModel } from '../interfaces';
import { useDispatch, useStore } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  getSubmitAdminAccessRequestAction,
  getAccessRequestsDeleteAction,
} from 'actionCreators/accessRequestActionCreator';

export const RowActions = (props: CellProps<IAccessRequestModel>) => {
  const accessRequest = props.row.original;
  const dispatch = useDispatch();
  const store = useStore();

  const isStatusMatch = (value: AccessRequestStatus) => accessRequest.status === value;

  const originalAccessRequest = (store.getState() as RootState).accessRequest.pagedAccessRequests.items.find(
    ar => ar.id === accessRequest.id,
  );

  const approve = () => {
    if (originalAccessRequest) {
      originalAccessRequest.status = AccessRequestStatus.Approved;
      dispatch(getSubmitAdminAccessRequestAction(originalAccessRequest));
    }
  };
  const decline = () => {
    if (originalAccessRequest) {
      originalAccessRequest.status = AccessRequestStatus.Declined;
      dispatch(getSubmitAdminAccessRequestAction(originalAccessRequest));
    }
  };

  const hold = () => {
    if (originalAccessRequest) {
      originalAccessRequest.status = AccessRequestStatus.OnHold;
      dispatch(getSubmitAdminAccessRequestAction(originalAccessRequest));
    }
  };

  const deleteRequest = () => {
    if (originalAccessRequest) {
      originalAccessRequest.status = AccessRequestStatus.OnHold;
      dispatch(getAccessRequestsDeleteAction(originalAccessRequest.id, originalAccessRequest));
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
