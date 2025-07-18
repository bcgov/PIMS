import { ISelectMenuItem } from '@/components/form/SelectFormField';
import { Roles } from '@/constants/roles';
import { useContext, useEffect, useMemo } from 'react';
import useDataLoader from '../useDataLoader';
import { UserContext } from '@/contexts/userContext';
import usePimsApi from '../usePimsApi';
import useAgencyOptions from '../useAgencyOptions';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { LookupContext } from '@/contexts/lookupContext';

/**
 * @description Custom hook to fetch and manage agencies and agency options depending on a user's current agency and role.
 * @returns A hook containing the menu items and user agencies.
 */
const useUserAgencies = () => {
  const { pimsUser } = useContext(UserContext);
  const { data: lookupData } = useContext(LookupContext);
  const sso = useSSO();
  const { agencyOptions } = useAgencyOptions();
  const api = usePimsApi();
  const isAdmin = pimsUser?.hasOneOfRoles([Roles.ADMIN]);
  const { data: userAgencies, refreshData: refreshUserAgencies } = useDataLoader(() =>
    api.users.getUsersAgencyIds(sso.user.preferred_username),
  );

  useEffect(() => {
    refreshUserAgencies();
  }, [sso]);

  const userAgencyObjects = useMemo(() => {
    if (lookupData?.Agencies && userAgencies) {
      return lookupData?.Agencies.filter((a) => userAgencies.includes(a.Id));
    } else {
      return [];
    }
  }, [lookupData?.Agencies, userAgencies]);

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
