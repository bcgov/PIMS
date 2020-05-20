import * as React from 'react';
import { IUserRecord } from '../interfaces/IUserRecord';
import { useStore, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IUser } from 'interfaces';
import { getUpdateUserAction } from 'actionCreators/usersActionCreator';
import { Menu } from 'components/menu/Menu';
import { FiMoreHorizontal } from 'react-icons/fi';
import { CellProps } from 'react-table';
import { IUsersState } from 'reducers/usersReducer';

export const RowActions = (props: CellProps<IUserRecord>) => {
  const store = useStore();
  const dispatch = useDispatch();

  const getUser = (): IUser | undefined =>
    ((store.getState() as RootState).users as IUsersState).pagedUsers.items.find(
      (user: IUser) => user.id === props.row.original.id,
    );

  const changeAccountStatus = async (disabled: boolean) => {
    const user = getUser();
    if (user) {
      user.isDisabled = disabled;
      await getUpdateUserAction({ id: props.row.original.id }, user)(dispatch);
    }
  };
  const enableUser = async () => {
    await changeAccountStatus(false);
  };

  const disableUser = async () => {
    await changeAccountStatus(true);
  };

  const openUserDetails = () => {
    window.location.assign(`/admin/user/${props.row.original.id}`);
  };

  return (
    <Menu
      options={[
        {
          label: 'Enable',
          disabled: !props.row.original.isDisabled,
          onClick: enableUser,
        },
        {
          label: 'Disable',
          disabled: props.row.original.isDisabled,
          onClick: disableUser,
        },
        {
          label: 'Open',
          onClick: openUserDetails,
        },
      ]}
    >
      <FiMoreHorizontal />
    </Menu>
  );
};
