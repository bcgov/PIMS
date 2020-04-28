import { Dropdown } from 'react-bootstrap';
import React from 'react';
import { useDispatch } from 'react-redux';
import { IAccessRequest } from 'interfaces';
import {
  getSubmitAdminAccessRequestAction,
  getAccessRequestsDeleteAction,
} from 'actionCreators/accessRequestActionCreator';
import { AccessRequestStatus } from 'constants/accessStatus';

interface IAccessRequestActionsProps {
  selections: IAccessRequest[];
}

export const AccessRequestActions = (props: IAccessRequestActionsProps) => {
  const dispatch = useDispatch();

  const approveRequests = async () => {
    const items = props.selections.map(
      x => ({ ...x, status: AccessRequestStatus.Approved } as IAccessRequest),
    );
    await submit(items);
  };

  const declineRequests = async () => {
    const items = props.selections.map(
      x => ({ ...x, status: AccessRequestStatus.Declined } as IAccessRequest),
    );
    await submit(items);
  };

  const deleteRequests = async () => {
    await Promise.all(
      props.selections.map(req => getAccessRequestsDeleteAction(req.id, req)(dispatch)),
    );
  };

  const submit = async (items: IAccessRequest[]) => {
    await Promise.all(items.map(req => getSubmitAdminAccessRequestAction(req)(dispatch)));
  };

  const disabled = props.selections.length === 0;
  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">Actions</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item disabled={disabled} onClick={approveRequests}>
          Approve
        </Dropdown.Item>
        <Dropdown.Item disabled={true}>Hold</Dropdown.Item>
        <Dropdown.Item disabled={disabled} onClick={declineRequests}>
          Decline
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item disabled={disabled} onClick={deleteRequests}>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
