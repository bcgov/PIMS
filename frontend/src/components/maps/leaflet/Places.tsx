import * as React from 'react';
import { Place } from '../../../utils/API';
import { PlaceMarkerProps, PlaceMarker } from './markers';

interface MarkerAndKey extends PlaceMarkerProps {
  key: string;
}

type PlacesProps = {
  places: Place[];
  onSave?: () => void;
  onDelete?: () => void;
};

const formatPlace = (p: Place): MarkerAndKey => {
  return {
    key: `${p.id}`,
    place: p,
  } as MarkerAndKey;
};

export const Places: React.FC<PlacesProps> = ({ places, onSave, onDelete }) => {
  const items = places
    .map(pl => formatPlace(pl))
    .map(({ key, ...props }) => {
      return <PlaceMarker key={key} {...props} onSave={onSave} onDelete={onDelete} />;
    });

  if (!items) {
    return null;
  }
  return <>{items}</>;
};

export default Places;
