import usePimsUser, { IPimsUser as PimsUser } from '@/hooks/usePimsUser';
import { CircularProgress } from '@mui/material';
import React, { createContext } from 'react';
export interface PimsUserState {
  pimsUser: PimsUser;
}
export const UserContext = createContext<PimsUserState | undefined>(undefined);

/**
 * Provides access to user data about the logged in user.
 *
 * @param {*} props
 * @return {*}
 */
export const UserContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const pimsUser = usePimsUser();

  if (pimsUser.isLoading)
    return <CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />;
  return (
    <UserContext.Provider
      value={{
        pimsUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
