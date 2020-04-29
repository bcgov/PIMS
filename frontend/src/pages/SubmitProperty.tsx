import './SubmitProperty.scss';

import React, { useState } from 'react';
import { Row, Col, Spinner, Button } from 'react-bootstrap';
import ParcelDetailForm from 'forms/ParcelDetailForm';
import MapView from './MapView';
import {
  storeParcelsAction,
  IProperty,
  storeParcelDetail,
  IPropertyDetail,
  IParcel,
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
import GenericModal from 'components/common/GenericModal';
import { isStorageInUse, PARCEL_STORAGE_NAME, clearStorage } from 'utils/storageUtils';

const SubmitProperty = (props: any) => {
  const query = props?.location?.search ?? {};
  const parcelId = props?.match?.params?.id;
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  const parsedQuery = queryString.parse(query);
  const [formDisabled, setFormDisabled] = useState(!!parsedQuery.disabled);
  const loadDraft = parsedQuery.loadDraft;
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent.mapClickEvent,
  );
  const parcelDetailRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_PARCEL_DETAIL] as IGenericNetworkAction,
  );
  let activePropertyDetail = useSelector<RootState, IPropertyDetail>(
    state => state.parcel.parcelDetail as IPropertyDetail,
  );

  const [cachedParcelDetail, setCachedParcelDetail] = useState(
    activePropertyDetail?.propertyTypeId === 0 ? activePropertyDetail?.parcelDetail : null,
  );
  const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);

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
    if (activePropertyDetail?.propertyTypeId === 1) {
      dispatch(fetchParcelDetail({ id: parseInt(parcelId) }));
    } else if (!cachedParcelDetail && parcelId && !activePropertyDetail?.parcelDetail) {
      //if we are displaying an existing property but have no data, load the detail.
      dispatch(fetchParcelDetail({ id: parseInt(parcelId) }));
    } else if (!cachedParcelDetail && parcelId && activePropertyDetail?.parcelDetail) {
      //if we are displaying an existing property and have the data, save it to state.
      setCachedParcelDetail(activePropertyDetail?.parcelDetail);
    } else if (cachedParcelDetail && parcelId && !activePropertyDetail?.parcelDetail) {
      //if we are displaying an existing property and have no detail data but do have cached data
      //save the cached data to the store.
      dispatch(storeParcelDetail(cachedParcelDetail as IParcel));
    }
    dispatch(clearClickLatLng());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePropertyDetail?.parcelDetail]);
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
            <Button
              style={{ marginLeft: '7px' }}
              variant="dark"
              onClick={() => {
                if (!formDisabled && isStorageInUse(PARCEL_STORAGE_NAME)) {
                  setShowSaveDraftDialog(true);
                } else {
                  history.goBack();
                }
              }}
            >
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
                parcelDetail={parcelId ? (cachedParcelDetail as IParcel) : null}
                disabled={formDisabled}
                secret={keycloak.obj.subject}
                loadDraft={!!loadDraft}
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
      <GenericModal
        title="Unsaved Draft"
        message="You have not saved your changes. Are you sure you want to leave this page?"
        cancelButtonText="Discard"
        okButtonText="Continue Editing"
        display={showSaveDraftDialog}
        handleOk={() => {
          setShowSaveDraftDialog(false);
        }}
        handleCancel={() => {
          clearStorage(PARCEL_STORAGE_NAME);
          history.goBack();
        }}
      />
    </Row>
  );
};

export default SubmitProperty;
