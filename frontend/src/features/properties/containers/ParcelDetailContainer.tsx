import * as React from 'react';
import ParcelDetailFormContainer from 'features/properties/containers/ParcelDetailFormContainer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LeafletMouseEvent } from 'leaflet';
import { FormikValues } from 'formik';
import { IParcel, IProperty } from 'actions/parcelsActions';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import ParcelDetailForm from 'features/properties/components/forms/ParcelDetailForm';
import { Claims } from 'constants/claims';
import ParcelFormControls from 'features/properties/components/ParcelFormControls';
import { deleteParcel } from 'actionCreators/parcelsActionCreator';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import { RootState } from 'reducers/rootReducer';
import { isMouseEventRecent } from 'utils';
import GenericModal from 'components/common/GenericModal';
import useGeocoder from '../hooks/useGeocoder';
import useParcelLayerData from '../hooks/useParcelLayerData';
import {
  useLayerQuery,
  PARCELS_LAYER_URL,
  handleParcelDataLayerResponse,
} from 'components/maps/leaflet/LayerPopup';

interface IParcelDetailContainerProps {
  parcelDetail: IParcel | null;
  persistCallback: (data: IParcel) => void;
  onDelete: () => void;
  properties: IProperty[];
  disabled?: boolean;
  loadDraft?: boolean;
  defaultTab?: ParcelDetailTabs;
  movingPinNameSpace?: string;
}
export enum ParcelDetailTabs {
  parcel = 'parcel',
  buildings = 'buildings',
}

/**
 * ParcelDetailContainer manages top level state for parcel detail components.
 * @param props
 */
const ParcelDetailContainer: React.FunctionComponent<IParcelDetailContainerProps> = props => {
  const [currentTab, setCurrentTab] = useState(props.defaultTab ?? ParcelDetailTabs.parcel);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [movingPinNameSpace, setMovingPinNameSpace] = useState<string | undefined>(
    props.movingPinNameSpace,
  );
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent?.mapClickEvent,
  );
  const [editing, setEditing] = useState(false);
  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const formikRef = React.useRef<FormikValues>();
  const { handleGeocoderChanges, pidSelection, setPidSelection } = useGeocoder({ formikRef });
  const {
    showOverwriteDialog,
    setShowOverwriteDialog,
    setParcelFieldsFromLayerData,
  } = useParcelLayerData({
    formikRef,
    parcelId: props.parcelDetail?.id,
  });
  const parcelsService = useLayerQuery(PARCELS_LAYER_URL);

  const handlePidChange = (pid: string) => {
    const formattedPid = pid.replace(/-/g, '');
    const response = parcelsService.findByPid(formattedPid);
    handleParcelDataLayerResponse(response, dispatch);
  };
  const handlePinChange = (pin: string) => {
    const response = parcelsService.findByPin(pin);
    handleParcelDataLayerResponse(response, dispatch);
  };

  React.useEffect(() => {
    if (movingPinNameSpace !== undefined) {
      document.body.className =
        currentTab === ParcelDetailTabs.parcel ? 'parcel-cursor' : 'building-cursor';
    }
    return () => {
      //make sure to reset the cursor when this component is disposed.
      document.body.className = '';
    };
  }, [currentTab, movingPinNameSpace]);

  //Add a pin to the map where the user has clicked.
  useDeepCompareEffect(() => {
    //If we click on the map, create a new pin at the click location.
    if (
      movingPinNameSpace !== undefined &&
      !!formikRef?.current &&
      isMouseEventRecent(leafletMouseEvent?.originalEvent)
    ) {
      const nameSpace = (movingPinNameSpace?.length ?? 0) > 0 ? `${movingPinNameSpace}.` : '';
      formikRef.current.setFieldValue(`${nameSpace}latitude`, leafletMouseEvent?.latlng.lat || 0);
      formikRef.current.setFieldValue(`${nameSpace}longitude`, leafletMouseEvent?.latlng.lng || 0);
      setMovingPinNameSpace(undefined);
    }
  }, [dispatch, leafletMouseEvent, props.parcelDetail]);

  const isAdmin = keycloak.hasClaim(Claims.ADMIN_PROPERTIES);
  let allowEdit =
    isAdmin || !props.parcelDetail || keycloak.hasAgency(props.parcelDetail?.agencyId as number);

  return (
    <ParcelDetailFormContainer
      formikRef={formikRef}
      parcelDetail={props.parcelDetail}
      agencyId={keycloak.agencyId}
      persistCallback={props.persistCallback}
    >
      <ParcelFormControls
        keycloak={keycloak}
        onDelete={(parcel: IParcel) => {
          (dispatch(deleteParcel(parcel)) as any).then(() => {
            props.onDelete();
          });
        }}
        persistCallback={props.persistCallback}
        setShowDeleteDialog={setShowDeleteDialog}
        showDeleteDialog={showDeleteDialog}
        disabled={props.disabled}
        loadDraft={props.loadDraft}
        properties={props.properties}
        currentTab={currentTab}
        setEditing={setEditing}
        editing={editing}
      />
      <GenericModal
        display={showOverwriteDialog}
        setDisplay={setShowOverwriteDialog}
        message="Click Continue if you would like to override the PID/PIN, Location, Lot Size and Lat/Lng with values obtained from the BC Data Warehouse for this property."
        okButtonText="Continue"
        cancelButtonText="Cancel"
        handleOk={() => setParcelFieldsFromLayerData()}
      />
      <ParcelDetailForm
        setMovingPinNameSpace={setMovingPinNameSpace}
        formikRef={formikRef}
        disabled={(props.disabled && !editing) ?? false}
        pidSelection={pidSelection}
        setPidSelection={setPidSelection}
        handleGeocoderChanges={handleGeocoderChanges}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        allowEdit={allowEdit}
        isAdmin={isAdmin}
        handlePidChange={handlePidChange}
        handlePinChange={handlePinChange}
      />
    </ParcelDetailFormContainer>
  );
};

export default ParcelDetailContainer;
