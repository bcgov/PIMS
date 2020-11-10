import * as React from 'react';
import MapSideBarLayout from '../components/MapSideBarLayout';
import useParamSideBar from '../hooks/useQueryParamSideBar';
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
import { LeafletMouseEvent } from 'leaflet';

interface IMapSideBarContainerProps {
  refreshParcels: Function;
  properties: IProperty[];
}

/**
 * container responsible for logic related to map sidebar display. Synchronizes the state of the parcel detail forms with the corresponding query parameters (push/pull).
 */
const MapSideBarContainer: React.FunctionComponent<IMapSideBarContainerProps> = ({
  refreshParcels,
  properties,
}) => {
  const {
    showSideBar,
    setShowSideBar,
    parcelId,
    overrideParcelId,
    disabled,
    loadDraft,
  } = useParamSideBar();
  const dispatch = useDispatch();
  const parcelDetailRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[actionTypes.GET_PARCEL_DETAIL] as IGenericNetworkAction,
  );
  let activePropertyDetail = useSelector<RootState, IPropertyDetail>(
    state => state.parcel?.parcelDetail as IPropertyDetail,
  );
  const [cachedParcelDetail, setCachedParcelDetail] = React.useState<IParcel | null>(null);
  const leafletMouseEvent = useSelector<RootState, LeafletMouseEvent | null>(
    state => state.leafletClickEvent?.mapClickEvent,
  );

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

  return (
    <MapSideBarLayout show={showSideBar} setShowSideBar={setShowSideBar}>
      {parcelId !== cachedParcelDetail?.id ? (
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
          mapClickMouseEvent={leafletMouseEvent}
        />
      )}
    </MapSideBarLayout>
  );
};

export default MapSideBarContainer;
