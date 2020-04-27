import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getUsersAction } from 'actionCreators/usersActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IStoreUsersAction } from 'actions/adminActions';
import { IPagedItems } from 'interfaces/pagedItems';
import { toApiPaginateParams } from 'utils/CommonFunctions';
import { IGenericNetworkAction } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import WrappedPaginate from 'components/common/WrappedPaginate';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const MAX_USERS_PER_PAGE = 10;
  const pagedUsers = useSelector<RootState, IPagedItems>(
    state => (state.users as IStoreUsersAction).pagedUsers,
  );
  const users = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_USERS] as IGenericNetworkAction,
  );
  useEffect(() => {
    dispatch(getUsersAction(toApiPaginateParams(0, MAX_USERS_PER_PAGE)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return users && !users.isFetching ? (
    <Container fluid={true}>
      <Row>
        <Col>
          <h2>Manage Users</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {pagedUsers?.items?.length ? (
            <div className="bootstrap-table">
              <Row className="thead">
                <Col>User</Col>
                <Col>Agency</Col>
                <Col>Role</Col>
                <Col>Actions</Col>
              </Row>
              {pagedUsers?.items.map((user: any) => {
                if (!user?.agencies?.length) {
                  user.agencies = [{}];
                }
                if (!user?.roles?.length) {
                  user.roles = [{}];
                }
                return (
                  <Row key={user?.id}>
                    <Col>{user?.displayName}</Col>
                    <Col>{user?.agencies[0]?.name || 'No Agency Requested'}</Col>
                    <Col>{user?.roles[0]?.name || 'No Role Requested'}</Col>
                    <Col>
                      <div>
                        <button type="submit">Edit</button>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </div>
          ) : (
            <p>No Users available to be managed</p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <WrappedPaginate
            onPageChange={(page: any) => {
              dispatch(getUsersAction(toApiPaginateParams(page.selected, MAX_USERS_PER_PAGE)));
            }}
            {...pagedUsers}
          />
        </Col>
      </Row>
    </Container>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default ManageUsers;
