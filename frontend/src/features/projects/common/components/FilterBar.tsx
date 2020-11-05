import './FilterBar.scss';

import React from 'react';
import { Col } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Select, SelectOption, InputGroup, Input } from 'components/common/form';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';

const SearchBar: React.FC = () => {
  const state: { placeholders: Record<string, string> } = {
    placeholders: {
      address: 'Enter an address or city',
    },
  };

  // access the form context values, no need to pass props
  const {
    values: { searchBy },
  } = useFormikContext<IFilterBarState>();
  const desc = state.placeholders[searchBy] || '';

  return (
    <InputGroup
      fast={false}
      formikProps={null as any}
      field={searchBy}
      placeholder={desc}
    ></InputGroup>
  );
};

export interface IFilterBarState {
  searchBy: string;
  pid: string;
  address: string;
  administrativeArea: string;
  projectNumber: string;
  agencies: string;
  classificationId: string;
  minLotSize: string;
  maxLotSize: string;
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
  //restrict available agencies to user agencies.
  const agencies = (agencyLookupCodes ?? []).map(c => mapLookupCode(c));
  const classifications = (propertyClassifications ?? []).map(c => mapLookupCode(c));

  return (
    <Formik<IFilterBarState>
      initialValues={{
        searchBy: 'address',
        pid: '',
        address: '',
        administrativeArea: '',
        projectNumber: '',
        agencies: '',
        classificationId: '',
        minLotSize: '',
        maxLotSize: '',
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
              <Input field="pid" placeholder="Enter PID or PIN" />
            </Col>
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
