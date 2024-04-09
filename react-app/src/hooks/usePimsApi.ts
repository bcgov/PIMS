import { ConfigContext } from '@/contexts/configContext';
import { useContext } from 'react';
import useFetch from './useFetch';
import useUsersApi from './api/useUsersApi';
import useAgencyApi from './api/useAgencyApi';
import useRolesApi from './api/useRolesApi';
import useReportsApi from '@/hooks/api/useReportsApi';
import useBuildingsApi from './api/useBuildingsApi';
import useParcelsApi from './api/useParcelsApi';
import useLookupApi from './api/useLookupApi';
import useAdministrativeAreaApi from './api/useAdministrativeAreaApi';
import useParcelLayerApi from './api/useParcelLayerApi';

/**
 * usePimsApi - This stores all the sub-hooks we need to make calls to our API and helps manage authentication state for them.
 * @returns
 */
const usePimsApi = () => {
  const config = useContext(ConfigContext);
  const fetch = useFetch(config?.API_HOST);

  const users = useUsersApi(fetch);
  const agencies = useAgencyApi(fetch);
  const roles = useRolesApi(fetch);
  const reports = useReportsApi(fetch);
  const buildings = useBuildingsApi(fetch);
  const parcels = useParcelsApi(fetch);
  const lookup = useLookupApi(fetch);
  const administrativeAreas = useAdministrativeAreaApi(fetch);
  const parcelLayer = useParcelLayerApi(fetch);

  return {
    users,
    agencies,
    roles,
    reports,
    buildings,
    parcels,
    lookup,
    administrativeAreas,
    parcelLayer,
  };
};

export default usePimsApi;
