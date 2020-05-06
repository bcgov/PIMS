import React, { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { getUsersAction, getUsersPaginationAction } from 'actionCreators/usersActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IPagedItems } from 'interfaces/pagedItems';
import { toApiPaginateParams } from 'utils/CommonFunctions';
import { IGenericNetworkAction } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import { UsersList, TableStateChangeFn } from './components/UsersList';
import { IUser } from 'interfaces';
import { MUIDataTableState } from 'mui-datatables';
import { IUserRecord, AccountActive, accountActiveToBool } from './interfaces/IUserRecord';
import { IUsersState, MAX_USERS_PER_PAGE } from 'reducers/usersReducer';
import { setUsersFilter, setUsersPageSize, setUsersSort, IUsersSort } from 'actions/adminActions';
import { sortBy } from 'lodash';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const pagedUsers = useSelector<RootState, IPagedItems<IUser>>(state => {
    return (state.users as IUsersState).pagedUsers;
  });

  const pageSize = useSelector<RootState, number>(state => {
    return (state.users as IUsersState).rowsPerPage;
  });

  const sort = useSelector<RootState, IUsersSort>(state => {
    return (state.users as IUsersState).sort;
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
      case 'sort':
        const sortColumn = state.columns.find(x => x.sortDirection !== 'none');
        if (sortColumn) {
          dispatch(
            setUsersSort({
              sortBy: sortColumn.name as any,
              direction: sortColumn.sortDirection as any,
            }),
          );
        }
        break;
      case 'resetFilters':
      case 'changePage':
      case 'filterChange':
      case 'changeRowsPerPage':
        dispatch(setUsersFilter(state.filterList));
        dispatch(setUsersPageSize(state.rowsPerPage));

        dispatch(
          getUsersPaginationAction({
            page: state.page + 1,
            quantity: state.rowsPerPage,
            username: state.filterList[1][0] || '',
            firstName: state.filterList[2][0] || '',
            lastName: state.filterList[3][0] || '',
            email: state.filterList[4][0] || '',
            isDisabled: accountActiveToBool(state.filterList[5][0]),
            agency: state.filterList[6][0] || '',
            position: state.filterList[7][0] || '',
            role: state.filterList[8][0] || '',
          }),
        );
        break;
    }
  };

  let userList = pagedUsers.items.map(
    (u: IUser): IUserRecord => ({
      id: u.id,
      email: u.email,
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      active: u.isDisabled ? AccountActive.NO : AccountActive.YES,
      role: u.roles && u.roles.length > 0 ? u.roles[0].name : 'No role attached',
      agency: u.agencies && u.agencies.length > 0 ? u.agencies[0].name : 'No agency associated',
      position: u.position,
    }),
  );

  if (sort) {
    userList = sortBy(userList, u => u[sort.sortBy]);
    if (sort.direction === 'desc') {
      userList = userList.reverse();
    }
  }

  return users && !users.isFetching ? (
    <Container fluid={true}>
      <UsersList
        data={userList}
        page={pagedUsers.pageIndex}
        pageSize={pageSize}
        totalRows={pagedUsers.total}
        onTableChange={tableChange}
        sort={sort}
      />
    </Container>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default ManageUsers;
