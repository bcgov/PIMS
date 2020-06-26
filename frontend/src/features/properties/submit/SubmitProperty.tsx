import './SubmitProperty.scss';

import React, { useState } from 'react';
import { Row, Col, Spinner, Button, Container, Modal, Form } from 'react-bootstrap';
import ParcelDetailForm from '../components/forms/ParcelDetailForm';
import MapView from '../map/MapView';
import {
  storeParcelDetail,
  IPropertyDetail,
  IParcel,
  storeParcelAction,
} from 'actions/parcelsActions';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { LeafletMouseEvent } from 'leaflet';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { fetchParcelDetail, deleteParcel } from 'actionCreators/parcelsActionCreator';
import * as actionTypes from 'constants/actionTypes';
import { IGenericNetworkAction } from 'actions/genericActions';
import { clearClickLatLng } from 'reducers/LeafletMouseSlice';
import { useHistory } from 'react-router-dom';
import GenericModal from 'components/common/GenericModal';
import {
  isStorageInUse,
  PARCEL_STORAGE_NAME,
  clearStorage,
  PIN_MOVEMENT_CONFIRM,
} from 'utils/storageUtils';
import { Claims } from 'constants/claims';
import { ReactComponent as CloseSquare } from 'assets/images/close-square.svg';
import moment from 'moment';

/** Form mode */
enum Mode {
  View,
  Create,
  Update,
}

const SubmitProperty = (props: any) => {
  const keycloak = useKeycloakWrapper();
  const history = useHistory();
  const dispatch = useDispatch();

  const [showPinMovementConfirm, setShowPinMovementConfirm] = React.useState(false);
  const query = props?.location?.search ?? {};
  const parcelId = props?.match?.params?.id;
  const parsedQuery = queryString.parse(query);
  const [formDisabled, setFormDisabled] = useState(!!parsedQuery.disabled);
  const loadDraft = parsedQuery.loadDraft;

  const mode = formDisabled ? Mode.View : parcelId ? Mode.Update : Mode.Create;
  const [readonly, setReadonly] = useState(true);
  const formTitle = mode === Mode.Create ? 'Submit a Property' : 'Property Detail';

  const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  React.useEffect(() => {
    setReadonly(
      !!activePropertyDetail?.parcelDetail?.projectNumber &&
        !keycloak.hasClaim(Claims.ADMIN_PROPERTIES),
    );
  }, [keycloak, activePropertyDetail]);

  if (
    cachedParcelDetail?.agencyId &&
    !formDisabled &&
    !keycloak.hasAgency(cachedParcelDetail?.agencyId) &&
    !keycloak.hasClaim(Claims.ADMIN_PROPERTIES)
  ) {
    setFormDisabled(true); //if the user doesn't belong to this properties agency, display a read only view.
  }
  if (
    parsedQuery.disabled === undefined &&
    formDisabled === true &&
    cachedParcelDetail?.agencyId &&
    keycloak.hasAgency(cachedParcelDetail?.agencyId)
  ) {
    setFormDisabled(false);
  }

  if (!keycloak.agencyId && !formDisabled) {
    throw Error('You must belong to an agency to submit properties');
  } else if (!keycloak.obj?.subject) {
    throw Error('Keycloak subject missing');
  } else if (parcelDetailRequest?.error) {
    throw Error('Error loading property');
  }
  //Load and cache the parcel corresponding to the parcelId.
  React.useEffect(() => {
    if (!showDeleteDialog) {
      if (
        activePropertyDetail?.propertyTypeId === 1 ||
        (!cachedParcelDetail && parcelId && !activePropertyDetail?.parcelDetail)
      ) {
        //if we don't have required parcel details loaded, make a request.
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
    }
  }, [dispatch, activePropertyDetail, parcelId, cachedParcelDetail, showDeleteDialog]);
  //Add a pin to the map where the user has clicked.
  React.useEffect(() => {
    //If we click on the map, create a new pin at the click location.
    if (leafletMouseEvent) {
      dispatch(
        storeParcelAction({
          id: Number(parcelId || 0),
          latitude: leafletMouseEvent.latlng.lat,
          longitude: leafletMouseEvent.latlng.lng,
          propertyTypeId: activePropertyDetail?.propertyTypeId || 0,
        }),
      );

      const timeStamp = localStorage.getItem(PIN_MOVEMENT_CONFIRM);
      const diff = moment().diff(moment(timeStamp), 'minute');
      const durationPassed = !timeStamp || diff >= 30; // check time elapse popup disabled is 30 minutes
      const showPinMoveConfirm = !!parcelId && durationPassed;
      setShowPinMovementConfirm(showPinMoveConfirm);
    }
  }, [leafletMouseEvent, dispatch, parcelId, activePropertyDetail]);

  return (
    <Row className="submitProperty" noGutters>
      <Col md={7} className="form">
        <Row className="title-bar" style={{ textAlign: 'left' }}>
          <Col>
            <h2>{formTitle}</h2>
          </Col>
          <Col style={{ textAlign: 'right' }}>
            <span className="propertyButtons">
              <DeleteButton
                {...{
                  keycloak,
                  cachedParcelDetail,
                  dispatch,
                  setShowDeleteDialog,
                  disabled: readonly,
                }}
              />
              <EditButton
                {...{
                  keycloak,
                  formDisabled,
                  setFormDisabled,
                  parcelId,
                  cachedParcelDetail,
                  readonly,
                }}
              />
              <CloseButton {...{ history, setShowSaveDraftDialog, formDisabled }} />
            </span>
          </Col>
        </Row>
        {parcelDetailRequest?.isFetching || (parcelId && !cachedParcelDetail) ? (
          <Spinner animation="border"></Spinner>
        ) : (
          <Row noGutters>
            <Col>
              <ParcelDetailForm
                agencyId={keycloak.agencyId}
                clickLatLng={leafletMouseEvent?.latlng}
                parcelDetail={parcelId ? (cachedParcelDetail as IParcel) : null}
                disabled={formDisabled || readonly}
                secret={keycloak.obj.subject}
                loadDraft={!!loadDraft}
              />
            </Col>
          </Row>
        )}
      </Col>
      <Col md={5} className="sideMap" title={parcelId ? '' : 'click on map to add a pin'}>
        {parcelDetailRequest?.isFetching || (parcelId && !cachedParcelDetail) ? (
          <Spinner animation="border"></Spinner>
        ) : (
          <MapView
            disableMapFilterBar={true}
            disabled={formDisabled || readonly}
            showParcelBoundaries={false}
            onMarkerClick={() => {}}
            onMarkerPopupClosed={() => {}}
          />
        )}
      </Col>
      <UnsavedDraftModal {...{ showSaveDraftDialog, setShowSaveDraftDialog, history }} />
      <DeleteModal
        {...{ showDeleteDialog, setShowDeleteDialog, history, dispatch, cachedParcelDetail }}
      />
      <PinMovementModal
        show={showPinMovementConfirm}
        close={() => setShowPinMovementConfirm(false)}
      />
    </Row>
  );
};

const UnsavedDraftModal = ({ showSaveDraftDialog, setShowSaveDraftDialog, history }: any) => (
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
      history.push('/mapview');
    }}
  />
);

const DeleteModal = ({
  showDeleteDialog,
  setShowDeleteDialog,
  history,
  dispatch,
  cachedParcelDetail,
}: any) => (
  <GenericModal
    message="Are you sure you want to permanently delete the property?"
    cancelButtonText="Cancel"
    okButtonText="Delete"
    display={showDeleteDialog}
    handleOk={() => {
      dispatch(deleteParcel(cachedParcelDetail)).then(() => {
        dispatch(storeParcelDetail(null));
        history.push('/mapview');
      });
      // todo: better error handling, currently this will log to global error handler.
    }}
    handleCancel={() => {
      setShowDeleteDialog(false);
    }}
  />
);

const CloseButton = ({ formDisabled, setShowSaveDraftDialog, history }: any) => (
  <Button
    className="close"
    onClick={() => {
      if (!formDisabled && isStorageInUse(PARCEL_STORAGE_NAME)) {
        setShowSaveDraftDialog(true);
      } else {
        history.push('/mapview');
      }
    }}
  >
    <CloseSquare title="close" />
  </Button>
);

const EditButton = ({
  keycloak,
  cachedParcelDetail,
  parcelId,
  formDisabled,
  readonly,
  setFormDisabled,
}: any) => {
  return keycloak.hasAgency(cachedParcelDetail?.agencyId) ||
    keycloak.hasClaim(Claims.ADMIN_PROPERTIES) ? (
    <Button
      disabled={!formDisabled || !parcelId || readonly}
      onClick={() => setFormDisabled(false)}
    >
      Edit
    </Button>
  ) : null;
};

const DeleteButton = ({
  cachedParcelDetail,
  keycloak,
  dispatch,
  setShowDeleteDialog,
  disabled,
}: any) => {
  return (keycloak.hasAgency(cachedParcelDetail?.agencyId) ||
    keycloak.hasClaim(Claims.ADMIN_PROPERTIES)) &&
    keycloak.hasClaim(Claims.PROPERTY_DELETE) &&
    cachedParcelDetail ? (
    <Button onClick={() => setShowDeleteDialog(true)} disabled={disabled}>
      Delete
    </Button>
  ) : null;
};

const PinMovementModal = ({ show, close }: { show: boolean; close: () => void }) => {
  const dontShow = () => {
    localStorage.setItem(PIN_MOVEMENT_CONFIRM, moment().format());
  };

  return (
    <Container>
      <Modal show={show} onHide={close}>
        <Modal.Body style={{ maxHeight: '500px' }}>
          Moving the pin will change the <b>Parcel</b> latitude and longitude values. You may need
          to <b>manually</b> update the <b>Building</b> latitude and longitude values.
        </Modal.Body>

        <Modal.Footer>
          <Form.Check onChange={dontShow} type="checkbox" label="Hide temporarily" />
          <Button size="sm" variant="warning" onClick={close}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SubmitProperty;
