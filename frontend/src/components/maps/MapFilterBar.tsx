import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { ILookupCode } from 'actions/lookupActions';
import LookupCodeDropdown from 'components/common/LookupCodeDropdown';
import './MapFilterBar.scss';

type MapFilterProps = {
  agencyLookupCodes: ILookupCode[];
  propertyClassifications: ILookupCode[];
  onSelectAgency: (agencyId: number | null) => void;
  onSelectPropertyClassification: (propertyClassificationId: number | null) => void;
};

/**
 * filter overlay for the map, controls pin display.
 * @param props {@link MapFilterProps}
 */
function MapFilterBar(props: MapFilterProps) {
  const onSelectAgency = (codeId: number | null) => {
    props.onSelectAgency(codeId);
  }
  const onSelectPropertyClassification = (codeId: number | null) => {
    props.onSelectPropertyClassification(codeId);
  }

  return (
    <Container fluid={true} className="map-filter-bar">
      <Row>
        <Col md={{ span: 8, offset: 2 }} xs={{ span: 8, offset: 2 }}>
          <Row>
            <Col className="bar-item">
              <Form.Control type="text" placeholder="Search Bar Not Implemented" />
            </Col>
            <Col className="bar-item">
              <LookupCodeDropdown lookupCodes={props.agencyLookupCodes || []} defaultTitle={"View Properties in \u00A0"} onSelectCode={onSelectAgency} />
            </Col>
            <Col className="bar-item">
              <LookupCodeDropdown lookupCodes={props.propertyClassifications || []} defaultTitle={"View by Classification \u00A0"} onSelectCode={onSelectPropertyClassification} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default MapFilterBar;


