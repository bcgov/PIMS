import * as React from 'react';
import { Popup } from 'react-leaflet';
import { Place, CreatePlacePayload } from '../../../utils/API';
import AutoMarker from './AutoMarker';
import AddPlaceForm from '../AddPlaceForm';
import EditPlaceForm from '../EditPlaceForm';

export interface PlaceMarkerProps {
  place: Place;
  onSave?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export const PlaceMarker: React.FC<PlaceMarkerProps> = ({ place, onSave, onDelete }) => {
  if (!place) {
    throw new Error('Place property is required.');
  }
  return (
    <AutoMarker position={[place.latitude, place.longitude]} autoPopup={false}>
      <Popup>
        <EditPlaceForm place={place} onSave={onSave} onDelete={onDelete} />
      </Popup>
    </AutoMarker>
  );
};

export interface NewMarkerProps {
  place: CreatePlacePayload;
  onSave?: () => void;
  onClose?: () => void;
}

export const NewMarker: React.FC<NewMarkerProps> = ({ place, onSave, onClose }) => {
  if (!place) {
    throw new Error('Place property is required.');
  }
  return (
    <AutoMarker position={[place.latitude, place.longitude]} autoPopup={true}>
      <Popup onClose={onClose}>
        <AddPlaceForm place={place} onSave={onSave} />
      </Popup>
    </AutoMarker>
  );
};
