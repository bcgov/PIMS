import { ISelectMenuItem } from '@/components/form/SelectFormField';
import { Roles } from '@/constants/roles';
import { useContext, useEffect, useMemo } from 'react';
import useDataLoader from './useDataLoader';
import { AuthContext } from '@/contexts/authContext';
import { LookupContext } from '@/contexts/lookupContext';
import usePimsApi from './usePimsApi';

const useUserAgencies = () => {
  const userContext = useContext(AuthContext);
  const { data: lookupData } = useContext(LookupContext);
  const api = usePimsApi();
  const isAdmin = userContext.keycloak.hasRoles([Roles.ADMIN]);
  const { data: userAgencies, refreshData: refreshUserAgencies } = useDataLoader(() =>
    api.users.getUsersAgencyIds(userContext.keycloak.user.preferred_username),
  );

  useEffect(() => {
    refreshUserAgencies();
  }, [userContext.keycloak]);

  const userAgencyObjects = useMemo(() => {
    if (lookupData && userAgencies) {
      return lookupData.Agencies.filter((a) => userAgencies.includes(a.Id));
    } else {
      return [];
    }
  }, [lookupData, userAgencies]);

  const menuItems: ISelectMenuItem[] = useMemo(() => {
    if (isAdmin) {
      return lookupData
        ? lookupData.Agencies.map((agc) => ({ label: agc.Name, value: agc.Id }))
        : [];
    } else if (userAgencyObjects) {
      return (
        userAgencyObjects.map((agc) => ({
          label: agc.Name,
          value: agc.Id,
        })) ?? []
      );
    } else {
      return [];
    }
  }, [lookupData, userAgencyObjects, isAdmin]);

  return { menuItems, userAgencies: userAgencyObjects };
};

export default useUserAgencies;
