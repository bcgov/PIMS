import './FilterBar.scss';

import React from 'react';
import { Col } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import {
  Form,
  Select,
  SelectOption,
  Button,
  ButtonProps,
  InputGroup,
} from 'components/common/form';
import { FaUndo, FaSearch } from 'react-icons/fa';
import _ from 'lodash';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

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
  address: string;
  municipality: string;
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
  const keycloak = useKeycloakWrapper();
  //restrict available agencies to user agencies.
  const agencies = _.filter(
    (agencyLookupCodes ?? []).map(c => mapLookupCode(c)),
    agency => keycloak.hasAgency(parseInt(agency.value as string)),
  );
  const classifications = (propertyClassifications ?? []).map(c => mapLookupCode(c));

  return (
    <Formik<IFilterBarState>
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
