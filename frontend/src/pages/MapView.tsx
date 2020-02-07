import React, { useEffect } from 'react';
import Map from '../components/maps/leaflet/Map';
import './MapView.scss';
import { fetchParcels, fetchParcelDetail } from 'actionCreators/parcelsActionCreator';
import { IParcelListParams, IParcelDetailParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap';
import { RootState } from 'reducers/rootReducer';
import { IParcel, IParcelDetail } from 'actions/parcelsActions';
import { ParcelList } from 'components/maps/ParcelList';
import { ParcelPopupView } from 'components/maps/ParcelPopupView';
import { IParcelState } from 'reducers/parcelsReducer';

const parcelBounds: IParcelListParams = {
  neLat: 48.43,
  neLong: -123.37,
  swLat: 48.43,
  swLong: -123.37
}

const parcelDetailParams: IParcelDetailParams = {
  pid: 123
}

const MapView = () => {
  const parcels = useSelector<RootState, IParcel[]>(state => (state.parcel as IParcelState).parcels);
  const parcelDetail = useSelector<RootState, IParcelDetail | null>(state => (state.parcel as IParcelState).parcelDetail);
  
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
        <ParcelPopupView parcelDetail={parcelDetail}></ParcelPopupView>
      </Col>
      <Col>
        <Map lat={48.43} lng={-123.37} zoom={14} activeUserId={"0"} />
      </Col>
    </Row>
  </Container>;
};

export default MapView;
