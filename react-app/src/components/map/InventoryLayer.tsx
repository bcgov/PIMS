import usePimsApi from '@/hooks/usePimsApi';
import React, { useCallback, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

export const InventoryLayer = () => {
  const api = usePimsApi();
  const map = useMap();
  // const { data, loadOnce } = useDataLoader(api.parcels.getParcels);
  const [properties, setProperties] = useState([]);
  // loadOnce();


  const setMarkers = useCallback(() => {
    api.parcels.getParcels().then((parcels) => setProperties(parcels));
    api.buildings.getBuildings().then((buildings) => setProperties([...properties,...buildings]));
  }, [map]);

  useEffect(() => {
    setMarkers();
  }, [0])

  return (
    <MarkerClusterGroup chunkedLoading>
      {properties.map((parcel) => (
        <Marker
          key={parcel.Id}
          position={[parcel.Location.y, parcel.Location.x]}
          icon={
            new L.DivIcon({
              html: `<div><span>${parcel.Id}</span></div>`,
              className: `marker-cluster marker-cluster`,
              iconSize: [40, 40],
            })
          }
        />
      ))}
    </MarkerClusterGroup>
  );
  // if (!data) return <></>;
  // return (
  //   <>
  //     {data.map((parcel) => (
  //       <Marker
  //         key={parcel.Id}
  //         position={[parcel.Location.y, parcel.Location.x]}
  //         icon={
  //           new L.DivIcon({
  //             html: `<div><span>${parcel.Id}</span></div>`,
  //             className: `marker-cluster marker-cluster`,
  //             iconSize: [40, 40],
  //           })
  //         }
  //       />
  //     ))}
  //   </>
  // );
};
