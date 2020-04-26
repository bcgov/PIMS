import './MapFilterBar.scss';

import React from 'react';
import { Col } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Select, SelectOption, Button, ButtonProps, InputGroup, Input } from '../common/form';
import { FaUndo, FaSearch } from 'react-icons/fa';

const SearchButton: React.FC<ButtonProps> = ({ ...props }) => {
  return <Button type="submit" className="bg-warning" {...props} icon={<FaSearch size={20} />} />;
};

const ResetButton: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button type="reset" variant="outline-primary" {...props} icon={<FaUndo size={20} />}>
      Reset
    </Button>
  );
};

const SearchBar: React.FC = () => {
  const state: { options: any[]; placeholders: Record<string, string> } = {
    options: [
      { label: 'Address', value: 'address' },
      { label: 'Municipality', value: 'municipality' },
      { label: 'RAEG or SPP No.', value: 'projectNumber' },
    ],
    placeholders: {
      address: 'Enter an address or city',
      municipality: 'Enter a municipality',
      projectNumber: 'Enter an SPP/RAEG number',
    },
  };

  // access the form context values, no need to pass props
  const {
    values: { searchBy },
    setFieldValue,
  } = useFormikContext<MapFilterChangeEvent>();
  const desc = state.placeholders[searchBy] || '';

  const reset = () => {
    setFieldValue('address', '');
    setFieldValue('municipality', '');
    setFieldValue('projectNumber', '');
  };

  return (
    <InputGroup
      fast={false}
      formikProps={null as any}
      prepend={<Select field="searchBy" options={state.options} onChange={reset} />}
      field={searchBy}
      placeholder={desc}
    ></InputGroup>
  );
};

export type MapFilterChangeEvent = {
  searchBy: string;
  address: string;
  municipality: string;
  projectNumber: string;
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
  onFilterChange,
}) => {
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
  });
  const agencies = (agencyLookupCodes ?? []).map(c => mapLookupCode(c));
  const classifications = (propertyClassifications ?? []).map(c => mapLookupCode(c));

  return (
    <Formik<MapFilterChangeEvent>
      initialValues={{
        searchBy: 'address',
        address: '',
        municipality: '',
        projectNumber: '',
        agencies: '',
        classificationId: '',
        minLotSize: '',
        maxLotSize: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        onFilterChange?.({ ...values });
        setSubmitting(false);
      }}
      onReset={(values, { setSubmitting }) => {
        setSubmitting(true);
        onFilterChange?.({ ...values });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, handleReset }) => (
        <Form>
          <Form.Row className="map-filter-bar">
            <Col className="bar-item">
              <SearchBar />
            </Col>
            <Col className="bar-item">
              <Select field="agencies" placeholder="Enter an Agency" options={agencies} />
            </Col>
            <Col className="bar-item">
              <Select
                field="classificationId"
                placeholder="Classification"
                options={classifications}
              />
            </Col>
            <Col className="bar-item d-flex align-items-center">
              <Input field="minLotSize" placeholder="Min Lot Size" />
              <span className="mx-2">-</span>
              <Input field="maxLotSize" placeholder="Max Lot Size" />
            </Col>
            <Col className="bar-item flex-grow-0">
              <SearchButton disabled={isSubmitting} />
            </Col>
            <Col className="bar-item flex-grow-0">
              <ResetButton disabled={isSubmitting} onClick={handleReset} />
            </Col>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};

export default MapFilterBar;
