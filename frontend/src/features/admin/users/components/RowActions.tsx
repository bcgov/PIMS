import { Menu } from 'components/menu/Menu';
import { IUser } from 'interfaces';
import * as React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { CellProps } from 'react-table';
import { useAppDispatch, useAppSelector } from 'store';
import { getUpdateUserAction } from 'store/slices/hooks/usersActionCreator';

import { IUserRecord } from '../interfaces/IUserRecord';

export const RowActions = (props: CellProps<IUserRecord>) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((store) =>
    store.users.pagedUsers.items.find((user: IUser) => user.id === props.row.original.id),
  );

  const changeAccountStatus = async (disabled: boolean) => {
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
    navigate(`/admin/user/${props.row.original.id}`);
  };

  const isLastRow = props.row.original.id === props.data[props.data.length - 1].id;

  return (
    <Menu
      alignTop={isLastRow && props.data.length >= 20}
      disableScroll={true}
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
