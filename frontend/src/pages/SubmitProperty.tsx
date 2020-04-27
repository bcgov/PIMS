import './SubmitProperty.scss';

import React, { useState } from 'react';
import { Row, Col, Spinner, Button } from 'react-bootstrap';
import ParcelDetailForm from 'forms/ParcelDetailForm';
import MapView from './MapView';
import {
  IParcelDetail,
  storeParcelsAction,
  IProperty,
  storeParcelDetail,
} from 'actions/parcelsActions';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { LeafletMouseEvent } from 'leaflet';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import * as actionTypes from 'constants/actionTypes';
import { IGenericNetworkAction } from 'actions/genericActions';
import { clearClickLatLng } from 'reducers/LeafletMouseSlice';
import { useHistory } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const SubmitProperty = (props: any) => {
  const query = props?.location?.search ?? {};
  const parcelId = props?.match?.params?.id;
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  const [formDisabled, setFormDisabled] = useState(!!queryString.parse(query).disabled);
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent.mapClickEvent,
  );
  const parcelDetailRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_PARCEL_DETAIL] as IGenericNetworkAction,
  );
  const activeParcelDetail = useSelector<RootState, IParcelDetail>(
    state => state.parcel.parcelDetail as IParcelDetail,
  );
  const [cachedParcelDetail, setCachedParcelDetail] = useState(activeParcelDetail?.parcelDetail);

  const properties = useSelector<RootState, IProperty[]>(state => state.parcel.parcels);
  const dispatch = useDispatch();
  if (
    cachedParcelDetail?.agencyId &&
    !formDisabled &&
    !keycloak.hasAgency(cachedParcelDetail?.agencyId)
  ) {
    setFormDisabled(true); //if the user doesn't belong to this properties agency, display a read only view.
  }
  if (!keycloak.agencyId && !formDisabled) {
    throw Error('You must belong to an agency to submit properties');
  } else if (!keycloak.obj?.subject) {
    throw Error('Keycloak subject missing');
  }
  //Load and cache the parcel corresponding to the parcelId.
  React.useEffect(() => {
    if (!cachedParcelDetail && parcelId && !activeParcelDetail?.parcelDetail) {
      //if we are displaying an existing property but have no data, load the detail.
      dispatch(fetchParcelDetail({ id: parseInt(parcelId) }));
    } else if (!cachedParcelDetail && parcelId && activeParcelDetail?.parcelDetail) {
      //if we are displaying an existing property and have the data, save it to state.
      setCachedParcelDetail(activeParcelDetail?.parcelDetail);
    } else if (cachedParcelDetail && parcelId && !activeParcelDetail?.parcelDetail) {
      //if we are displaying an existing property and have no detail data but do have cached data
      //save the cached data to the store.
      dispatch(storeParcelDetail(cachedParcelDetail));
    }
    dispatch(clearClickLatLng());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeParcelDetail?.parcelDetail]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletMouseEvent]);
  return (
    <Row className="submitProperty" noGutters>
      <Col md={7} className="form">
        <Row className="title-bar" style={{ textAlign: 'left' }}>
          <Col>
            <h2>Submit a Property</h2>
          </Col>
          <Col style={{ textAlign: 'right' }}>
            {keycloak.hasAgency(cachedParcelDetail?.agencyId) && (
              <Button
                disabled={!formDisabled || !parcelId}
                style={{ width: '144px' }}
                variant="light"
                onClick={() => setFormDisabled(false)}
              >
                Edit
              </Button>
            )}
            <Button style={{ marginLeft: '7px' }} variant="dark" onClick={() => history.goBack()}>
              <FaTimes size={20} />
            </Button>
          </Col>
        </Row>
        <Row noGutters>
          <Col>
            {parcelDetailRequest?.isFetching || (parcelId && !cachedParcelDetail) ? (
              <Spinner animation="border"></Spinner>
            ) : (
              <ParcelDetailForm
                agencyId={keycloak.agencyId}
                clickLatLng={leafletMouseEvent?.latlng}
                parcelDetail={parcelId ? cachedParcelDetail : null}
                disabled={formDisabled}
                secret={keycloak.obj.subject}
              />
            )}
          </Col>
        </Row>
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
