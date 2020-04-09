import React, { useEffect } from 'react';
import Map, { MapViewportChangeEvent } from '../components/maps/leaflet/Map';
import './MapView.scss';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import {
  fetchParcels,
  fetchPropertyDetail,
  fetchParcelDetail,
} from 'actionCreators/parcelsActionCreator';
import { IParcelListParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IProperty, storeParcelDetail, IPropertyDetail, IParcel } from 'actions/parcelsActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { ILookupCode } from 'actions/lookupActions';
import { LeafletMouseEvent } from 'leaflet';
import { saveClickLatLng as saveLeafletMouseEvent } from 'reducers/LeafletMouseSlice';
import * as API from 'constants/API';
import _ from 'lodash';

const parcelBounds: IParcelListParams = {
  neLatitude: 48.43,
  neLongitude: -123.37,
  swLatitude: 48.43,
  swLongitude: -123.37,
  address: null,
  agencies: null,
  classificationId: null,
  minLandArea: null,
  maxLandArea: null,
};

// This could also come from the API, a local file, etc -OR- replacing the <select> fields with free text inputs.
// Hard-coding it here until further requirements say otherwise.
const fetchLotSizes = () => {
  return [1, 2, 5, 10, 50, 100, 200, 300, 400, 500, 1000, 10000];
};

interface MapViewProps {
  disableMapFilterBar?: boolean;
  disabled?: boolean;
  onMarkerClick?: (obj: IProperty) => void;
  onMarkerPopupClosed?: (obj: IPropertyDetail) => void;
}

const MapView = (props: MapViewProps) => {
  const properties = useSelector<RootState, IProperty[]>(state => state.parcel.parcels);
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
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME;
  });

  const lotSizes = fetchLotSizes();
  const dispatch = useDispatch();

  const getApiParams = (e: MapViewportChangeEvent): IParcelListParams | null => {
    if (!e || !e.bounds) {
      return null;
    }
    const { address, agencies, classificationId, minLotSize, maxLotSize } = e.filter ?? {};

    const ne = e.bounds.getNorthEast();
    const sw = e.bounds.getSouthWest();
    const apiParams: IParcelListParams = {
      neLatitude: ne.lat,
      neLongitude: ne.lng,
      swLatitude: sw.lat,
      swLongitude: sw.lng,
      address: address ?? null,
      agencies: agencies ?? null,
      classificationId: classificationId ?? null,
      minLandArea: minLotSize ?? null,
      maxLandArea: maxLotSize ?? null,
    };
    return apiParams;
  };
  const saveLatLng = (e: LeafletMouseEvent) => {
    //TODO: this prevents click events on markers from being recorded, would like a better way.
    if (!(e?.originalEvent?.target as any)?.className.indexOf('leaflet-marker')) {
      return;
    }
    if (!props.disabled) {
      dispatch(saveLeafletMouseEvent(e));
    }
  };

  useEffect(() => {
    dispatch(fetchParcels(parcelBounds));
    dispatch(getFetchLookupCodeAction());
  }, [dispatch, parcelBounds]);
  return (
    <Map
      lat={propertyDetail?.parcelDetail?.latitude ?? 48.43}
      lng={propertyDetail?.parcelDetail?.longitude ?? -123.37}
      zoom={14}
      properties={properties}
      selectedProperty={propertyDetail}
      agencies={agencies}
      propertyClassifications={propertyClassifications}
      lotSizes={lotSizes}
      onMarkerClick={
        props.onMarkerClick ?? (p => p.id && dispatch(fetchPropertyDetail(p.id, p.propertyTypeId)))
      }
      onMarkerPopupClose={props.onMarkerPopupClosed ?? (() => dispatch(storeParcelDetail(null)))}
      onViewportChanged={(mapFilterModel: MapViewportChangeEvent) => {
        const apiParams = getApiParams(mapFilterModel);
        const action = fetchParcels(apiParams);
        _.throttle(() => {
          dispatch(action);
        }, 250)();
      }}
      onMapClick={saveLatLng}
      disableMapFilterBar={props.disableMapFilterBar}
      disabled={props.disabled}
    />
  );
};

export default MapView;
