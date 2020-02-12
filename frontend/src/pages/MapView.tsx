import React, { useEffect } from 'react';
import { LatLngBounds } from 'leaflet';
import Map from '../components/maps/leaflet/Map';
import './MapView.scss';
import { fetchParcels, fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import { IParcelListParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'reducers/rootReducer';
import { IParcel, IParcelDetail, storeParcelDetail } from 'actions/parcelsActions';
import { IParcelState } from 'reducers/parcelsReducer';

const parcelBounds: IParcelListParams = {
  neLat: 48.43,
  neLong: -123.37,
  swLat: 48.43,
  swLong: -123.37
}

const parseMapBounds = (bounds: LatLngBounds | null): IParcelListParams | null => {
  if (!bounds) {
    return null;
  }
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  const apiParams = {
    neLat: ne.lat,
    neLong: ne.lng,
    swLat: sw.lat,
    swLong: sw.lng
  };
  return apiParams;
};

const MapView = () => {
  const parcels = useSelector<RootState, IParcel[]>(state => (state.parcel as IParcelState).parcels);
  const parcelDetail = useSelector<RootState, IParcelDetail | null>(state => (state.parcel as IParcelState).parcelDetail);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchParcels(parcelBounds));
  }, [dispatch]);

  return (
    <Map
      lat={48.43}
      lng={-123.37}
      zoom={14}
      parcels={parcels}
      activeParcel={parcelDetail}
      onParcelClick={p => dispatch(fetchParcelDetail({ id: p.id }))}
      onPopupClose={() => dispatch(storeParcelDetail(null))}
      onViewportChanged={e => {
        const apiParams = parseMapBounds(e);
        const action = fetchParcels(apiParams);
        dispatch(action);
      }}
    />
  );
};

export default MapView;
