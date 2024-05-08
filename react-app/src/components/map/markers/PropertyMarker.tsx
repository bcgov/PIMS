import { getMatchingPropertyPin } from '@/components/map/markers/propertyPins';
import { PropertyGeo } from '@/hooks/api/usePropertiesApi';
import { Marker } from 'react-leaflet';
import React, { useContext } from 'react';
import { SelectedPropertyIdentifier } from '@/components/map/MapPropertyDetails';
import { SelectedMarkerContext } from '@/components/map/ParcelMap';

export interface PropertyMarkerProps {
  property: PropertyGeo;
}

const PropertyMarker = (props: PropertyMarkerProps) => {
  const { property } = props;
  const { selectedMarker, setSelectedMarker } = useContext(SelectedMarkerContext);
  return (
    <Marker
      position={[property.Location.y, property.Location.x]}
      icon={getMatchingPropertyPin(
        property.PropertyTypeId,
        selectedMarker?.id === property.Id && selectedMarker?.type === property.PropertyTypeId,
      )}
      eventHandlers={{
        click: () => {
          const selectedIdentifer: SelectedPropertyIdentifier = {
            id: property.Id,
            type: property.PropertyTypeId,
          };
          setSelectedMarker(selectedIdentifer);
        },
      }}
    >
      {/* Popup can go here */}
    </Marker>
  );
};

export default PropertyMarker;
