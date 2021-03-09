import { useMemo } from 'react';
import useKeycloakWrapper from './useKeycloakWrapper';
import * as API from 'constants/API';
import useCodeLookups from './useLookupCodes';
import { Claims } from 'constants/claims';
import { SelectOption } from 'components/common/form';

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
  const userAgency = agencies.find(a => Number(a.value) === Number(keycloak.agencyId));

  const isSRES = useMemo(() => {
    return (
      keycloak.hasClaim(Claims.PROJECT_VIEW) ||
      keycloak.hasClaim(Claims.DISPOSE_APPROVE) ||
      keycloak.hasClaim(Claims.ADMIN_PROJECTS)
    );
  }, [keycloak]);

  const agencyOptions = useMemo(() => {
    return agencies.filter(a => {
      return (
        isSRES ||
        Number(a.value) === Number(userAgency?.value) ||
        Number(a.parentId) === Number(userAgency?.value)
      );
    });
  }, [userAgency, agencies, isSRES]);

  return agencyOptions;
};
