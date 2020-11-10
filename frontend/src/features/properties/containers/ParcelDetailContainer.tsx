import * as React from 'react';
import ParcelDetailFormContainer from 'features/properties/containers/ParcelDetailFormContainer';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LeafletMouseEvent } from 'leaflet';
import { FormikValues } from 'formik';
import { IParcel, IProperty } from 'actions/parcelsActions';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import ParcelDetailForm from 'features/properties/components/forms/ParcelDetailForm';
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
  movingPinNameSpace?: string;
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
  const [movingPinNameSpace, setMovingPinNameSpace] = useState<string | undefined>(
    props.movingPinNameSpace,
  );
  const [editing, setEditing] = useState(false);

  const keycloak = useKeycloakWrapper();
  const dispatch = useDispatch();
  const formikRef = React.useRef<FormikValues>();

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
      !!props.mapClickMouseEvent &&
      ((props.mapClickMouseEvent.originalEvent.timeStamp >=
        (document?.timeline?.currentTime ?? 0) - 500) as boolean)
    ) {
      const nameSpace = (movingPinNameSpace?.length ?? 0) > 0 ? `${movingPinNameSpace}.` : '';
      formikRef.current.setFieldValue(`${nameSpace}latitude`, props.mapClickMouseEvent.latlng.lat);
      formikRef.current.setFieldValue(`${nameSpace}longitude`, props.mapClickMouseEvent.latlng.lng);
      setMovingPinNameSpace(undefined);
    }
  }, [dispatch, props.mapClickMouseEvent, props.parcelDetail]);

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
      <ParcelDetailForm
        setMovingPinNameSpace={setMovingPinNameSpace}
        formikRef={formikRef}
        disabled={(props.disabled && !editing) ?? false}
        setPidSelection={setPidSelection}
        pidSelection={pidSelection}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        allowEdit={allowEdit}
        isAdmin={isAdmin}
      />
    </ParcelDetailFormContainer>
  );
};

export default ParcelDetailContainer;
