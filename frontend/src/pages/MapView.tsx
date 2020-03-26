import React, { useEffect } from 'react';
import Map, { MapFilterModel } from '../components/maps/leaflet/Map';
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
  agencyId: null,
  propertyClassificationId: null,
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
  const dispatch = useDispatch();

  const getApiParams = (mapFilterModel: MapFilterModel): IParcelListParams | null => {
    if (!mapFilterModel || !mapFilterModel.bounds) {
      return null;
    }
    const ne = mapFilterModel.bounds.getNorthEast();
    const sw = mapFilterModel.bounds.getSouthWest();
    const apiParams = {
      neLatitude: ne.lat,
      neLongitude: ne.lng,
      swLatitude: sw.lat,
      swLongitude: sw.lng,
      agencyId: mapFilterModel.agencyId,
      propertyClassificationId: mapFilterModel.propertyClassificationId,
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
      onParcelClick={p => dispatch(fetchParcelDetail({ id: p.id }))}
      onPopupClose={() => dispatch(storeParcelDetail(null))}
      onViewportChanged={(mapFilterModel: MapFilterModel) => {
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
