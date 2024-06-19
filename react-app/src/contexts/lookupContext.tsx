import { AuthContext } from '@/contexts/authContext';
import { LookupAll } from '@/hooks/api/useLookupApi';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import React, { createContext, useContext } from 'react';

export const LookupContext = createContext<LookupAll | undefined>(undefined);

/**
 * Lookup context that provides values in a central context.
 *
 * @param {*} props
 * @return {*}
 */
export const LookupContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const api = usePimsApi();
  const { data, loadOnce } = useDataLoader(api.lookup.getAll);
  const { keycloak } = useContext(AuthContext);
  if (keycloak.isAuthenticated) {
    loadOnce();
  }
  return <LookupContext.Provider value={data}>{props.children}</LookupContext.Provider>;
};

export default LookupContextProvider;
