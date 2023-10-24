import './PropertyFilter.scss';

import { ILookupCode } from 'actions/ILookupCode';
import { ParentSelect } from 'components/common/form/ParentSelect';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { FindMorePropertiesButton } from 'components/maps/FindMorePropertiesButton';
import { TableSort } from 'components/Table/TableSort';
import { Claims } from 'constants/claims';
import { Formik, getIn } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useLookupCodes from 'hooks/useLookupCodes';
import { useMyAgencies } from 'hooks/useMyAgencies';
import { useRouterFilter } from 'hooks/useRouterFilter';
import React, { useMemo, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useAppDispatch } from 'store';
import { fetchPropertyNames } from 'store/slices/hooks/propertyActionCreator';
import { mapLookupCode, mapLookupCodeWithParentString } from 'utils';
import { mapSelectOptionWithParent } from 'utils';
import { FilterBarSchema } from 'utils/YupSchema';

import { Form, Select } from '../../../components/common/form';
import { PropertyFilterOptions } from './';
import { IPropertyFilter } from './IPropertyFilter';
import { PropertyFilterAgencyOptions } from './PropertyFilterAgencyOptions';

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
  /** Override to trigger filterchanged in the parent */
  setTriggerFilterChanged?: (used: boolean) => void;
}

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
  setTriggerFilterChanged,
}) => {
  const [propertyFilter, setPropertyFilter] = React.useState<IPropertyFilter>(defaultFilter);
  const dispatch = useAppDispatch();
  const keycloak = useKeycloakWrapper();
  const lookupCodes = useLookupCodes();
  const [initialLoad, setInitialLoad] = useState(false);
  useRouterFilter({
    filter: propertyFilter,
    setFilter: (filter) => {
      onChange(filter);
      setPropertyFilter(filter);
    },
    key: 'propertyFilter',
    sort: sort,
    setSorting: onSorting,
  });

  const agencies = (agencyLookupCodes ?? []).map((c) =>
    mapLookupCodeWithParentString(c, agencyLookupCodes),
  );
  const classifications = lookupCodes.getPropertyClassificationOptions();
  const adminAreas = (adminAreaLookupCodes ?? []).map((c) => mapLookupCode(c));
  const [clear, setClear] = useState(false);
  const [options, setOptions] = useState([]);

  const initialValues = useMemo(() => {
    const values = { ...defaultFilter, ...propertyFilter };
    if (typeof values.agencies === 'string') {
      const agency = agencies.find(
        (x) => x.value.toString() === values.agencies?.toString(),
      ) as any;
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

    // Send data to SnowPlow.
    if (values.surplusFilter) {
      window.snowplow('trackSelfDescribingEvent', {
        schema: 'iglu:ca.bc.gov.pims/search/jsonschema/1-0-0',
        data: {
          view: 'surplus_properties',
          erp_properties: values.inEnhancedReferralProcess ?? false,
          spl_properties: values.inSurplusPropertyProgram ?? false,
          location: values.administrativeArea ?? '',
          project_name_number: values.projectNumber ?? '',
          lot_min: Number(values.minLotSize) ?? '',
          lot_max: Number(values.maxLotSize) ?? '',
          land_only: values.bareLandOnly ?? false,
          predominate_use: values.predominateUseId ?? '',
          net_usable: Number(values.rentableArea) ?? '',
        },
      });
    }
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
        //@ts-ignore The following line raises a linter error stating that there is no "autoComplete" prop, even though there is.
        <Form autoComplete="off">
          <Container fluid className="px-0 map-filter-container">
            <div className="flex-div">
              <FindMorePropertiesButton
                buttonText="Find available surplus properties"
                onEnter={() => {
                  setFindMoreOpen(true);
                  setFieldValue('surplusFilter', true);
                  setFieldValue('includeAllProperties', true);
                  !keycloak.hasClaim(Claims.ADMIN_PROPERTIES) &&
                    setFieldValue('agencies', undefined);
                }}
                onExit={() => {
                  setFindMoreOpen(false);
                  setFieldValue('surplusFilter', false);
                }}
              />

              <Row>
                <Col className="dropdown-col">
                  {showAllAgencySelect ? (
                    <PropertyFilterAgencyOptions disabled={findMoreOpen} agencies={agencies} />
                  ) : (
                    <ParentSelect
                      field="agencies"
                      options={myAgencies.map((c) => mapSelectOptionWithParent(c, myAgencies))}
                      filterBy={['code', 'label', 'parent']}
                      placeholder="My Agencies"
                      selectClosest
                      disabled={findMoreOpen}
                    />
                  )}
                </Col>
                <Col className="filter-col">
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
                      fetchPropertyNames()(dispatch).then((results) => {
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
                      getIn(values, 'name') !== e.target.value &&
                      setFieldValue('name', e.target.value)
                    }
                  />
                </Col>
                <Col className="filter-col">
                  <TypeaheadField
                    name="administrativeArea"
                    placeholder="Location"
                    selectClosest
                    hideValidation={true}
                    options={adminAreas.map((x) => x.label)}
                    onChange={(vals: any) => {
                      setFieldValue('administrativeArea', getIn(vals[0], 'name') ?? vals[0]);
                    }}
                    clearSelected={clear}
                    setClear={setClear}
                    disabled={findMoreOpen}
                  />
                </Col>
                <Col className="dropdown-col">
                  <PropertyFilterOptions disabled={findMoreOpen} />
                </Col>
                <Col className="filter-col">
                  <Select
                    field="classificationId"
                    placeholder="Classification"
                    options={classifications}
                    disabled={findMoreOpen}
                  />
                </Col>
              </Row>
              <div className="flex-div">
                <SearchButton
                  disabled={isSubmitting || findMoreOpen}
                  onClick={() => setTriggerFilterChanged && setTriggerFilterChanged(true)}
                />
                <ResetButton disabled={isSubmitting || findMoreOpen} onClick={resetFilter} />
              </div>
            </div>
          </Container>
        </Form>
      )}
    </Formik>
  );
};
