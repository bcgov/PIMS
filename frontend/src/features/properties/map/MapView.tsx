import React, { useEffect, useState, useRef } from 'react';
import Map, { MapViewportChangeEvent } from '../../../components/maps/leaflet/Map';
import './MapView.scss';
import { Map as LeafletMap } from 'react-leaflet';
import { fetchParcels, fetchPropertyDetail } from 'actionCreators/parcelsActionCreator';
import { IPropertySearchParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IProperty, storeParcelDetail, IPropertyDetail } from 'actions/parcelsActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { ILookupCode } from 'actions/lookupActions';
import { LeafletMouseEvent } from 'leaflet';
import useParamSideBar from '../../mapSideBar/hooks/useQueryParamSideBar';
import { saveClickLatLng as saveLeafletMouseEvent } from 'reducers/LeafletMouseSlice';
import * as API from 'constants/API';
import _ from 'lodash';
import MapSideBarContainer from 'features/mapSideBar/containers/MapSideBarContainer';
import classNames from 'classnames';

/** rough center of bc Itcha Ilgachuz Provincial Park */
const defaultLatLng = {
  lat: 52.81604319154934,
  lng: -124.67285156250001,
};

const parcelBounds: IPropertySearchParams = {
  pid: null,
  neLatitude: defaultLatLng.lat,
  neLongitude: defaultLatLng.lng,
  swLatitude: defaultLatLng.lat,
  swLongitude: defaultLatLng.lng,
  address: null,
  administrativeArea: null,
  projectNumber: null,
  agencies: null,
  classificationId: null,
  minLandArea: null,
  maxLandArea: null,
  inSurplusPropertyProgram: false,
};

// This could also come from the API, a local file, etc -OR- replacing the <select> fields with free text inputs.
// Hard-coding it here until further requirements say otherwise.
const fetchLotSizes = () => {
  return [1, 2, 5, 10, 50, 100, 200, 300, 400, 500, 1000, 10000];
};

interface MapViewProps {
  disableMapFilterBar?: boolean;
  disabled?: boolean;
  showParcelBoundaries?: boolean;
  onMarkerClick?: (obj: IProperty) => void;
  onMarkerPopupClosed?: (obj: IPropertyDetail) => void;
}

const MapView: React.FC<MapViewProps> = (props: MapViewProps) => {
  const properties = useSelector<RootState, IProperty[]>(state => state.parcel.parcels);
  const [loadedProperties, setLoadedProperties] = useState(false);
  const mapRef = useRef<LeafletMap>(null);
  const propertyDetail = useSelector<RootState, IPropertyDetail | null>(
    state => state.parcel.parcelDetail,
  );
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const agencies = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AGENCY_CODE_SET_NAME;
  });
  const propertyClassifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME && !!lookupCode.isVisible;
  });

  const lotSizes = fetchLotSizes();
  const dispatch = useDispatch();

  const getApiParams = (e: MapViewportChangeEvent): IPropertySearchParams | null => {
    if (!e || !e.bounds) {
      return null;
    }
    const {
      pid,
      address,
      administrativeArea,
      projectNumber,
      agencies,
      classificationId,
      minLotSize,
      maxLotSize,
      inSurplusPropertyProgram,
      inEnhancedReferralProcess,
    } = e.filter ?? {};

    const ne = e.bounds.getNorthEast();
    const sw = e.bounds.getSouthWest();
    const apiParams: IPropertySearchParams = {
      pid: pid ?? null,
      neLatitude: ne.lat,
      neLongitude: ne.lng,
      swLatitude: sw.lat,
      swLongitude: sw.lng,
      address: address ?? null,
      administrativeArea: administrativeArea ?? null,
      projectNumber: projectNumber ?? null,
      agencies: agencies ?? null,
      classificationId: classificationId ?? null,
      minLandArea: minLotSize ?? null,
      maxLandArea: maxLotSize ?? null,
      inSurplusPropertyProgram: inSurplusPropertyProgram ?? null,
      inEnhancedReferralProcess,
    };
    return apiParams;
  };
  const saveLatLng = (e: LeafletMouseEvent) => {
    // TODO: this prevents click events on markers from being recorded, would like a better way.
    if (!(e?.originalEvent?.target as any)?.className?.indexOf('leaflet-marker')) {
      return;
    }
    if (!props.disabled) {
      dispatch(saveLeafletMouseEvent(e));
    }
  };

  const throttledFetch = useRef(
    _.throttle<any>((parcelBounds: any) => dispatch(fetchParcels(parcelBounds)), 1000),
  ).current;

  useEffect(() => {
    throttledFetch(parcelBounds);
  }, [dispatch, throttledFetch]);

  const { showSideBar } = useParamSideBar();

  return (
    <div className={classNames(showSideBar ? 'side-bar' : '', 'd-flex')}>
      <MapSideBarContainer
        refreshParcels={() => {
          throttledFetch(parcelBounds);
          mapRef.current?.leafletElement.fireEvent('clear');
        }}
        properties={properties}
      ></MapSideBarContainer>
      <Map
        lat={(propertyDetail?.parcelDetail?.latitude as number) ?? defaultLatLng.lat}
        lng={(propertyDetail?.parcelDetail?.longitude as number) ?? defaultLatLng.lng}
        properties={properties}
        selectedProperty={propertyDetail}
        agencies={agencies}
        propertyClassifications={propertyClassifications}
        lotSizes={lotSizes}
        onMarkerClick={
          props.onMarkerClick ??
          ((p, position) => p.id && dispatch(fetchPropertyDetail(p.id, p.propertyTypeId, position)))
        }
        onMarkerPopupClose={props.onMarkerPopupClosed ?? (() => dispatch(storeParcelDetail(null)))}
        onViewportChanged={(mapFilterModel: MapViewportChangeEvent) => {
          if (!loadedProperties) {
            setLoadedProperties(true);
          }
          const apiParams = getApiParams(mapFilterModel);
          throttledFetch(apiParams);
        }}
        onMapClick={saveLatLng}
        disableMapFilterBar={props.disableMapFilterBar}
        interactive={!props.disabled}
        showParcelBoundaries={props.showParcelBoundaries ?? true}
        zoom={6}
        mapRef={mapRef}
      />
    </div>
  );
};

export default MapView;
