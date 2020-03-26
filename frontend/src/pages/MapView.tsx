import React, { useEffect } from 'react';
import Map, { MapViewportChangeEvent } from '../components/maps/leaflet/Map';
import './MapView.scss';
import { getFetchLookupCodeAction } from 'actionCreators/lookupCodeActionCreator';
import { fetchParcels, fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import { IParcelListParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IParcel, IParcelDetail, storeParcelDetail } from 'actions/parcelsActions';
import { IParcelState } from 'reducers/parcelsReducer';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { ILookupCode } from 'actions/lookupActions';
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

const MapView = () => {
  const parcels = useSelector<RootState, IParcel[]>(
    state => (state.parcel as IParcelState).parcels,
  );
  const parcelDetail = useSelector<RootState, IParcelDetail | null>(
    state => (state.parcel as IParcelState).parcelDetail,
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

  useEffect(() => {
    dispatch(fetchParcels(parcelBounds));
    dispatch(getFetchLookupCodeAction());
  }, [dispatch]);

  return (
    <Map
      lat={48.43}
      lng={-123.37}
      zoom={14}
      parcels={parcels}
      activeParcel={parcelDetail}
      agencies={agencies}
      propertyClassifications={propertyClassifications}
      lotSizes={lotSizes}
      onParcelClick={p => dispatch(fetchParcelDetail({ id: p.id }))}
      onPopupClose={() => dispatch(storeParcelDetail(null))}
      onViewportChanged={(mapFilterModel: MapViewportChangeEvent) => {
        const apiParams = getApiParams(mapFilterModel);
        const action = fetchParcels(apiParams);
        _.throttle(() => {
          dispatch(action);
        }, 250)();
      }}
    />
  );
};

export default MapView;
