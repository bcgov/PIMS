import React, { useState, useEffect, useRef } from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import { LatLngTuple, LeafletMouseEvent } from 'leaflet';
import { useKeycloak } from 'react-keycloak';
import API, { Place, CreatePlacePayload } from '../../../utils/API';
import Places from './Places';
import { NewMarker } from './markers';
import { Modal, Button } from 'react-bootstrap';
import './Map.scss';
import warning from './warning.svg';

type MapProps = {
  lat: number;
  lng: number;
  zoom: number;
  activeUserId: string;
};

const Map: React.FC<MapProps> = props => {
  // props
  const mapCenter: LatLngTuple = [props.lat, props.lng];
  const { keycloak } = useKeycloak();

  // state
  const [places, setPlaces] = useState<Place[]>([]);
  const [newPlace, setNewPlace] = useState<CreatePlacePayload | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<number>(new Date().getTime());
  const mapRef = useRef<LeafletMap>(null);

  const isAdmin = () => {
    if (keycloak && keycloak.realmAccess && keycloak.realmAccess.roles) {
      return keycloak.realmAccess.roles.indexOf('administrator') >= 0;
    }
  };

  // effects == lifecycle methods (componentDidMount)
  useEffect(() => {
    if (isAdmin()) {
      API.getAllPlacesFiltered(props.activeUserId).then(data => {
        setPlaces([...data]);
      });
      return;
    }
    API.getMyPlaces().then(data => {
      setPlaces([...data]);
    });
  }, [timestamp, props.activeUserId, keycloak]);

  const closePopups = () => {
    mapRef?.current?.leafletElement?.closePopup();
  };

  const refresh = () => {
    closePopups();
    setNewPlace(null);
    setTimestamp(new Date().getTime());
  };

  // Adds a marker on map click
  const handleMapClick = (e: LeafletMouseEvent) => {
    const marker: CreatePlacePayload = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      note: '',
    };
    if (isAdmin() && !(keycloak.subject === props.activeUserId)) {
      setShow(true);
      return;
    }
    setNewPlace(marker);
  };

  const addToMyPlaces = () => {
    if (!newPlace) {
      return;
    }
    API.createPlace(newPlace).then(p => {
      setPlaces([...places, p]);
      refresh();
    });
  };

  const getUserName = () => {
    if (keycloak && keycloak.userInfo && keycloak.userInfo) {
      var user: any = keycloak.userInfo;
      return user.name;
    }
  };

  return (
    <LeafletMap ref={mapRef} center={mapCenter} zoom={props.zoom} onclick={handleMapClick}>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Body>
          <img alt="warning" src={warning} width="43" height="43" />
          />
          <p>
            You must select yourself ({getUserName()}) within the 'Filter' to create a new Place.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ backgroundColor: 'grey' }}
            onClick={() => setShow(false)}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {newPlace && <NewMarker place={newPlace} onSave={addToMyPlaces} onClose={refresh} />}
      <Places places={places} onSave={refresh} onDelete={refresh} />
    </LeafletMap>
  );
};

export default Map;
