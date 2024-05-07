import { MarkerPopup } from '@/components/map/markers/MarkerPopup';
import { getMatchingPropertyPin } from '@/components/map/markers/propertyPins';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { Marker } from 'react-leaflet';
import React, { useState } from 'react';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import { PropertyTypes } from '@/constants/propertyTypes';

export interface PropertyMarkerProps {
  property: PropertyGeo;
  isSelected: boolean;
  setSelectedIdentifier: React.Dispatch<
    React.SetStateAction<{
      id: any;
      type: any;
    }>
  >;
}

const PropertyMarker = (props: PropertyMarkerProps) => {
  const { property } = props;
  const api = usePimsApi();
  const [propertyData, setpropertyData] = useState(undefined);
  const [selected, setSelected] = useState(false);

  const { data: buildingData, loadOnce: loadBuilding } = useDataLoader(
    api.buildings.getBuildingById,
  );
  const { data: parcelData, loadOnce: loadParcel } = useDataLoader(api.parcels.getParcelById);

  const getPropertyData = async () => {
    console.log(property)
    if (property.PropertyTypeId === PropertyTypes.BUILDING) {
      await loadBuilding(property.Id);
      setpropertyData(buildingData);
    } else {
      await loadParcel(property.Id);
      setpropertyData(parcelData);
    }
    console.log(propertyData);
  };
  return (
    <Marker
      position={[property.Location.y, property.Location.x]}
      icon={getMatchingPropertyPin(property.PropertyTypeId, selected)}
      eventHandlers={{
        popupopen: async () => {
          await getPropertyData();
          setSelected(true)
          console.log(parcelData, buildingData);
        },
        click: (e) => {
          console.log('click', e);
          // const info = e.target.options.children.props.property;
          // setSelectedIdentifier({
          //   id: info.Id,
          //   type: info.PropertyTypeId,
          // })
        },
        popupclose: () => {
          setSelected(false)
        }
      }}
    >
      <MarkerPopup propertyData={propertyData} />
    </Marker>
  );
};

export default PropertyMarker;
