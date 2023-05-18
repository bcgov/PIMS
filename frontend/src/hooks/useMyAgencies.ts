import { SelectOption } from 'components/common/form';
import * as API from 'constants/API';
import { Claims } from 'constants/claims';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import useKeycloakWrapper from './useKeycloakWrapper';
import useCodeLookups from './useLookupCodes';

/**
 * Hook to get only the agencies that the user belongs to
 * SRES => All agencies
 * Parent Agency => Parent agency + child agencies
 * Child Agency => only the child agency
 * @returns array of agency select options
 */
export const useMyAgencies = (): SelectOption[] => {
  const { getOptionsByType } = useCodeLookups();

  const keycloak = useKeycloakWrapper();
  const agencies = getOptionsByType(API.AGENCY_CODE_SET_NAME);
  //@ts-ignore
  const userAgencyIds: number[] = useSelector((state) => state.usersAgencies);

  const isSRES = useMemo(() => {
    return (
      keycloak.hasClaim(Claims.PROJECT_VIEW) ||
      keycloak.hasClaim(Claims.DISPOSE_APPROVE) ||
      keycloak.hasClaim(Claims.ADMIN_PROJECTS) ||
      keycloak.hasClaim(Claims.VIEW_ONLY_PROPERTIES)
    );
  }, [keycloak]);

  const agencyOptions = useMemo(() => {
    return agencies.filter((a) => {
      return (
        isSRES ||
        userAgencyIds.includes(Number(a.value)) ||
        userAgencyIds.includes(Number(a.parentId))
      );
    });
  }, [userAgencyIds, agencies, isSRES]);

  return agencyOptions;
};
