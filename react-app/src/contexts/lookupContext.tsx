import { LookupAll } from '@/hooks/api/useLookupApi';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { CircularProgress } from '@mui/material';
import React, { createContext, useCallback, useMemo } from 'react';

type LookupContextValue = {
  data: LookupAll | undefined;
  getLookupValueById: (a: keyof LookupAll, b: number) => any | undefined;
};
export const LookupContext = createContext<LookupContextValue>(undefined);

/**
 * Lookup context that provides values in a central context.
 *
 * @param {*} props
 * @return {*}
 */
export const LookupContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const api = usePimsApi();
  const { data, loadOnce, isLoading } = useDataLoader(api.lookup.getAll);
  const sso = useSSO();
  if (!data && sso.isAuthenticated) {
    loadOnce();
  }

  // Memoizes a lookup table to facilitate finding records by their Id.
  const lookupTables = useMemo(() => {
    const ret = {};
    if (data) {
      for (const k of Object.keys(data)) {
        if (Array.isArray(data[k])) {
          ret[k] = (data[k] as Record<string, any>[]).reduce(
            (acc, curr) => ({ ...acc, [curr.Id]: curr }),
            {},
          );
        }
      }
      return ret;
    } else {
      return undefined;
    }
  }, [data]);

  // Retrieves record from lookupTables based on table name and record Id.
  const getLookupValueById = useCallback(
    (tableName: keyof LookupAll, id: number) => {
      if (lookupTables === undefined) {
        return undefined;
      } else {
        return lookupTables[tableName][id];
      }
    },
    [data],
  );

  const contextValue = { data, getLookupValueById };
  if (isLoading) return <CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />;
  return <LookupContext.Provider value={contextValue}>{props.children}</LookupContext.Provider>;
};

export default LookupContextProvider;
