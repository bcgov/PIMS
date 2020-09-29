import './FilterBar.scss';

import React from 'react';
import { Col } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import {
  Form,
  Select,
  SelectOption,
  InputGroup,
  Input,
} from 'components/common/form';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';

const SearchBar: React.FC = () => {
  const state: { options: any[]; placeholders: Record<string, string> } = {
    options: [
      { label: 'Address', value: 'address' },
      { label: 'PID/PIN', value: 'pid' },
      { label: 'Municipality', value: 'municipality' },
      { label: 'RAEG or SPP No.', value: 'projectNumber' },
    ],
    placeholders: {
      address: 'Enter an address or city',
      pid: 'Enter a PID or PIN',
      municipality: 'Enter a municipality',
      projectNumber: 'Enter an SPP/RAEG number',
    },
  };

  // access the form context values, no need to pass props
  const {
    values: { searchBy },
    setFieldValue,
  } = useFormikContext<IFilterBarState>();
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

export interface IFilterBarState {
  searchBy: string;
  pid: string;
  address: string;
  municipality: string;
  projectNumber: string;
  agencies: string;
  classificationId: string;
  minLotSize: string;
  maxLotSize: string;
  parcelId?: string;
  propertyType?: string;
}

type FilterBarProps = {
  agencyLookupCodes: ILookupCode[];
  propertyClassifications: ILookupCode[];
  onChange: (value: IFilterBarState) => void;
};

/**
 * Filter bar for the Property List view
 */
const FilterBar: React.FC<FilterBarProps> = ({
  agencyLookupCodes,
  propertyClassifications,
  onChange,
}) => {
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
  });
  const agencies = (agencyLookupCodes ?? []).map(c => mapLookupCode(c));
  const classifications = (propertyClassifications ?? [])
    .filter(i => !!i.isVisible)
    .map(c => mapLookupCode(c));

  return (
    <Formik<IFilterBarState>
      initialValues={{
        searchBy: 'address',
        pid: '',
        address: '',
        municipality: '',
        projectNumber: '',
        agencies: '',
        classificationId: '',
        minLotSize: '',
        maxLotSize: '',
        parcelId: '',
        propertyType: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        onChange?.({ ...values });
        setSubmitting(false);
      }}
      onReset={(values, { setSubmitting }) => {
        setSubmitting(true);
        onChange?.({ ...values });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, handleReset }) => (
        <Form>
          <Form.Row className="filter-bar">
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

export default FilterBar;
