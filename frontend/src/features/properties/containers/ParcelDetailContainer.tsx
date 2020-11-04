import * as React from 'react';
import ParcelDetailForm from 'features/properties/containers/ParcelDetailFormContainer';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LeafletMouseEvent } from 'leaflet';
import { FormikValues } from 'formik';
import { IParcel, storeParcelAction, IProperty } from 'actions/parcelsActions';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import ParcelDetailFormLayout from 'features/properties/components/forms/ParcelDetailForm';
import { Claims } from 'constants/claims';
import ParcelFormControls from 'features/properties/components/ParcelFormControls';
import { deleteParcel } from 'actionCreators/parcelsActionCreator';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

interface IParcelDetailContainerProps {
  parcelDetail: IParcel | null;
  persistCallback: (data: IParcel) => void;
  onDelete: () => void;
  properties: IProperty[];
  disabled?: boolean;
  loadDraft?: boolean;
  mapClickMouseEvent?: LeafletMouseEvent | null;
  defaultTab?: ParcelDetailTabs;
}
export enum ParcelDetailTabs {
  parcel = 'parcel',
  buildings = 'buildings',
}
export interface IPidSelection {
  showPopup: boolean;
  geoPID: string;
}

/**
 * ParcelDetailContainer manages top level state for parcel detail components.
 * @param props
 */
const ParcelDetailContainer: React.FunctionComponent<IParcelDetailContainerProps> = props => {
  const [currentTab, setCurrentTab] = useState(props.defaultTab ?? ParcelDetailTabs.parcel);
  const [pidSelection, setPidSelection] = useState<IPidSelection>({ showPopup: false, geoPID: '' });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pin, setPin] = useState<IProperty | undefined>(undefined);

  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const formikRef = React.useRef<FormikValues>();

  //Add a pin to the map where the user has clicked.
  useDeepCompareEffect(() => {
    //If we click on the map, create a new pin at the click location.
    if (
      !!formikRef?.current &&
      !!props.mapClickMouseEvent &&
      ((props.mapClickMouseEvent.originalEvent.timeStamp >=
        (document?.timeline?.currentTime ?? 0) - 500) as boolean)
    ) {
      setPin({
        id: Number(props.parcelDetail?.id || 0),
        latitude: props.mapClickMouseEvent.latlng.lat,
        longitude: props.mapClickMouseEvent.latlng.lng,
        propertyTypeId: 0,
      });
      formikRef.current.setFieldValue('latitude', props.mapClickMouseEvent.latlng.lat);
      formikRef.current.setFieldValue('longitude', props.mapClickMouseEvent.latlng.lng);
    }
    if (pin) {
      dispatch(storeParcelAction(pin));
    }
    if (props.parcelDetail?.id && pin?.id !== undefined && pin?.id !== props.parcelDetail?.id) {
      setPin(undefined);
    }
  }, [dispatch, props.mapClickMouseEvent, pin, props.parcelDetail, props.properties]);

  const isAdmin = keycloak.hasClaim(Claims.ADMIN_PROPERTIES);
  let allowEdit =
    isAdmin || !props.parcelDetail || keycloak.hasAgency(props.parcelDetail?.agencyId as number);

  return (
    <ParcelDetailForm
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
      />
      <ParcelDetailFormLayout
        formikRef={formikRef}
        disabled={props.disabled ?? false}
        setPidSelection={setPidSelection}
        pidSelection={pidSelection}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        allowEdit={allowEdit}
        isAdmin={isAdmin}
      />
    </ParcelDetailForm>
  );
};

export default ParcelDetailContainer;
