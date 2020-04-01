import './MapFilterBar.scss';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Input, Select, SelectOption, Button, ButtonProps } from '../common/form';
import { SearchIcon } from '../common/icons';

const SearchButton: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button
      variant="warning"
      type="submit"
      className="pl-0"
      {...props}
      iconBefore={<SearchIcon className="mr-2" />}
    >
      Search
    </Button>
  );
};

export type MapFilterChangeEvent = {
  address: string;
  /** comma-separated list of agencies to filter by */
  agencies: string;
  classificationId: string;
  minLotSize: string;
  maxLotSize: string;
};

type MapFilterProps = {
  agencyLookupCodes: ILookupCode[];
  propertyClassifications: ILookupCode[];
  lotSizes: number[];
  onFilterChange: (e: MapFilterChangeEvent) => void;
};

/**
 * filter overlay for the map, controls pin display.
 */
const MapFilterBar: React.FC<MapFilterProps> = ({
  agencyLookupCodes,
  propertyClassifications,
  lotSizes,
  onFilterChange,
}) => {
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
  });
  const mapLotSize = (size: number): SelectOption => ({
    label: size > 1 ? `${size.toLocaleString()} acres` : `${size} acre`,
    value: `${size}`,
  });

  const agencies = (agencyLookupCodes ?? []).map(c => mapLookupCode(c));
  const classifications = (propertyClassifications ?? []).map(c => mapLookupCode(c));
  const sizes = lotSizes.map(x => mapLotSize(x));

  return (
    <Formik<MapFilterChangeEvent>
      initialValues={{
        address: '',
        agencies: '',
        classificationId: '',
        minLotSize: '',
        maxLotSize: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        onFilterChange?.(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Container fluid={true} className="map-filter-container">
          <Row>
            <Col md={{ span: 8, offset: 2 }} xs={{ span: 8, offset: 2 }}>
              <Form>
                <Form.Row className="map-filter-bar">
                  <Col className="bar-item">
                    <Input field="address" placeholder="Enter an address or city" />
                  </Col>
                  <Col className="bar-item">
                    <Select field="agencies" placeholder="View Properties In" options={agencies} />
                  </Col>
                  <Col className="bar-item">
                    <Select
                      field="classificationId"
                      placeholder="View by Classification"
                      options={classifications}
                    />
                  </Col>
                  <Col className="bar-item">
                    <Select field="minLotSize" placeholder="No Min Lot Size" options={[...sizes]} />
                  </Col>
                  <Col className="bar-item">
                    <Select field="maxLotSize" placeholder="No Max Lot Size" options={[...sizes]} />
                  </Col>
                  <Col className="bar-item flex-grow-0">
                    <SearchButton disabled={isSubmitting} />
                  </Col>
                </Form.Row>
              </Form>
            </Col>
          </Row>
        </Container>
      )}
    </Formik>
  );
};

export default MapFilterBar;
