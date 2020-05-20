import * as React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { AccessRequestStatus } from 'constants/accessStatus';
import { Table } from 'components/Table';
import { IPaginate, toFilteredApiPaginateParams } from 'utils/CommonFunctions';
import * as API from 'constants/API';
import { IAccessRequest } from 'interfaces';
import './ManageAccessRequests.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IGenericNetworkAction } from 'actions/genericActions';
import {
  getAccessRequestsAction,
  getAccessRequestsFilterAction,
} from 'actionCreators/accessRequestActionCreator';
import * as actionTypes from 'constants/actionTypes';
import { IAccessRequestState } from 'reducers/accessRequestReducer';
import { IAccessRequestModel } from './interfaces';
import { AccessRequestFilter } from './components/Filter';
import { Menu, IMenuItemProps } from 'components/menu/Menu';
import {
  getUpdateAccessRequestPageSize,
  IFilterData,
  getUpdateAccessRequestPageIndex,
} from 'actions/accessRequestActions';
import { columnDefinitions } from './constants/constants';
import { AccessRequestDetails } from './components/Details';

const ManageAccessRequests = () => {
  const dispatch = useDispatch();
  const [selectedRequest, setSelectedRequest] = React.useState<IAccessRequestModel | undefined>(
    undefined,
  );
  const columns = React.useMemo(() => columnDefinitions, []);
  const updateRequestAccessAdmin = useSelector<RootState, IGenericNetworkAction>(
    state =>
      (state.network as any)[actionTypes.UPDATE_REQUEST_ACCESS_ADMIN] as IGenericNetworkAction,
  );

  const pagedAccessRequests = useSelector<RootState, IPaginate>(
    state => (state.accessRequest as IAccessRequestState)?.pagedAccessRequests,
  );

  const pageSize = useSelector<RootState, number>(
    state => (state.accessRequest as IAccessRequestState)?.pageSize,
  );

  const pageIndex = useSelector<RootState, number>(
    state => (state.accessRequest as IAccessRequestState).pageIndex,
  );

  const filter = useSelector<RootState, IFilterData>(
    state => (state.accessRequest as IAccessRequestState).filter,
  );

  React.useEffect(() => {
    if (!updateRequestAccessAdmin?.isFetching) {
      const paginateParams: API.IPaginateAccessRequests = toFilteredApiPaginateParams<IFilterData>(
        pageIndex,
        pageSize,
        '',
        filter,
      );
      paginateParams.status = AccessRequestStatus.OnHold;
      dispatch(getAccessRequestsAction(paginateParams));
    }
  }, [updateRequestAccessAdmin, pageSize, dispatch, filter, pageIndex]);

  const requests = (pagedAccessRequests.items as IAccessRequest[]).map(
    ar =>
      ({
        id: ar.id as number,
        userId: ar.user.id as string,
        username: ar.user.username as string,
        firstName: ar.user.firstName as string,
        lastName: ar.user.lastName as string,
        email: ar.user.email as string,
        status: ar.status as string,
        note: ar.note as string,
        position: ar.user.position,
        agency: ar.agencies && ar.agencies.length !== 0 ? ar.agencies[0].name : ('' as string),
        role: ar.roles && ar.roles.length !== 0 ? ar.roles[0].name : '',
      } as IAccessRequestModel),
  );

  const pageSizeOptions: IMenuItemProps[] = [10, 20, 30, 40, 50, 100].map(size => ({
    label: size,
    value: size,
    onClick: () => dispatch(getUpdateAccessRequestPageSize(size)),
  }));

  const showDetails = (req: IAccessRequestModel) => {
    setSelectedRequest(req);
  };

  return (
    <div className="manage-access-requests">
      <div className="ScrollContainer">
        <Container fluid className="TableToolbar">
          <span className="title mr-auto">PIMS Guests (Pending Approval)</span>
        </Container>
        <div className="search-bar">
          <Row>
            <Col xs={8}>
              <AccessRequestFilter
                initialValues={filter}
                applyFilter={filter => dispatch(getAccessRequestsFilterAction(filter))}
              />
            </Col>
            <Col className="page-size-selector">
              <Menu options={pageSizeOptions} width="60px">
                <div style={{ display: 'flex' }}>
                  <span>Show</span>
                  <Form.Control
                    size="sm"
                    defaultValue={`${pageSize}`}
                    style={{ width: 50, marginLeft: 10, marginRight: 10 }}
                  />
                  <span>Entries</span>
                </div>
              </Menu>
            </Col>
          </Row>
        </div>
        {!!selectedRequest && (
          <AccessRequestDetails
            request={selectedRequest}
            onClose={() => setSelectedRequest(undefined)}
          />
        )}
        <Table<IAccessRequestModel>
          name="accessRequestsTable"
          columns={columns}
          data={requests}
          defaultCanSort={true}
          pageCount={Math.ceil(pagedAccessRequests.total / pageSize)}
          onRequestData={req => dispatch(getUpdateAccessRequestPageIndex(req.pageIndex))}
          onRowClick={showDetails}
        />
      </div>
    </div>
  );
};

export default ManageAccessRequests;
