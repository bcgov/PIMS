import React, { useEffect } from 'react';
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { getAccessRequestsAction } from 'actionCreators/authActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IAccessRequest } from 'actions/adminActions';
import { IAccessRequestState } from 'reducers/accessRequestReducer';
import ReactPaginate from 'react-paginate';
import { toReactPaginateProps, toApiPaginateParams } from 'utils/CommonFunctions';
import { IGenericNetworkAction } from 'actions/genericActions';

const ManageAccessRequests = () => {
  const dispatch = useDispatch();
  const MAX_ACCESS_RESULTS_PER_PAGE = 5;
  const pagedAccessRequests = useSelector<RootState, IAccessRequest>(
    state => (state.accessRequest as IAccessRequestState).pagedAccessRequests,
  );
  const requestAccess = useSelector<RootState, IGenericNetworkAction>(
    state => state.accessRequest as IGenericNetworkAction,
  );
  useEffect(() => {
    if (!requestAccess)
      dispatch(getAccessRequestsAction(toApiPaginateParams(1, MAX_ACCESS_RESULTS_PER_PAGE)));
  }, [requestAccess]);

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          <h2>Manage Access Requests</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {!requestAccess.isFetching ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Requesting User</th>
                  <th>Requested Agency</th>
                  <th>Requested Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedAccessRequests.items.map((accessRequest: any) => {
                  if (!accessRequest?.agencies?.length) {
                    accessRequest.agencies = [{}];
                  }
                  if (!accessRequest?.roles?.length) {
                    accessRequest.roles = [{}];
                  }
                  return (
                    <tr key={accessRequest?.rowVersion}>
                      <td>{accessRequest?.user?.displayName}</td>
                      <td>{accessRequest?.agencies[0].name || 'No Agency Requested'}</td>
                      <td>{accessRequest?.roles[0].name || 'No Role Requested'}</td>
                      <td>Todo</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <Spinner animation="border"></Spinner>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <ReactPaginate
            {...toReactPaginateProps(pagedAccessRequests)}
            onPageChange={page => {
              dispatch(
                getAccessRequestsAction(
                  toApiPaginateParams(page.selected, MAX_ACCESS_RESULTS_PER_PAGE),
                ),
              );
            }}
          ></ReactPaginate>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageAccessRequests;
