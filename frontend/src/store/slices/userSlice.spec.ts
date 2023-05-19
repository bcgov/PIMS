import { TableSort } from 'components/Table/TableSort';
import { IUserRecord } from 'features/admin/users/interfaces/IUserRecord';
import { IPagedItems, IUser, IUsersFilter } from 'interfaces';

import {
  initialUserState,
  IUserDetail,
  storeUser,
  storeUserFilter,
  storeUserPageIndex,
  storeUserPageQuantity,
  storeUsers,
  storeUserSort,
  updateUser,
  userSlice,
} from '.';

describe('User Slice tests', () => {
  const reducer = userSlice.reducer;
  const user: IUser = {
    id: 'user',
  };
  const users: IPagedItems<IUser> = {
    items: [user],
    page: 1,
    pageIndex: 0,
    quantity: 10,
    total: 1,
  };

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialUserState);
  });

  it('Should store user detail in state', () => {
    const detail: IUserDetail = {
      id: 'userId',
      username: 'username',
      displayName: 'displayName',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      isDisabled: false,
      emailVerified: false,
      agencies: [],
      roles: [],
      createdOn: Date.UTC.toString(),
      rowVersion: 'version',
      goldUserRoles: [],
    };
    expect(reducer(undefined, storeUser(detail))).toEqual({ ...initialUserState, user: detail });
  });

  it('Should store users in state', () => {
    expect(reducer(undefined, storeUsers(users))).toEqual({
      ...initialUserState,
      pagedUsers: users,
    });
  });

  it('Should update specified user in state', () => {
    const data = {
      ...user,
      name: 'test',
    };
    expect(reducer({ ...initialUserState, pagedUsers: users }, updateUser(data))).toEqual({
      ...initialUserState,
      pagedUsers: { ...users, items: users.items.map((u) => (u.id === data.id ? data : u)) },
    });
  });

  it('Should update page size', () => {
    const pageSize = 5;
    expect(reducer(undefined, storeUserPageQuantity(pageSize))).toEqual({
      ...initialUserState,
      rowsPerPage: pageSize,
    });
  });

  it('Should update page index', () => {
    const pageIndex = 5;
    expect(reducer(undefined, storeUserPageIndex(pageIndex))).toEqual({
      ...initialUserState,
      pageIndex: pageIndex,
    });
  });

  it('Should update filter', () => {
    const filter: IUsersFilter = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      position: 'position',
      agency: 'agency',
      role: 'role',
    };
    expect(reducer(undefined, storeUserFilter(filter))).toEqual({
      ...initialUserState,
      filter,
    });
  });

  it('Should update sort', () => {
    const sort: TableSort<IUserRecord> = {
      id: 'asc',
      keycloakUserId: 'desc',
      email: 'asc',
      username: 'asc',
      firstName: 'asc',
      lastName: 'asc',
      isDisabled: 'asc',
      agency: 'asc',
      roles: 'asc',
      position: 'desc',
      lastLogin: 'asc',
      createdOn: 'asc',
    };
    expect(reducer(undefined, storeUserSort(sort))).toEqual({
      ...initialUserState,
      sort,
    });
  });
});
