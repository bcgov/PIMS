import './MapFilterBar.scss';

import React from 'react';
import { Col } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Select, InputGroup, Input, SelectOption, AutoCompleteText } from '../common/form';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';
import SppButton from 'components/common/form/SppButton';
import { FilterBarSchema } from 'utils/YupSchema';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import { BasePropertyFilter } from 'components/common/interfaces';

const SearchBar: React.FC = () => {
  const state: { options: any[]; placeholders: Record<string, string> } = {
    options: [
      { label: 'Address', value: 'address' },
      { label: 'Location', value: 'administrativeArea' },
      { label: 'PID/PIN', value: 'pid' },
      { label: 'RAEG or SPP No.', value: 'projectNumber' },
    ],
    placeholders: {
      address: 'Enter an address or city',
      administrativeArea: 'Enter a location name',
      pid: 'Enter a PID or PIN',
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
    setFieldValue('administrativeArea', '');
    setFieldValue('projectNumber', '');
    setFieldValue('city', '');
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

export interface MapFilterChangeEvent extends BasePropertyFilter {
  searchBy: string;
  pid: string;
  address: string;
  administrativeArea: string;
  projectNumber: string;
  /** comma-separated list of agencies to filter by */
  agencies: string;
  classificationId: string;
  minLotSize: string;
  maxLotSize: string;
  inSurplusPropertyProgram?: boolean;
  inEnhancedReferralProcess?: boolean;
}

type MapFilterProps = {
  agencyLookupCodes: ILookupCode[];
  propertyClassifications: ILookupCode[];
  lotSizes: number[];
  mapFilter?: MapFilterChangeEvent;
  onFilterChange: (e: MapFilterChangeEvent) => void;
  onFilterReset?: () => void;
};

const defaultFilterValues: MapFilterChangeEvent = {
  searchBy: 'address',
  pid: '',
  address: '',
  administrativeArea: '',
  projectNumber: '',
  agencies: '',
  classificationId: '',
  minLotSize: '',
  maxLotSize: '',
  inSurplusPropertyProgram: false,
};

/**
 * filter overlay for the map, controls pin display.
 */
const MapFilterBar: React.FC<MapFilterProps> = ({
  agencyLookupCodes,
  propertyClassifications,
  mapFilter,
  onFilterChange,
  onFilterReset,
}) => {
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
  });
  const agencies = (agencyLookupCodes ?? []).map(c => mapLookupCode(c));
  const classifications = (propertyClassifications ?? []).map(c => mapLookupCode(c));
  const keycloak = useKeycloakWrapper();
  let formikRef = React.useRef<any>() as any;

  const applyEnhancedReferralFilter = () => {
    const values: MapFilterChangeEvent = { ...formikRef!.values };
    values.inEnhancedReferralProcess = true;
    values.inSurplusPropertyProgram = false;
    onFilterChange(values);
  };

  const applySurplusPropertyFilter = () => {
    const values: MapFilterChangeEvent = { ...formikRef!.values };
    values.inSurplusPropertyProgram = true;
    values.inEnhancedReferralProcess = false;
    onFilterChange(values);
  };

  return (
    <Formik<MapFilterChangeEvent>
      initialValues={{ ...defaultFilterValues, ...mapFilter }}
      enableReinitialize
      validationSchema={FilterBarSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setSubmitting(true);
        delete values.inEnhancedReferralProcess;
        delete values.inSurplusPropertyProgram;
        onFilterChange?.({ ...values });
        setSubmitting(false);
      }}
      innerRef={ref => (formikRef = ref)}
    >
      {({ isSubmitting, handleReset, handleSubmit, setFieldValue, values }) => (
        <Form>
          <Form.Row className="map-filter-bar align-items-start">
            <Col className="bar-item">
              <SearchBar />
            </Col>
            <Col className="bar-item">
              <AutoCompleteText
                autoSetting="off"
                field="agencies"
                options={agencies}
                placeholder="Enter an agency"
              />
            </Col>
            <Col className="bar-item">
              <Select
                field="classificationId"
                placeholder="Classification"
                options={classifications}
              />
            </Col>
            <Col className="bar-item d-flex align-items-start">
              <Input field="minLotSize" placeholder="Min Lot Size" />
              <span className="mx-2 align-self-center">-</span>
              <Input field="maxLotSize" placeholder="Max Lot Size" />
            </Col>
            {keycloak.hasClaim(Claims.ADMIN_PROPERTIES) && (
              <Col className="bar-item flex-grow-0">
                <SppButton
                  handleErpClick={applyEnhancedReferralFilter}
                  handleSppClick={applySurplusPropertyFilter}
                  inEnhancedReferralProcess={values.inEnhancedReferralProcess}
                  inSurplusPropertyProgram={values.inSurplusPropertyProgram}
                />
              </Col>
            )}
            <Col className="bar-item flex-grow-0">
              <SearchButton disabled={isSubmitting} />
            </Col>
            <Col className="bar-item flex-grow-0">
              <ResetButton
                disabled={isSubmitting}
                onClick={() => onFilterChange?.({ ...defaultFilterValues })}
              />
            </Col>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};

export default MapFilterBar;
