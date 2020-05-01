import React, { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { getUsersAction } from 'actionCreators/usersActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IStoreUsersAction } from 'actions/adminActions';
import { IPagedItems } from 'interfaces/pagedItems';
import { toApiPaginateParams } from 'utils/CommonFunctions';
import { IGenericNetworkAction } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import './ManageUsers.scss';
import { UsersList, TableStateChangeFn } from './components/UsersList';
import { IUser } from 'interfaces';
import { MUIDataTableState } from 'mui-datatables';
import { IUserRecord, AccountActive } from './interfaces/IUserRecord';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const MAX_USERS_PER_PAGE = 10;
  const pagedUsers = useSelector<RootState, IPagedItems<IUser>>(state => {
    return (state.users as IStoreUsersAction).pagedUsers;
  });
  const users = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_USERS] as IGenericNetworkAction,
  );
  useEffect(() => {
    dispatch(getUsersAction(toApiPaginateParams(0, MAX_USERS_PER_PAGE)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableChange: TableStateChangeFn = (type: string, state: MUIDataTableState) => {
    switch (type) {
      case 'pagination':
        break;
      case 'filter':
        break;
      case 'sort':
        break;
    }
  };
  const userList = pagedUsers.items.map(
    (u: IUser): IUserRecord => ({
      id: u.id,
      email: u.email,
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      active: u.isDisabled ? AccountActive.NO : AccountActive.YES,
      role: u.roles ? u.roles[0].name : 'No role attached',
      agency: u.agencies ? u.agencies[0].name : 'No agency associated',
      position: u.position,
    }),
  );

  return users && !users.isFetching ? (
    <Container fluid={true}>
      <UsersList
        data={userList}
        page={pagedUsers.page}
        pageSize={MAX_USERS_PER_PAGE}
        totalRows={pagedUsers.total}
        onTableChange={tableChange}
      />
    </Container>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default ManageUsers;
