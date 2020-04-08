import './SubmitProperty.scss';

import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import ParcelDetailForm from 'forms/ParcelDetailForm';
import MapView from './MapView';
import {
  IParcelDetail,
  IParcel,
  storeParcelsAction,
  storeParcelDetail,
  IProperty,
} from 'actions/parcelsActions';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from 'react-router-dom';
import { IGenericNetworkAction, clear } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { fetchParcelDetail } from 'actionCreators/parcelsActionCreator';

const SubmitProperty = (props: any) => {
  const parsed = queryString.parse(props?.location?.search);
  const history = useHistory();
  const keycloak = useKeycloakWrapper();
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent.mapClickEvent,
  );
  const activeParcelDetail = useSelector<RootState, IParcelDetail>(
    state => state.parcel.parcelDetail as IParcelDetail,
  );
  const properties = useSelector<RootState, IProperty[]>(state => state.parcel.parcels);
  const addParcelRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.ADD_PARCEL] as IGenericNetworkAction,
  );
  const updateParcelRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.UPDATE_PARCEL] as IGenericNetworkAction,
  );
  const dispatch = useDispatch();
  if (!keycloak.agencyId) {
    //TODO: throw an error here, error boundary should catch.
    throw Error('You must belong to an agency to submit properties');
  }
  if (!props?.match?.params?.id && activeParcelDetail?.parcelDetail) {
    dispatch(storeParcelDetail(null));
  }
  const updateLatLng = (values: IParcel) => {
    if (leafletMouseEvent) {
      values.latitude = leafletMouseEvent.latlng.lat;
      values.longitude = leafletMouseEvent.latlng.lng;
    }
  };
  React.useEffect(() => {
    //If we click on the map, create a new pin at the click location.
    if (leafletMouseEvent) {
      if (!activeParcelDetail) {
        dispatch(
          storeParcelsAction([
            ...properties.filter(parcel => parcel?.id),
            {
              id: 0,
              latitude: leafletMouseEvent.latlng.lat,
              longitude: leafletMouseEvent.latlng.lng,
              propertyTypeId: 0,
            },
          ]),
        );
      }
    }
  }, [leafletMouseEvent]);

  React.useEffect(() => {
    if (addParcelRequest?.status === 201 || updateParcelRequest?.status === 200) {
      dispatch(clear(actionTypes.ADD_PARCEL));
      dispatch(clear(actionTypes.UPDATE_PARCEL));
      history.push('/mapview');
    }
  }, [addParcelRequest, updateParcelRequest]);
  return (
    <Row className="submitProperty">
      <Col md={7} className="form">
        <ParcelDetailForm
          agencyId={keycloak.agencyId}
          updateLatLng={updateLatLng}
          parcelId={props?.match?.params?.id}
          disabled={!!parsed?.disabled}
        />
      </Col>
      <Col md={5} className="sideMap" title="click on map to add a pin">
        <MapView
          disableMapFilterBar={true}
          disabled={!!props?.match?.params?.id}
          onMarkerClick={() => {}}
          onMarkerPopupClosed={() => {}}
        />
      </Col>
    </Row>
  );
};

export default SubmitProperty;
