import variables from '_variables.module.scss';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { Table } from 'components/Table';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { IPaginateParams } from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import useCodeLookups from 'hooks/useLookupCodes';
import { IUser, IUsersFilter } from 'interfaces';
import { isEmpty } from 'lodash';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaFileExcel } from 'react-icons/fa';
import { IGenericNetworkAction } from 'store';
import { useAppDispatch, useAppSelector } from 'store';
import { getUsersAction } from 'store/slices/hooks/usersActionCreator';
import {
  storeUserFilter,
  storeUserPageIndex,
  storeUserPageQuantity,
  storeUserSort,
} from 'store/slices/userSlice';
import styled from 'styled-components';
import { formatApiDateTime, generateMultiSortCriteria } from 'utils';
import { toFilteredApiPaginateParams } from 'utils/CommonFunctions';
import download from 'utils/download';

import { UsersFilterBar } from './components/UsersFilterBar';
import { columnDefinitions } from './constants';
import { IUserRecord } from './interfaces/IUserRecord';

const TableContainer = styled(Container)`
  margin-top: 10px;
  margin-bottom: 40px;
`;

const FileIcon = styled(Button)`
  background-color: #fff !important;
  color: ${variables.primaryColor} !important;
  padding: 6px 5px;
`;

const downloadUsers = (filter: IPaginateParams) => {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filter ?? {})) {
    queryParams.set(key, String(value));
  }
  queryParams.set('all', 'true');
  return `${ENVIRONMENT.apiUrl}/reports/users?${queryParams.toString()}`;
};

/**
 * Component to manage the user accounts.
 * Displays users in a list view.
 * Contains a filter to find users.
 * @component
 * @returns A ManagerUser component.
 */
export const ManageUsers = () => {
  const dispatch = useAppDispatch();
  const { getByType } = useCodeLookups();
  const agencies = useMemo(() => getByType(API.AGENCY_CODE_SET_NAME), [getByType]);
  const roles = useMemo(() => getByType(API.ROLE_CODE_SET_NAME), [getByType]);
  const columns = useMemo(() => columnDefinitions, []);

  const pagedUsers = useAppSelector((store) => store.users.pagedUsers);
  const pageSize = useAppSelector((store) => store.users.rowsPerPage);
  const pageIndex = useAppSelector((store) => store.users.pageIndex);
  const sort = useAppSelector((store) => store.users.sort);
  const filter = useAppSelector((store) => store.users.filter);
  const users = useAppSelector(
    (store) => (store.network.requests as any)[actionTypes.GET_USERS] as IGenericNetworkAction,
  );

  const onRequestData = useCallback(
    ({ pageIndex }: { pageIndex: number }) => {
      dispatch(storeUserPageIndex(pageIndex));
    },
    [dispatch],
  );

  useEffect(() => {
    getUsersAction(
      toFilteredApiPaginateParams<IUsersFilter>(
        pageIndex,
        pageSize,
        sort && !isEmpty(sort) ? generateMultiSortCriteria(sort) : undefined,
        filter,
      ),
    )(dispatch);
  }, [dispatch, sort, pageIndex, pageSize, filter]);

  const userList = pagedUsers.items.map(
    (u: IUser): IUserRecord => ({
      id: u.id,
      email: u.email,
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      isDisabled: u.isDisabled,
      roles: u.roles ? u.roles.map((r) => r?.name).join(', ') : '',
      agency: u.agencies && u.agencies.length > 0 ? u.agencies[0]?.name : '',
      position: u.position ?? '',
      lastLogin: u.lastLogin ? formatApiDateTime(u.lastLogin) : '',
      createdOn: u.createdOn !== '0001-01-01T00:00:00' ? formatApiDateTime(u.createdOn) : '',
    }),
  );

  /**
   * @param {'csv' | 'excel'} accept Whether the fetch is for type of CSV or EXCEL
   */
  const fetch = (accept: 'csv' | 'excel') => {
    const query = toFilteredApiPaginateParams<IUsersFilter>(
      pageIndex,
      pageSize,
      sort && !isEmpty(sort) ? generateMultiSortCriteria(sort) : undefined,
      filter,
    );
    return download({
      url: downloadUsers(query),
      fileName: `pims-users.${accept === 'csv' ? 'csv' : 'xlsx'}`,
      actionType: 'users',
      headers: {
        Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
      },
    })(dispatch);
  };

  return (
    <div className="users-management-page" data-testid="admin-users-page">
      <UsersFilterBar
        value={filter}
        agencyLookups={agencies}
        rolesLookups={roles}
        onChange={(value) => {
          (value as any)?.agency
            ? dispatch(
                storeUserFilter({
                  ...value,
                  agency: (_.find(agencies, { id: +(value as any)?.agency }) as any)?.name,
                }),
              )
            : dispatch(storeUserFilter({ ...value, agency: '' }));
          dispatch(storeUserPageIndex(0));
        }}
      />
      {
        <>
          <div style={{ paddingLeft: '90%' }}>
            <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to Excel">
              <FileIcon>
                <FaFileExcel data-testid="excel-icon" size={36} onClick={() => fetch('excel')} />
              </FileIcon>
            </TooltipWrapper>
          </div>
          <TableContainer fluid>
            <Table<IUserRecord, any>
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
                  dispatch(storeUserSort({ [column]: direction }));
                } else {
                  dispatch(storeUserSort({}));
                }
              }}
              sort={sort}
              onPageSizeChange={(size) => dispatch(storeUserPageQuantity(size))}
              loading={!(users && !users.isFetching)}
              clickableTooltip="Click IDIR/BCeID link to view User Information page"
            />
          </TableContainer>
        </>
      }
    </div>
  );
};

export default ManageUsers;
