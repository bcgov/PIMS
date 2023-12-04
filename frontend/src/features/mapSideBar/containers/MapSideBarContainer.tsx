import variables from '_variables.module.scss';
import { IBuilding, IParcel, IProperty } from 'actions/parcelsActions';
import GenericModal, { ModalSize } from 'components/common/GenericModal';
import { BuildingSvg, LandSvg, SubdivisionSvg } from 'components/common/Icons';
import { fireMapRefreshEvent } from 'components/maps/hooks/useMapRefreshEvent';
import {
  handleParcelDataLayerResponse,
  PARCELS_PUBLIC_LAYER_URL,
  useLayerQuery,
} from 'components/maps/leaflet/LayerPopup';
import { Claims, EvaluationKeys, FiscalKeys, PropertyTypes } from 'constants/index';
import { getMergedFinancials } from 'features/properties/components/forms/subforms/EvaluationForm';
import useGeocoder from 'features/properties/hooks/useGeocoder';
import { FormikValues, getIn, setIn } from 'formik';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { LatLng } from 'leaflet';
import _, { cloneDeep, noop } from 'lodash';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store';
import { deleteBuilding } from 'store/slices/hooks/buildingActionCreator';
import { deleteParcel, fetchParcelsDetail } from 'store/slices/hooks/parcelsActionCreator';
import { storePropertyDetail } from 'store/slices/parcelSlice';
import styled from 'styled-components';
import { isMouseEventRecent } from 'utils';
import { withNameSpace } from 'utils/formUtils';

import MapSideBarLayout from '../components/MapSideBarLayout';
import { useBuildingApi } from '../hooks/useBuildingApi';
import useParamSideBar, { SidebarContextType } from '../hooks/useQueryParamSideBar';
import useSideBarBuildingLoader from '../hooks/useSideBarBuildingLoader';
import useSideBarBuildingWithParcelLoader from '../hooks/useSideBarBuildingWithParcelLoader';
import useSideBarParcelLoader from '../hooks/useSideBarParcelLoader';
import { BuildingForm, LandForm, SubmitPropertySelector } from '../SidebarContents';
import AssociatedLandForm from '../SidebarContents/AssociatedLandForm';
import { valuesToApiFormat, ViewOnlyBuildingForm } from '../SidebarContents/BuildingForm';
import { getInitialValues, ISearchFields, ViewOnlyLandForm } from '../SidebarContents/LandForm';

interface IMapSideBarContainerProps {
  properties: IProperty[];
  movingPinNameSpaceProp?: string;
}

const FloatCheck = styled(FaCheckCircle)`
  margin: 1em;
  color: ${variables.completedColor};
  float: left;
`;

const SuccessText = styled.p`
  color: ${variables.completedColor};
  margin-bottom: 0;
  font-size: 24px;
`;

const BoldText = styled.p`
  font-size: 24px;
  font-weight: 700;
`;

const EditButton = styled(FaEdit)`
  margin-right: 10px;
  margin-top: 5px;
  cursor: pointer;
  color: ${variables.slideOutBlue};
  float: right;
`;

const DeleteButton = styled(FaTrash)`
  margin-right: 10px;
  margin-top: 5px;
  cursor: pointer;
  color: #de350b;
  float: right;
`;

/**
 * container responsible for logic related to map sidebar display. Synchronizes the state of the parcel detail forms with the corresponding query parameters (push/pull).
 */
const MapSideBarContainer: FunctionComponent<IMapSideBarContainerProps> = ({
  movingPinNameSpaceProp,
}) => {
  // Hooks.
  const keycloak = useKeycloakWrapper();
  const dispatch = useAppDispatch();
  const { createBuilding, updateBuilding } = useBuildingApi();
  const parcelLayerService = useLayerQuery(PARCELS_PUBLIC_LAYER_URL);
  const formikRef = useRef<FormikValues>();

  // State of the sidebar based on query params.
  const {
    showSideBar,
    setShowSideBar,
    parcelId,
    buildingId,
    associatedParcelId,
    context,
    size,
    addBuilding,
    addBareLand,
    addAssociatedLand,
    addSubdivision,
    addContext,
    disabled,
    setDisabled,
  } = useParamSideBar(formikRef);

  // Parcel and building loaders.
  const { parcelDetail } = useSideBarParcelLoader({
    parcelId,
    setSideBarContext: addContext,
    showSideBar,
    disabled,
  });
  const { buildingDetail } = useSideBarBuildingLoader({
    buildingId,
    sideBarContext: context,
    setSideBarContext: addContext,
    showSideBar,
    disabled,
  });
  const { buildingWithParcelDetail } = useSideBarBuildingWithParcelLoader({
    associatedParcelId,
    setSideBarContext: addContext,
    showSideBar,
    disabled,
  });

  // State.
  const [movingPinNameSpace, setMovingPinNameSpace] = useState<string | undefined>(
    movingPinNameSpaceProp,
  );
  const leafletMouseEvent = useAppSelector((store) => store.leafletClickEvent?.mapClickEvent);
  const [buildingToAssociateLand, setBuildingToAssociateLand] = useState<IBuilding | undefined>();
  const [showAssociateLandModal, setShowAssociateLandModal] = useState(false);
  const [propertyType, setPropertyType] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showUpdatedModal, setShowUpdatedModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  /**
   * Populate the formik form using the passed parcel.
   * @param nameSpace the formik namespace that should be used to write any retrieved data.
   * @param matchingParcel the parcel to use to populate the formik form.
   */
  const formikParcelDataPopulateCallback = (
    matchingParcel: IParcel & ISearchFields,
    nameSpace?: string,
  ) => {
    if (!formikRef.current) return;
    const { resetForm, values } = formikRef.current;
    const currentPropertyTypeId = getIn(values, withNameSpace(nameSpace, 'propertyTypeId'));
    if (matchingParcel.propertyTypeId !== PropertyTypes.PARCEL) {
      toast.error('That address/pid is already in use within a subdivision.');
      return;
    }

    const result = { ...matchingParcel };

    result.propertyTypeId = currentPropertyTypeId;
    result.parcels = getIn(values, withNameSpace(nameSpace, 'parcels'));
    result.searchPid = getIn(values, withNameSpace(nameSpace, 'searchPid'));
    result.searchPin = getIn(values, withNameSpace(nameSpace, 'searchPin'));
    result.searchAddress = getIn(values, withNameSpace(nameSpace, 'searchAddress'));
    result.evaluations = getMergedFinancials(result.evaluations, Object.values(EvaluationKeys));
    result.fiscals = getMergedFinancials(matchingParcel.fiscals, Object.values(FiscalKeys));
    resetForm({
      values: setIn(values, nameSpace ?? '', { ...getInitialValues(), ...matchingParcel }),
    });
    toast.dark('Found matching parcel within PIMS. Form data will be pre-populated.', {
      autoClose: 7000,
    });
  };

  /**
   * Attempt to fetch the parcel within PIMS matching the passed pid or pin value. If that request fails, make another request to the parcel layer with the same data.
   * @param pidOrPin an object containing the pid and/or the pin
   * @param parcelLayerSearchCallback a callback that will be executed if there is not match within PIMS for the pidOrPin
   * @param nameSpace the formik namespace that should be used to write any retrieved data.
   */
  const fetchPimsOrLayerParcel = (
    pidOrPin: any,
    parcelLayerSearchCallback: () => void,
    nameSpace?: string,
    formikDataPopulateCallback: (
      matchingParcel: IParcel & ISearchFields,
      nameSpace?: string,
    ) => void = formikParcelDataPopulateCallback,
  ) => {
    return fetchParcelsDetail(pidOrPin)(dispatch).then((resp) => {
      const matchingParcel: (IParcel & ISearchFields) | undefined = resp?.data?.length
        ? _.first(
            _.filter(
              resp.data,
              (parcel: IParcel) => parcel.propertyTypeId === PropertyTypes.PARCEL,
            ),
          )
        : undefined;
      if (!!formikRef?.current?.values && !!matchingParcel?.id) {
        formikRef.current.setFieldValue('data', {
          ...formikRef?.current?.values?.data,
          name: matchingParcel.name,
          address: { ...matchingParcel.address, id: 0 },
          description: matchingParcel.description,
          landLegalDescription: matchingParcel.landLegalDescription,
          landArea: matchingParcel.landArea,
        });
        formikDataPopulateCallback(matchingParcel, nameSpace);
        return matchingParcel;
      } else {
        parcelLayerSearchCallback();
        return undefined;
      }
    });
  };
  const { handleGeocoderChanges } = useGeocoder({ formikRef, fetchPimsOrLayerParcel });

  /* Query pims for the given pid, set data within the form if match found.
   * Fallback to querying the parcel data layer.
   */
  const handlePidChange = (pid: string, nameSpace?: string) => {
    const parcelLayerSearchCallback = () => {
      const response = parcelLayerService.findByPid(pid);
      handleParcelDataLayerResponse(response, dispatch);
    };
    fetchPimsOrLayerParcel({ pid }, parcelLayerSearchCallback, nameSpace);
  };

  // Make a parcel layer request by pid and store the response.
  const handlePinChange = (pin: string, nameSpace?: string) => {
    const parcelLayerSearchCallback = () => {
      const response = parcelLayerService.findByPin(pin);
      handleParcelDataLayerResponse(response, dispatch);
    };
    fetchPimsOrLayerParcel({ pin }, parcelLayerSearchCallback, nameSpace);
  };

  /**
   * Find the parcel matching the passed pid.
   * @param pid the desired parcel PID
   * @param nameSpace The namespace of where the response should be stored.
   */
  const findMatchingPid = async (pid: string, nameSpace?: string): Promise<IParcel | undefined> => {
    return await fetchPimsOrLayerParcel({ pid }, noop, nameSpace, noop);
  };

  const droppedMarkerSearch = (nameSpace: string, latLng?: LatLng, isParcel?: boolean) => {
    if (!latLng) {
      return;
    }
    parcelLayerService.findOneWhereContains(latLng).then((resp) => {
      const properties = getIn(resp, 'features.0.properties');
      if (!properties?.PIN && !properties?.PID) {
        toast.warning('Unable to find any details for the clicked location.');
        return;
      }
      if (isParcel) {
        const query: any = { pin: properties?.PIN, pid: properties.PID };
        fetchParcelsDetail(query)(dispatch).then((resp: any) => {
          const matchingParcel: any = resp?.data?.length
            ? _.first(
                _.filter(
                  resp.data,
                  (parcel: IParcel) => parcel.propertyTypeId === PropertyTypes.PARCEL,
                ),
              )
            : undefined;
          if (!!nameSpace && !!formikRef?.current?.values && !!matchingParcel?.id && isParcel) {
            formikParcelDataPopulateCallback(matchingParcel, nameSpace);
          } else {
            parcelLayerSearch(properties, latLng);
          }
        });
      } else {
        parcelLayerSearch(properties, latLng);
      }
    });
  };

  const parcelLayerSearch = (properties: any, latLng?: LatLng) => {
    const response = properties.PID
      ? parcelLayerService.findByPid(properties.PID)
      : parcelLayerService.findByPin(properties.PIN);

    handleParcelDataLayerResponse(response, dispatch, latLng);
  };

  useEffect(() => {
    if (!showSideBar) document.body.className = '';
    if (movingPinNameSpace !== undefined)
      document.body.className = propertyType === 'building' ? 'building-cursor' : 'parcel-cursor';

    return () => {
      //make sure to reset the cursor when this component is disposed.
      document.body.className = '';
    };
  }, [propertyType, movingPinNameSpace, context, showSideBar]);

  // Add a pin to the map where the user has clicked.
  useDeepCompareEffect(() => {
    // If we click on the map, create a new pin at the click location.
    if (
      movingPinNameSpace !== undefined &&
      !!formikRef?.current &&
      isMouseEventRecent(leafletMouseEvent?.originalEvent) &&
      !disabled
    ) {
      const nameSpace = (movingPinNameSpace?.length ?? 0) > 0 ? `${movingPinNameSpace}` : 'data';
      formikRef.current.setFieldValue(`${nameSpace}.latitude`, leafletMouseEvent?.latlng.lat || 0);
      formikRef.current.setFieldValue(`${nameSpace}.longitude`, leafletMouseEvent?.latlng.lng || 0);

      const isParcel = [
        SidebarContextType.VIEW_BARE_LAND,
        SidebarContextType.UPDATE_DEVELOPED_LAND,
        SidebarContextType.VIEW_DEVELOPED_LAND,
        SidebarContextType.ADD_ASSOCIATED_LAND,
        SidebarContextType.ADD_BARE_LAND,
      ].includes(context);
      droppedMarkerSearch(nameSpace, leafletMouseEvent?.latlng, isParcel);
      setMovingPinNameSpace(undefined);
    }
  }, [dispatch, leafletMouseEvent, showSideBar]);

  /**
   * Only display the edit button if the user has the correct claim and the property
   * is owned by their agency.
   */
  const ConditionalEditButton = () => (
    <>
      {disabled && keycloak.canUserEditProperty(buildingDetail ?? parcelDetail) && (
        <EditButton data-testid="edit" onClick={() => setDisabled(false)} />
      )}
    </>
  );

  /**
   * Only display the delete button if the user has the correct claim and the property
   * is owned by their agency.
   */
  const ConditionalDeleteButton = () => (
    <>
      {keycloak.canUserDeleteProperty(buildingDetail ?? parcelDetail) && (
        <DeleteButton
          data-testid="delete"
          onClick={() => setShowDelete(true)}
          title="Delete Property"
        />
      )}
    </>
  );

  const getSidebarTitle = (): React.ReactNode => {
    switch (context) {
      case SidebarContextType.ADD_BUILDING:
        return (
          <>
            <BuildingSvg className="svg" /> Submit a Building (to inventory)
          </>
        );
      case SidebarContextType.ADD_BARE_LAND:
        return (
          <>
            <LandSvg className="svg" /> Submit Land (to inventory)
          </>
        );
      case SidebarContextType.ADD_SUBDIVISION_LAND:
        return (
          <>
            <SubdivisionSvg className="svg" /> Submit Subdivision (to inventory)
          </>
        );
      case SidebarContextType.VIEW_SUBDIVISION_LAND:
      case SidebarContextType.UPDATE_SUBDIVISION_LAND:
        return (
          <>
            <SubdivisionSvg className="svg" /> View/Update potential subdivision
            <ConditionalEditButton />
            <ConditionalDeleteButton />
          </>
        );
      case SidebarContextType.VIEW_BARE_LAND:
      case SidebarContextType.UPDATE_BARE_LAND:
        return (
          <>
            <LandSvg className="svg" /> View/Update land
            <ConditionalEditButton />
            <ConditionalDeleteButton />
          </>
        );
      case SidebarContextType.VIEW_DEVELOPED_LAND:
      case SidebarContextType.UPDATE_DEVELOPED_LAND:
        return (
          <>
            <LandSvg className="svg" /> View/Update developed land
            <ConditionalEditButton />
            <ConditionalDeleteButton />
          </>
        );
      case SidebarContextType.ADD_ASSOCIATED_LAND:
        return (
          <>
            <LandSvg className="svg" /> Add associated land
          </>
        );
      case SidebarContextType.VIEW_BUILDING:
      case SidebarContextType.UPDATE_BUILDING:
        return (
          <>
            <BuildingSvg className="svg" /> Building Details
            <ConditionalEditButton />
            <ConditionalDeleteButton />
          </>
        );
      default:
        return 'Submit a Property';
    }
  };

  const render = (): React.ReactNode => {
    switch (context) {
      case SidebarContextType.ADD_BUILDING:
      case SidebarContextType.UPDATE_BUILDING:
        if (propertyType !== 'building') {
          setPropertyType('building');
        }
        return buildingId === buildingDetail?.id ||
          (buildingId === 0 && associatedParcelId === buildingWithParcelDetail?.parcelId) ? (
          <BuildingForm
            formikRef={formikRef}
            setMovingPinNameSpace={setMovingPinNameSpace}
            nameSpace="data"
            setBuildingToAssociateLand={(building: IBuilding) => {
              setBuildingToAssociateLand(building);
              setShowAssociateLandModal(true);
            }}
            goToAssociatedLand={async () => {
              if (!!formikRef?.current) {
                const values = formikRef.current.values;
                const apiValues = valuesToApiFormat(cloneDeep(values));
                let response: IBuilding;
                try {
                  if (!apiValues.id) {
                    response = await createBuilding(apiValues)(dispatch);
                  } else {
                    response = await updateBuilding(apiValues)(dispatch);
                  }
                  formikRef.current.resetForm({ values: { data: response } });
                  setBuildingToAssociateLand(response);
                  fireMapRefreshEvent();
                  addAssociatedLand();
                } catch (err) {
                  toast.error(
                    'Failed to save building, ensure that building data is correct and try again.',
                  );
                }
              }
            }}
            isPropertyAdmin={keycloak.hasClaim(Claims.ADMIN_PROPERTIES)}
            initialValues={buildingDetail ?? buildingWithParcelDetail ?? ({} as any)}
          />
        ) : (
          <Spinner animation="border"></Spinner>
        );
      case SidebarContextType.VIEW_BUILDING:
        if (propertyType !== 'building') {
          setPropertyType('building');
        }
        return buildingId === buildingDetail?.id ? (
          <ViewOnlyBuildingForm
            formikRef={formikRef}
            initialValues={buildingDetail ?? ({} as any)}
          />
        ) : (
          <Spinner animation="border"></Spinner>
        );
      case SidebarContextType.ADD_SUBDIVISION_LAND:
        return (
          <LandForm
            setMovingPinNameSpace={setMovingPinNameSpace}
            formikRef={formikRef}
            handleGeocoderChanges={handleGeocoderChanges}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            findMatchingPid={findMatchingPid}
            isPropertyAdmin={keycloak.hasClaim(Claims.ADMIN_PROPERTIES)}
            setLandComplete={setShowCompleteModal}
            setLandUpdateComplete={setShowUpdatedModal}
            initialValues={
              parcelDetail ?? { ...getInitialValues(), propertyTypeId: PropertyTypes.SUBDIVISION }
            }
          />
        );
      case SidebarContextType.ADD_BARE_LAND:
      case SidebarContextType.UPDATE_DEVELOPED_LAND:
      case SidebarContextType.UPDATE_BARE_LAND:
      case SidebarContextType.UPDATE_SUBDIVISION_LAND:
        if (propertyType !== 'land') {
          setPropertyType('land');
        }
        return parcelId === parcelDetail?.id ? (
          <LandForm
            setMovingPinNameSpace={setMovingPinNameSpace}
            formikRef={formikRef}
            handleGeocoderChanges={handleGeocoderChanges}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            findMatchingPid={findMatchingPid}
            isPropertyAdmin={keycloak.hasClaim(Claims.ADMIN_PROPERTIES)}
            setLandComplete={setShowCompleteModal}
            setLandUpdateComplete={setShowUpdatedModal}
            initialValues={parcelDetail ?? ({} as any)}
          />
        ) : (
          <Spinner animation="border"></Spinner>
        );
      case SidebarContextType.VIEW_BARE_LAND:
      case SidebarContextType.VIEW_DEVELOPED_LAND:
      case SidebarContextType.VIEW_SUBDIVISION_LAND:
        if (propertyType !== 'land') {
          setPropertyType('land');
        }
        return parcelId === parcelDetail?.id ? (
          <ViewOnlyLandForm formikRef={formikRef} initialValues={parcelDetail ?? ({} as any)} />
        ) : (
          <Spinner animation="border"></Spinner>
        );
      case SidebarContextType.ADD_ASSOCIATED_LAND:
        if (propertyType !== 'land') {
          setPropertyType('land');
        } else if (!buildingToAssociateLand?.id) {
          //if the associated building doesn't have an id, we can't load it.
          setShowSideBar(true, SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR, 'narrow');
        }
        return (
          <AssociatedLandForm
            setMovingPinNameSpace={setMovingPinNameSpace}
            formikRef={formikRef}
            handleGeocoderChanges={handleGeocoderChanges}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
            initialValues={buildingToAssociateLand ?? ({} as any)}
            isPropertyAdmin={keycloak.hasClaim(Claims.ADMIN_PROPERTIES)}
            setAssociatedLandComplete={setShowCompleteModal}
          />
        );
      case SidebarContextType.LOADING:
        return <Spinner animation="border"></Spinner>;
      default:
        return (
          <SubmitPropertySelector
            addBuilding={addBuilding}
            addBareLand={addBareLand}
            addSubdivision={addSubdivision}
          />
        );
    }
  };

  return (
    <MapSideBarLayout
      title={getSidebarTitle()}
      show={showSideBar}
      setShowSideBar={setShowSideBar}
      size={size}
      hidePolicy={true}
      propertyName={buildingDetail?.name ?? parcelDetail?.name}
    >
      {render()}
      {/* <Prompt message={handleLocationChange}></Prompt> */}
      <GenericModal
        message="Are you sure you want to permanently delete the property from inventory?"
        size={ModalSize.SMALL}
        cancelButtonText="Cancel"
        okButtonText="Delete"
        display={showDelete}
        setDisplay={setShowDelete}
        handleOk={async () => {
          try {
            switch (context) {
              case SidebarContextType.UPDATE_BUILDING:
              case SidebarContextType.VIEW_BUILDING:
                await deleteBuilding(buildingDetail as IBuilding)(dispatch);
                break;
              default:
                await deleteParcel(parcelDetail as IParcel)(dispatch);
                break;
            }
            fireMapRefreshEvent();
            dispatch(storePropertyDetail(null));
            setShowSideBar(false, undefined, undefined, true);
          } catch (error) {
            toast.error(
              'Failed to delete building, check your network connection and permissions and retry',
            );
          }
        }}
        handleCancel={() => {
          setShowDelete(false);
        }}
      />
      <GenericModal
        size={ModalSize.LARGE}
        message={
          <>
            <FloatCheck size={32}></FloatCheck>
            <SuccessText>Success!</SuccessText>
            <p>Your building has been added to the PIMS inventory</p>
            <BoldText>Would you like to modify or add associated land to this building?</BoldText>
          </>
        }
        display={showAssociateLandModal}
        setDisplay={setShowAssociateLandModal}
        cancelButtonText="No, I'm done"
        okButtonText="Yes, modify/add land"
        handleOk={() => {
          addAssociatedLand();
          setShowAssociateLandModal(false);
        }}
        handleCancel={() => {
          setShowSideBar(false, undefined, undefined, true);
          setShowAssociateLandModal(false);
        }}
      ></GenericModal>
      <GenericModal
        size={ModalSize.LARGE}
        message={
          <>
            <FloatCheck size={32}></FloatCheck>
            <SuccessText>Success!</SuccessText>
            <p>Your land has been added to the PIMS inventory</p>
            <BoldText>Would you like to continue adding to the inventory?</BoldText>
          </>
        }
        display={showCompleteModal}
        setDisplay={setShowCompleteModal}
        cancelButtonText="No, I'm done"
        okButtonText="Yes"
        handleOk={() => {
          setShowSideBar(true, SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR, 'narrow', true);
          setShowCompleteModal(false);
        }}
        handleCancel={() => {
          setShowSideBar(false, undefined, undefined, true);
          setShowCompleteModal(false);
        }}
      ></GenericModal>
      <GenericModal
        size={ModalSize.LARGE}
        message={
          <>
            <FloatCheck size={32}></FloatCheck>
            <SuccessText>Success!</SuccessText>
            <p>PIMS has been updated with all of your changes</p>
          </>
        }
        display={showUpdatedModal}
        setDisplay={setShowUpdatedModal}
        okButtonText="Close"
        handleCancel={() => {
          setShowSideBar(false, undefined, undefined, true);
          setShowUpdatedModal(false);
        }}
        handleOk={() => {
          setShowSideBar(false, undefined, undefined, true);
          setShowUpdatedModal(false);
        }}
      ></GenericModal>
    </MapSideBarLayout>
  );
};

export default MapSideBarContainer;
