import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_PAGE_SIZE } from 'components/Table/constants';
import { TableSort } from 'components/Table/TableSort';
import { IUserRecord } from 'features/admin/users/interfaces/IUserRecord';
import { IAgency, IPagedItems, IRole, IUser, IUsersFilter } from 'interfaces';

export const storeUser = createAction<IUserDetail | null>('storeUser');
export const updateUser = createAction<IUser>('updateUser');
export const storeUsers = createAction<IPagedItems<IUser>>('storeUsers');
export const storeUserFilter = createAction<IUsersFilter>('storeUserFilter');
export const storeUserSort = createAction<TableSort<IUserRecord>>('storeUserSort');
export const storeUserPageIndex = createAction<number>('storeUserPageIndex');
export const storeUserPageQuantity = createAction<number>('storeUserPageQuantity');
export const clearUser = createAction('clearUser');

export interface IUserDetail {
  id: string;
  username: string;
  keycloakUserId?: string;
  displayName: string;
  position?: string;
  firstName: string;
  lastName: string;
  email: string;
  isDisabled: boolean;
  emailVerified: boolean;
  agencies: IAgency[];
  roles: IRole[];
  note?: string;
  lastLogin?: string;
  createdOn: string;
  rowVersion: string;
  goldUserRoles: string[];
}

export interface IUsersState {
  user: IUserDetail;
  pagedUsers: IPagedItems<IUser>;
  rowsPerPage: number;
  filter: IUsersFilter;
  sort: TableSort<IUserRecord>;
  pageIndex: number;
}

export const initialUserState: IUsersState = {
  user: {
    id: '',
    username: '',
    displayName: '',
    firstName: '',
    lastName: '',
    email: '',
    isDisabled: false,
    emailVerified: false,
    agencies: [],
    roles: [],
    createdOn: '',
    rowVersion: '',
    goldUserRoles: [],
  },
  pagedUsers: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  rowsPerPage: DEFAULT_PAGE_SIZE,
  filter: {},
  sort: { username: 'asc' },
  pageIndex: 0,
};

export const userSlice = createSlice({
  name: 'users',
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder.addCase(storeUser, (state: IUsersState, action: PayloadAction<IUserDetail>) => {
      return { ...state, user: action.payload };
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(clearUser, (state: IUsersState, action: PayloadAction<IUserDetail>) => {
      return { ...state, user: initialUserState.user };
    });
    builder.addCase(updateUser, (state: IUsersState, action: PayloadAction<IUser>) => {
      return {
        ...state,
        pagedUsers: {
          ...state.pagedUsers,
          items: [
            ...state.pagedUsers.items.map((u: IUser) =>
              u.id === action.payload.id ? action.payload : u,
            ),
          ],
        },
      };
    });
    builder.addCase(storeUsers, (state: IUsersState, action: PayloadAction<IPagedItems<IUser>>) => {
      return { ...state, pagedUsers: action.payload };
    });
    builder.addCase(storeUserFilter, (state: IUsersState, action: PayloadAction<IUsersFilter>) => {
      return { ...state, filter: action.payload };
    });
    builder.addCase(
      storeUserSort,
      (state: IUsersState, action: PayloadAction<TableSort<IUserRecord>>) => {
        return { ...state, sort: action.payload };
      },
    );
    builder.addCase(storeUserPageIndex, (state: IUsersState, action: PayloadAction<number>) => {
      return { ...state, pageIndex: action.payload };
    });
    builder.addCase(storeUserPageQuantity, (state: IUsersState, action: PayloadAction<number>) => {
      return { ...state, rowsPerPage: action.payload };
    });
  },
});

export default userSlice;
