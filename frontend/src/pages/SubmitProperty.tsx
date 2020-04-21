import './SubmitProperty.scss';

import * as React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import ParcelDetailForm from 'forms/ParcelDetailForm';
import MapView from './MapView';
import { IParcelDetail, storeParcelsAction, IProperty } from 'actions/parcelsActions';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { LeafletMouseEvent } from 'leaflet';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import * as actionTypes from 'constants/actionTypes';
import { IGenericNetworkAction } from 'actions/genericActions';
import { clearClickLatLng } from 'reducers/LeafletMouseSlice';

const SubmitProperty = (props: any) => {
  const query = props?.location?.search ?? {};
  const parcelId = props?.match?.params?.id;
  const parsed = queryString.parse(query);
  const keycloak = useKeycloakWrapper();
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent.mapClickEvent,
  );
  const parcelDetailRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_PARCEL_DETAIL] as IGenericNetworkAction,
  );
  const activeParcelDetail = useSelector<RootState, IParcelDetail>(
    state => state.parcel.parcelDetail as IParcelDetail,
  );
  const properties = useSelector<RootState, IProperty[]>(state => state.parcel.parcels);
  const dispatch = useDispatch();

  if (
    activeParcelDetail?.parcelDetail?.agencyId &&
    !keycloak.hasAgency(activeParcelDetail?.parcelDetail?.agencyId)
  ) {
    parsed.disabled = 'true'; //if the user doesn't belong to this properties agency, display a read only view.
  }
  if (!keycloak.agencyId && !parsed.disabled) {
    throw Error('You must belong to an agency to submit properties');
  } else if (!keycloak.obj?.subject) {
    throw Error('Keycloak subject missing');
  }
  //one time page load actions.
  React.useEffect(() => {
    if (!activeParcelDetail?.parcelDetail && parcelId) {
      dispatch(fetchParcelDetail({ id: parseInt(parcelId) }));
    }
    dispatch(clearClickLatLng());
  }, []);
  //Add a pin to the map where the user has clicked.
  React.useEffect(() => {
    //If we click on the map, create a new pin at the click location.
    if (leafletMouseEvent) {
      if (!parcelId) {
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
  return (
    <Row className="submitProperty">
      <Col md={7} className="form">
        {parcelDetailRequest?.isFetching ? (
          <Spinner animation="border"></Spinner>
        ) : (
          <ParcelDetailForm
            agencyId={keycloak.agencyId}
            clickLatLng={leafletMouseEvent?.latlng}
            parcelDetail={parcelId ? activeParcelDetail?.parcelDetail : null}
            disabled={!!parsed?.disabled}
            secret={keycloak.obj.subject}
          />
        )}
      </Col>
      <Col md={5} className="sideMap" title={parcelId ? '' : 'click on map to add a pin'}>
        <MapView
          disableMapFilterBar={true}
          disabled={!!parcelId}
          showParcelBoundaries={false}
          onMarkerClick={() => {}}
          onMarkerPopupClosed={() => {}}
        />
      </Col>
    </Row>
  );
};

export default SubmitProperty;
