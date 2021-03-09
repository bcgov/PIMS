import './PropertyFilter.scss';

import React, { useMemo, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import { Formik, getIn } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Select } from '../../../components/common/form';
import { FilterBarSchema } from 'utils/YupSchema';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import { mapLookupCode, mapLookupCodeWithParentString } from 'utils';
import { PropertyFilterOptions } from './';
import { useRouterFilter } from 'hooks/useRouterFilter';
import { IPropertyFilter } from './IPropertyFilter';
import { TableSort } from 'components/Table/TableSort';
import { FindMorePropertiesButton } from 'components/maps/FindMorePropertiesButton';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { useDispatch } from 'react-redux';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { fetchPropertyNames } from 'actionCreators/propertyActionCreator';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { PropertyFilterAgencyOptions } from './PropertyFilterAgencyOptions';
import styled from 'styled-components';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { Claims } from 'constants/claims';
import useLookupCodes from 'hooks/useLookupCodes';
import { mapSelectOptionWithParent } from 'utils';
import { useMyAgencies } from 'hooks/useMyAgencies';

/**
 * PropertyFilter component properties.
 */
export interface IPropertyFilterProps {
  /** The default filter to apply if a different one hasn't been set in the URL or stored in redux. */
  defaultFilter: IPropertyFilter;
  /** An array of agency lookup codes. */
  agencyLookupCodes: ILookupCode[];
  /** An array of administrative area codes. */
  adminAreaLookupCodes: ILookupCode[];
  /** Callback event when the filter is changed during Mount. */
  onChange: (filter: IPropertyFilter) => void;
  /** Comma separated list of column names to sort by. */
  sort?: TableSort<any>;
  /** Event fire when sorting changes. */
  onSorting?: (sort: TableSort<any>) => void;
  /** Show select with my agencies/All Government dropdown */
  showAllAgencySelect?: boolean;
}

const AgencyCol = styled(Col)`
  display: flex;
  .form-control {
    width: 165px;
    height: 35px;
  }
  .form-group {
    .rbt {
      .rbt-menu {
        width: 370px !important;
      }
    }
  }
`;

/**
 * Property filter bar to search for properties.
 * Applied filter will be added to the URL query parameters and stored in a redux store.
 */
export const PropertyFilter: React.FC<IPropertyFilterProps> = ({
  defaultFilter,
  agencyLookupCodes,
  adminAreaLookupCodes,
  onChange,
  sort,
  onSorting,
  showAllAgencySelect,
}) => {
  const [propertyFilter, setPropertyFilter] = React.useState<IPropertyFilter>(defaultFilter);
  const dispatch = useDispatch();
  const keycloak = useKeycloakWrapper();
  const lookupCodes = useLookupCodes();
  const [initialLoad, setInitialLoad] = useState(false);
  useRouterFilter({
    filter: propertyFilter,
    setFilter: filter => {
      onChange(filter);
      setPropertyFilter(filter);
    },
    key: 'propertyFilter',
    sort: sort,
    setSorting: onSorting,
  });

  const agencies = (agencyLookupCodes ?? []).map(c =>
    mapLookupCodeWithParentString(c, agencyLookupCodes),
  );
  const classifications = lookupCodes.getPropertyClassificationOptions();
  const adminAreas = (adminAreaLookupCodes ?? []).map(c => mapLookupCode(c));
  const [clear, setClear] = useState(false);
  const [options, setOptions] = useState([]);

  const initialValues = useMemo(() => {
    const values = { ...defaultFilter, ...propertyFilter };
    if (typeof values.agencies === 'string') {
      const agency = agencies.find(x => x.value.toString() === values.agencies?.toString()) as any;
      if (agency) {
        values.agencies = agency;
      }
    } else {
      const agencies: any[] = values?.agencies || [];
      if (agencies.length > 0) {
        values.agencies = agencies[0] || (agencies.length === 2 ? agencies[1] : undefined);
      }
    }
    return values;
  }, [defaultFilter, propertyFilter, agencies]);

  const myAgencies = useMyAgencies();

  const changeFilter = (values: IPropertyFilter) => {
    const agencyIds = (values.agencies as any)?.value
      ? (values.agencies as any).value
      : values.agencies;
    setPropertyFilter({ ...values, agencies: agencyIds });
    onChange?.({ ...values, agencies: agencyIds });
  };

  const resetFilter = () => {
    ref.current.clear();
    changeFilter(defaultFilter);
    setClear(true);
  };

  const [findMoreOpen, setFindMoreOpen] = useState<boolean>(false);
  const ref = useRef<any>();

  return (
    <Formik<IPropertyFilter>
      initialValues={{ ...initialValues }}
      enableReinitialize
      validationSchema={FilterBarSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        changeFilter(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Form.Row className="map-filter-bar">
            <FindMorePropertiesButton
              buttonText="Find available surplus properties"
              onEnter={() => {
                setFindMoreOpen(true);
                setFieldValue('surplusFilter', true);
                setFieldValue('includeAllProperties', true);
                !keycloak.hasClaim(Claims.ADMIN_PROPERTIES) && setFieldValue('agencies', undefined);
              }}
              onExit={() => {
                setFindMoreOpen(false);
                setFieldValue('surplusFilter', false);
              }}
            />
            <div className="vl"></div>

            <AgencyCol>
              {showAllAgencySelect ? (
                <PropertyFilterAgencyOptions disabled={findMoreOpen} agencies={agencies} />
              ) : (
                <ParentSelect
                  field="agencies"
                  options={myAgencies.map(c => mapSelectOptionWithParent(c, myAgencies))}
                  filterBy={['code', 'label', 'parent']}
                  placeholder="My Agencies"
                  selectClosest
                  disabled={findMoreOpen}
                />
              )}
            </AgencyCol>
            <Col className="map-filter-typeahead">
              <AsyncTypeahead
                disabled={
                  (findMoreOpen || values.includeAllProperties === true) &&
                  !keycloak.hasClaim(Claims.ADMIN_PROPERTIES)
                }
                isLoading={initialLoad}
                id={`name-field`}
                inputProps={{ id: `name-field` }}
                placeholder="Property name"
                onSearch={() => {
                  setInitialLoad(true);
                  fetchPropertyNames(keycloak.agencyId!)(dispatch).then(results => {
                    setOptions(results);
                    setInitialLoad(false);
                  });
                }}
                options={options}
                onChange={(newValues: string[]) => {
                  setFieldValue('name', getIn(newValues[0], 'value') ?? newValues[0]);
                }}
                ref={ref}
                onBlur={(e: any) =>
                  getIn(values, 'name') !== e.target.value && setFieldValue('name', e.target.value)
                }
              />
            </Col>
            <Col className="map-filter-typeahead">
              <TypeaheadField
                name="administrativeArea"
                placeholder="Location"
                selectClosest
                hideValidation={true}
                options={adminAreas.map(x => x.label)}
                onChange={(vals: any) => {
                  setFieldValue('administrativeArea', getIn(vals[0], 'name') ?? vals[0]);
                }}
                clearSelected={clear}
                setClear={setClear}
                disabled={findMoreOpen}
              />
            </Col>
            <Col className="bar-item">
              <PropertyFilterOptions disabled={findMoreOpen} />
            </Col>
            <Col className="bar-item">
              <Select
                field="classificationId"
                placeholder="Classification"
                options={classifications}
                disabled={findMoreOpen}
              />
            </Col>
            <Col className="bar-item flex-grow-0">
              <SearchButton disabled={isSubmitting || findMoreOpen} />
            </Col>
            <Col className="bar-item flex-grow-0">
              <ResetButton disabled={isSubmitting || findMoreOpen} onClick={resetFilter} />
            </Col>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};
