import './FilterBar.scss';

import React, { useMemo } from 'react';
import { Col } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Select, SelectOption, InputGroup, Input } from 'components/common/form';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import { BasePropertyFilter } from 'components/common/interfaces';
import { ParentGroupedFilter } from 'components/SearchBar/ParentGroupedFilter';

const SearchBar: React.FC = () => {
  const state: { options: any[]; placeholders: Record<string, string> } = {
    options: [
      { label: 'Address', value: 'address' },
      { label: 'PID/PIN', value: 'pid' },
      { label: 'Location', value: 'administrativeArea' },
      { label: 'RAEG or SPP No.', value: 'projectNumber' },
    ],
    placeholders: {
      address: 'Enter an address or location',
      pid: 'Enter a PID or PIN',
      administrativeArea: 'Enter a location',
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
    setFieldValue('administrativeArea', '');
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

export interface IFilterBarState extends BasePropertyFilter {
  searchBy: string;
  pid: string;
  address: string;
  administrativeArea: string;
  projectNumber: string;
  agencies: string;
  classificationId: string;
  minLotSize: string;
  maxLotSize: string;
  parcelId?: string;
  propertyType?: PropertyTypes;
}

export enum PropertyTypes {
  Land = 'Land',
  Building = 'Building',
}

type FilterBarProps = {
  agencyLookupCodes: ILookupCode[];
  propertyClassifications: ILookupCode[];
  filter?: IFilterBarState;
  onChange: (value: IFilterBarState) => void;
};

const defaultFilterValues: IFilterBarState = {
  searchBy: 'address',
  pid: '',
  address: '',
  administrativeArea: '',
  projectNumber: '',
  agencies: '',
  classificationId: '',
  minLotSize: '',
  maxLotSize: '',
  parcelId: '',
  propertyType: PropertyTypes.Land,
};

/**
 * Filter bar for the Property List view
 */
const FilterBar: React.FC<FilterBarProps> = ({
  agencyLookupCodes,
  propertyClassifications,
  filter,
  onChange,
}) => {
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
    code: code.code,
    parentId: code.parentId,
    parent: agencyLookupCodes.find(x => x.id.toString() === code.parentId?.toString())?.name,
  });

  const agencies = (agencyLookupCodes ?? []).map(c => mapLookupCode(c));
  const initialValues = useMemo(() => {
    const values = { ...defaultFilterValues, ...filter };
    if (typeof values.agencies === 'string') {
      const agency = agencies.find(x => x.value.toString() === values.agencies.toString()) as any;
      if (agency) {
        values.agencies = agency;
      }
    }
    return values;
  }, [agencies, filter]);

  const classifications = (propertyClassifications ?? [])
    .filter(i => !!i.isVisible)
    .map(c => mapLookupCode(c));

  return (
    <Formik<IFilterBarState>
      initialValues={{ ...initialValues }}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        onChange?.({ ...values, agencies: (values.agencies as any)?.value });
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
              <ParentGroupedFilter
                name="agencies"
                options={agencies}
                className="map-filter-typeahead"
                filterBy={['code', 'label', 'parent']}
                placeholder="Enter an Agency"
                inputSize="large"
              />
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
              <ResetButton
                disabled={isSubmitting}
                onClick={() => onChange?.({ ...defaultFilterValues })}
              />
            </Col>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};

export default FilterBar;
