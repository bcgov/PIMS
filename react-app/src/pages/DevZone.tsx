/* eslint-disable no-console */
//Simple component testing area.
import React, { useMemo, useState } from 'react';
// import PropertyDetail from '@/components/property/PropertyDetail';
import PropertyTable from '@/components/property/PropertyTable';
import PropertyDetail from '@/components/property/PropertyDetail';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';

const Dev = () => {
  const api = usePimsApi();

  const {
    data: parcels,
    isLoading: parcelsLoading,
    refreshData: refreshParcels,
    error: parcelError,
  } = useDataLoader(api.parcels.getParcels);
  const {
    data: buildings,
    isLoading: buildingsLoading,
    refreshData: refreshBuildings,
    error: buildingError,
  } = useDataLoader(api.buildings.getBuildings);

  const properties = useMemo(
    () => [
      ...(buildings?.map((b) => ({ ...b, Type: 'Building' })) ?? []),
      ...(parcels?.map((p) => ({ ...p, Type: 'Parcel' })) ?? []),
    ],
    [buildings, parcels],
  );

  const loading = parcelsLoading || buildingsLoading;
  const refresh = () => {
    refreshBuildings();
    refreshParcels();
  };
  const error = buildingError ?? parcelError;

  const [selectedParcelId, setSelectedParcelId] = useState<number>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(null);
  return selectedParcelId || selectedBuildingId ? (
    <PropertyDetail
      parcelId={selectedParcelId}
      buildingId={selectedBuildingId}
      onClose={() => {
        setSelectedBuildingId(null);
        setSelectedParcelId(null);
      }}
    />
  ) : (
    <PropertyTable
      data={properties}
      isLoading={loading}
      refreshData={refresh}
      rowClickHandler={(params) => {
        if (params.row.Type === 'Building') {
          setSelectedBuildingId(params.row.Id);
        } else {
          setSelectedParcelId(params.row.Id);
        }
      }}
      error={error}
    />
  );
};

export default Dev;
