import React, { useEffect } from 'react';
import Map from '../components/maps/leaflet/Map';
import './MapView.scss';
import { fetchProperties, fetchPropertyDetail } from 'actionCreators/propertiesActionCreator';
import { PropertyListParams, PropertyDetailParams } from 'constants/API';
import { useDispatch, useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap';
import { RootState } from 'reducers/rootReducer';
import { Property, PropertyDetail } from 'actions/propertiesActions';
import { PropertyList } from 'components/maps/PropertyList';
import { PropertyDetailView } from 'components/maps/PropertyDetailView';
import { PropertyState } from 'reducers/propertiesReducer';

const propertyBounds: PropertyListParams = {
  neLat: 48.43,
  neLong: -123.37,
  swLat: 48.43,
  swLong: -123.37
}

const propertyDetailParams: PropertyDetailParams = {
  pid: 123
}

const MapView = () => {
  const properties = useSelector<RootState, Property[]>(state => (state.property as PropertyState).properties);
  const propertyDetail = useSelector<RootState, PropertyDetail | null>(state => (state.property as PropertyState).propertyDetail);
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProperties(propertyBounds));
    dispatch(fetchPropertyDetail(propertyDetailParams));
  },[dispatch]);

  console.log('sup dawg');

  return <Container fluid={true}>
    <Row>
      <Col>
        <PropertyList properties={properties}></PropertyList>
      </Col>
      <Col>
        <PropertyDetailView propertyDetail={propertyDetail}></PropertyDetailView>
      </Col>
      <Col>
        <Map lat={48.43} lng={-123.37} zoom={14} activeUserId={"0"} />
      </Col>
    </Row>
  </Container>;
};

export default MapView;
