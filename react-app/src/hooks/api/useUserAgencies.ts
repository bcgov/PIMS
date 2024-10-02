import { ISelectMenuItem } from '@/components/form/SelectFormField';
import { Roles } from '@/constants/roles';
import { useContext, useEffect, useMemo } from 'react';
import useDataLoader from '../useDataLoader';
import { UserContext } from '@/contexts/userContext';
import usePimsApi from '../usePimsApi';
import useGroupedAgenciesApi from './useGroupedAgenciesApi';
import { useSSO } from '@bcgov/citz-imb-sso-react';

const useUserAgencies = () => {
  const { pimsUser } = useContext(UserContext);
  const sso = useSSO();
  const { ungroupedAgencies, agencyOptions } = useGroupedAgenciesApi();
  const api = usePimsApi();
  const isAdmin = pimsUser?.hasOneOfRoles([Roles.ADMIN]);
  const { data: userAgencies, refreshData: refreshUserAgencies } = useDataLoader(() =>
    api.users.getUsersAgencyIds(sso.user.preferred_username),
  );

  useEffect(() => {
    refreshUserAgencies();
  }, [sso]);

  const userAgencyObjects = useMemo(() => {
    if (ungroupedAgencies && userAgencies) {
      return ungroupedAgencies.filter((a) => userAgencies.includes(a.Id));
    } else {
      return [];
    }
  }, [ungroupedAgencies, userAgencies]);

  const menuItems: ISelectMenuItem[] = useMemo(() => {
    if (isAdmin) {
      return agencyOptions;
    } else if (userAgencyObjects) {
      return agencyOptions.filter((agc) =>
        userAgencyObjects.some((useragc) => useragc.Id === agc.value),
      );
    } else {
      return [];
    }
  }, [agencyOptions, userAgencyObjects, isAdmin]);

  return { menuItems, userAgencies: userAgencyObjects };
};

export default useUserAgencies;
