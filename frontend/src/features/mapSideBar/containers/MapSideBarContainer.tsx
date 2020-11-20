import * as React from 'react';
import MapSideBarLayout from '../components/MapSideBarLayout';
import useParamSideBar, { SidebarContextType } from '../hooks/useQueryParamSideBar';
import ParcelDetailContainer from 'features/properties/containers/ParcelDetailContainer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IGenericNetworkAction } from 'actions/genericActions';
import { IPropertyDetail, IParcel, IProperty } from 'actions/parcelsActions';
import * as actionTypes from 'constants/actionTypes';
import { fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import { Spinner } from 'react-bootstrap';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import * as parcelsActions from 'actions/parcelsActions';
import { BuildingForm, SubmitPropertySelector, LandForm } from '../SidebarContents';
import { BuildingSvg, LandSvg } from 'components/common/Icons';
import { FormikValues } from 'formik';
import { useState } from 'react';
import useGeocoder from 'features/properties/hooks/useGeocoder';
import { isMouseEventRecent } from 'utils';
import {
  handleParcelDataLayerResponse,
  PARCELS_LAYER_URL,
  useLayerQuery,
} from 'components/maps/leaflet/LayerPopup';

interface IMapSideBarContainerProps {
  refreshParcels: Function;
  properties: IProperty[];
  movingPinNameSpaceProp?: string;
}

/**
 * container responsible for logic related to map sidebar display. Synchronizes the state of the parcel detail forms with the corresponding query parameters (push/pull).
 */
const MapSideBarContainer: React.FunctionComponent<IMapSideBarContainerProps> = ({
  refreshParcels,
  properties,
  movingPinNameSpaceProp,
}) => {
  const {
    showSideBar,
    setShowSideBar,
    parcelId,
    overrideParcelId,
    disabled,
    loadDraft,
    context,
    size,
    addBuilding,
    addRawLand,
  } = useParamSideBar();
  const dispatch = useDispatch();
  const parcelDetailRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_PARCEL_DETAIL] as IGenericNetworkAction,
  );
  let activePropertyDetail = useSelector<RootState, IPropertyDetail>(
    state => state.parcel?.parcelDetail as IPropertyDetail,
  );
  const [cachedParcelDetail, setCachedParcelDetail] = React.useState<IParcel | null>(null);

  const [movingPinNameSpace, setMovingPinNameSpace] = useState<string | undefined>(
    movingPinNameSpaceProp,
  );
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent?.mapClickEvent,
  );
  const [propertyType, setPropertyType] = useState('');
  const formikRef = React.useRef<FormikValues>();
  const { handleGeocoderChanges } = useGeocoder({ formikRef });
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
      document.body.className = propertyType === 'building' ? 'building-cursor' : 'parcel-cursor';
    }
    return () => {
      //make sure to reset the cursor when this component is disposed.
      document.body.className = '';
    };
  }, [propertyType, movingPinNameSpace]);

  //Add a pin to the map where the user has clicked.
  useDeepCompareEffect(() => {
    //If we click on the map, create a new pin at the click location.
    if (
      movingPinNameSpace !== undefined &&
      !!formikRef?.current &&
      isMouseEventRecent(leafletMouseEvent?.originalEvent)
    ) {
      let nameSpace = (movingPinNameSpace?.length ?? 0) > 0 ? `${movingPinNameSpace}.` : '';
      if (propertyType === 'land') {
        formikRef.current.setFieldValue(
          `${nameSpace}data.latitude`,
          leafletMouseEvent?.latlng.lat || 0,
        );
        formikRef.current.setFieldValue(
          `${nameSpace}data.longitude`,
          leafletMouseEvent?.latlng.lng || 0,
        );
      } else {
        formikRef.current.setFieldValue(
          `data.buildings.0.latitude`,
          leafletMouseEvent?.latlng.lat || 0,
        );
        formikRef.current.setFieldValue(
          `data.buildings.0.longitude`,
          leafletMouseEvent?.latlng.lng || 0,
        );
      }

      setMovingPinNameSpace(undefined);
    }
  }, [dispatch, leafletMouseEvent]);

  useDeepCompareEffect(() => {
    if (showSideBar && parcelId) {
      if (
        parcelId !== cachedParcelDetail?.id &&
        parcelId !== activePropertyDetail?.parcelDetail?.id
      ) {
        dispatch(fetchParcelDetail({ id: parcelId }));
      } else if (
        parcelId === activePropertyDetail?.parcelDetail?.id &&
        activePropertyDetail?.propertyTypeId === 0
      ) {
        setCachedParcelDetail(activePropertyDetail?.parcelDetail);
      }
    } else if (showSideBar && !parcelId) {
      if (!!cachedParcelDetail) {
        setCachedParcelDetail(null);
      }
    }
  }, [
    dispatch,
    parcelId,
    showSideBar,
    parcelDetailRequest,
    (activePropertyDetail?.parcelDetail as any)?.rowVersion,
  ]);

  const renderParcelDetailsContainer = () => {
    return parcelId !== cachedParcelDetail?.id ? (
      <>
        <Spinner animation="border"></Spinner>
      </>
    ) : (
      <ParcelDetailContainer
        persistCallback={(data: IParcel) => {
          if (!showSideBar) {
            setShowSideBar(true);
          }
          overrideParcelId(data?.id === '' ? undefined : data?.id);
        }}
        onDelete={() => {
          dispatch(parcelsActions.storeParcelDetail(null));
          refreshParcels();
          setShowSideBar(false);
        }}
        parcelDetail={cachedParcelDetail}
        disabled={disabled}
        loadDraft={loadDraft}
        properties={properties}
        // mapClickMouseEvent={leafletMouseEvent}
      />
    );
  };

  const getSidebarTitle = (): React.ReactNode => {
    switch (context) {
      case SidebarContextType.ADD_BUILDING:
        return (
          <>
            <BuildingSvg className="svg" /> Submit Building (to inventory)
          </>
        );
      case SidebarContextType.ADD_RAW_LAND:
        return (
          <>
            <LandSvg className="svg" /> Submit Raw Land (to inventory)
          </>
        );
      case SidebarContextType.VIEW_BUILDING:
        return 'Building Details';
      case SidebarContextType.VIEW_RAW_LAND:
        return 'Raw Land Details';
      default:
        return 'Submit a Property';
    }
  };

  const render = (): React.ReactNode => {
    switch (context) {
      case SidebarContextType.ADD_BUILDING:
        if (propertyType !== 'building') {
          setPropertyType('building');
        }
        return (
          <BuildingForm
            formikRef={formikRef}
            setMovingPinNameSpace={setMovingPinNameSpace}
            nameSpace="data.buildings"
            index="0"
          />
        );
      case SidebarContextType.ADD_RAW_LAND:
        if (propertyType !== 'land') {
          setPropertyType('land');
        }
        return (
          <LandForm
            setMovingPinNameSpace={setMovingPinNameSpace}
            formikRef={formikRef}
            handleGeocoderChanges={handleGeocoderChanges}
            handlePidChange={handlePidChange}
            handlePinChange={handlePinChange}
          />
        );
      case SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR:
        return <SubmitPropertySelector addBuilding={addBuilding} addRawLand={addRawLand} />;
      default:
        return renderParcelDetailsContainer();
    }
  };

  return (
    <MapSideBarLayout
      title={getSidebarTitle()}
      show={showSideBar}
      setShowSideBar={setShowSideBar}
      size={size}
      hidePolicy={true}
    >
      {render()}
    </MapSideBarLayout>
  );
};

export default MapSideBarContainer;
