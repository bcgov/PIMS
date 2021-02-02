import React, { useEffect, useMemo, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { getUsersAction } from 'actionCreators/usersActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IPagedItems } from 'interfaces/pagedItems';
import { toFilteredApiPaginateParams } from 'utils/CommonFunctions';
import { IGenericNetworkAction } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import { IUser, IUsersFilter } from 'interfaces';
import { IUserRecord } from './interfaces/IUserRecord';
import { IUsersState } from 'reducers/usersReducer';
import { UsersFilterBar } from './components/UsersFilterBar';
import * as API from 'constants/API';
import { Table } from 'components/Table';
import { columnDefinitions } from './constants';
import { TableSort } from 'components/Table/TableSort';
import {
  getUsersSortAction,
  getUsersFilterAction,
  getUsersPageIndexAction,
  setUsersPageSize,
} from 'actions/adminActions';
import { formatApiDateTime, generateMultiSortCriteria } from 'utils';
import styled from 'styled-components';
import useCodeLookups from 'hooks/useLookupCodes';
import { isEmpty } from 'lodash';
import _ from 'lodash';

const TableContainer = styled(Container)`
  margin-top: 10px;
  margin-bottom: 40px;
`;

export const ManageUsersPage = () => {
  const dispatch = useDispatch();
  const { getByType } = useCodeLookups();
  const agencies = useMemo(() => getByType(API.AGENCY_CODE_SET_NAME), [getByType]);
  const roles = useMemo(() => getByType(API.ROLE_CODE_SET_NAME), [getByType]);

  const columns = useMemo(() => columnDefinitions, []);

  const pagedUsers = useSelector<RootState, IPagedItems<IUser>>(state => {
    return (state.users as IUsersState).pagedUsers;
  });

  const pageSize = useSelector<RootState, number>(state => {
    return (state.users as IUsersState).rowsPerPage;
  });

  const pageIndex = useSelector<RootState, number>(state => {
    return (state.users as IUsersState).pageIndex;
  });

  const sort = useSelector<RootState, TableSort<IUserRecord>>(state => {
    return (state.users as IUsersState).sort;
  });

  const filter = useSelector<RootState, IUsersFilter>(state => {
    return (state.users as IUsersState).filter;
  });

  const users = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_USERS] as IGenericNetworkAction,
  );

  const onRequestData = useCallback(
    ({ pageIndex }) => {
      dispatch(getUsersPageIndexAction(pageIndex));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(
      getUsersAction(
        toFilteredApiPaginateParams<IUsersFilter>(
          pageIndex,
          pageSize,
          sort && !isEmpty(sort) ? generateMultiSortCriteria(sort) : undefined,
          filter,
        ),
      ),
    );
  }, [dispatch, sort, pageIndex, pageSize, filter]);

  let userList = pagedUsers.items.map(
    (u: IUser): IUserRecord => ({
      id: u.id,
      email: u.email,
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      isDisabled: u.isDisabled,
      roles: u.roles ? u.roles.map(r => r.name).join(', ') : '',
      agency: u.agencies && u.agencies.length > 0 ? u.agencies[0].name : '',
      position: u.position ?? '',
      lastLogin: formatApiDateTime(u.lastLogin),
      createdOn: formatApiDateTime(u.createdOn),
    }),
  );

  return (
    <div className="users-management-page">
      <UsersFilterBar
        value={filter}
        agencyLookups={agencies}
        rolesLookups={roles}
        onChange={value => {
          (value as any)?.agency
            ? dispatch(
                getUsersFilterAction({
                  ...value,
                  agency: (_.find(agencies, { id: +(value as any)?.agency }) as any)?.name,
                }),
              )
            : dispatch(getUsersFilterAction({ ...value, agency: '' }));
          dispatch(getUsersPageIndexAction(0));
        }}
      />
      {
        <TableContainer fluid>
          <Table<IUserRecord>
            name="usersTable"
            columns={columns}
            pageIndex={pageIndex}
            data={userList}
            defaultCanSort={true}
            pageCount={Math.ceil(pagedUsers.total / pageSize)}
            pageSize={pageSize}
            onRequestData={onRequestData}
            onSortChange={(column, direction) => {
              if (!!direction) {
                dispatch(getUsersSortAction({ [column]: direction }));
              } else {
                dispatch(getUsersSortAction({}));
              }
            }}
            sort={sort}
            onPageSizeChange={size => dispatch(setUsersPageSize(size))}
            loading={!(users && !users.isFetching)}
            clickableTooltip="Click IDIR/BCeID link to view User Information page"
          />
        </TableContainer>
      }
    </div>
  );
};
