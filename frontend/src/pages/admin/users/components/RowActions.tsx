import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import { AccountActive } from '../interfaces/IUserRecord';
import { useStore, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IUser } from 'interfaces';
import { getUpdateUserAction } from 'actionCreators/usersActionCreator';
export interface IRowActionProps {
  userId: string;
  active: AccountActive;
}

export const RowActions = (props: IRowActionProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const store = useStore();
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = () => {
    setAnchorEl(null);
  };

  const getUser = (): IUser | undefined =>
    (store.getState() as RootState).users.pagedUsers.items.find(
      (user: IUser) => user.id === props.userId,
    );

  const changeAccountStatus = async (disabled: boolean) => {
    const user = getUser();
    if (user) {
      user.isDisabled = disabled;
      await getUpdateUserAction({ id: props.userId }, user)(dispatch);
      close();
    }
  };
  const enableUser = async () => {
    await changeAccountStatus(false);
  };

  const disableUser = async () => {
    await changeAccountStatus(true);
  };

  const openUserDetails = () => {
    close();
    window.location.assign(`/admin/user/${props.userId}`);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreIcon />
      </IconButton>
      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={close}>
        <MenuItem
          data-testid={`enable-${props.userId}`}
          disabled={props.active === AccountActive.YES}
          onClick={enableUser}
        >
          Enable
        </MenuItem>
        <MenuItem
          data-testid={`disable-${props.userId}`}
          disabled={props.active === AccountActive.NO}
          onClick={disableUser}
        >
          Disable
        </MenuItem>
        <MenuItem onClick={openUserDetails}>Open</MenuItem>
      </Menu>
    </div>
  );
};
