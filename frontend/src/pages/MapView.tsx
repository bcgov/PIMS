import React, { useEffect } from 'react';
import Map from '../components/maps/leaflet/Map';
import './MapView.scss';
import { fetchParcels, fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import { ParcelListParams, ParcelDetailParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap';
import { RootState } from 'reducers/rootReducer';
import { Parcel, ParcelDetail } from 'actions/parcelsActions';
import { ParcelList } from 'components/maps/ParcelList';
import { ParcelDetailView } from 'components/maps/ParcelDetailView';
import { ParcelState } from 'reducers/parcelsReducer';

const parcelBounds: ParcelListParams = {
  neLat: 48.43,
  neLong: -123.37,
  swLat: 48.43,
  swLong: -123.37
}

const parcelDetailParams: ParcelDetailParams = {
  pid: 123
}

const MapView = () => {
  const parcels = useSelector<RootState, Parcel[]>(state => (state.parcel as ParcelState).parcels);
  const parcelDetail = useSelector<RootState, ParcelDetail | null>(state => (state.parcel as ParcelState).parcelDetail);
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchParcels(parcelBounds));
    dispatch(fetchParcelDetail(parcelDetailParams));
  },[dispatch]);

  return <Container fluid={true}>
    <Row>
      <Col>
        <ParcelList parcels={parcels}></ParcelList>
      </Col>
      <Col>
        <ParcelDetailView parcelDetail={parcelDetail}></ParcelDetailView>
      </Col>
      <Col>
        <Map lat={48.43} lng={-123.37} zoom={14} activeUserId={"0"} />
      </Col>
    </Row>
  </Container>;
};

export default MapView;
