import usePimsUser, { IPimsUser as PimsUser } from '@/hooks/usePimsUser';
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
