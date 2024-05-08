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
      position={property.geometry.coordinates}
      icon={getMatchingPropertyPin(
        property.properties.PropertyTypeId,
        selectedMarker?.id === property.properties.Id && selectedMarker?.type === property.properties.PropertyTypeId,
      )}
      eventHandlers={{
        click: () => {
          const selectedIdentifer: SelectedPropertyIdentifier = {
            id: property.properties.Id,
            type: property.properties.PropertyTypeId,
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
