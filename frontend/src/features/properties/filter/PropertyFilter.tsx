import './PropertyFilter.scss';

import React, { useMemo, useState } from 'react';
import { Col } from 'react-bootstrap';
import { Formik, getIn } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Select, SelectOption } from '../../../components/common/form';
import { FilterBarSchema } from 'utils/YupSchema';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import { mapLookupCodeWithParentString } from 'utils';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { PropertyFilterOptions } from './';
import { useRouterFilter } from 'hooks/useRouterFilter';
import { IPropertyFilter } from './IPropertyFilter';
import { TableSort } from 'components/Table/TableSort';
import { FindMorePropertiesButton } from 'components/maps/FindMorePropertiesButton';
import { TypeaheadField } from 'components/common/form/Typeahead';

/**
 * PropertyFilter component properties.
 */
export interface IPropertyFilterProps {
  /** The default filter to apply if a different one hasn't been set in the URL or stored in redux. */
  defaultFilter: IPropertyFilter;
  /** An array of agency lookup codes. */
  agencyLookupCodes: ILookupCode[];
  /** An array of classification codes. */
  propertyClassifications: ILookupCode[];
  /** An array of administrative area codes. */
  adminAreaLookupCodes: ILookupCode[];
  /** Callback event when the filter is changed during Mount. */
  onChange: (filter: IPropertyFilter) => void;
  /** Comma separated list of column names to sort by. */
  sort?: TableSort<any>;
  /** Event fire when sorting changes. */
  onSorting?: (sort: TableSort<any>) => void;
}

/**
 * Property filter bar to search for properties.
 * Applied filter will be added to the URL query parameters and stored in a redux store.
 */
export const PropertyFilter: React.FC<IPropertyFilterProps> = ({
  defaultFilter,
  agencyLookupCodes,
  adminAreaLookupCodes,
  propertyClassifications,
  onChange,
  sort,
  onSorting,
}) => {
  const [propertyFilter, setPropertyFilter] = React.useState<IPropertyFilter>(defaultFilter);
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
  const mapLookupCode = (code: ILookupCode): SelectOption => ({
    label: code.name,
    value: code.id.toString(),
    code: code.code,
    parentId: code.parentId,
  });
  const agencies = (agencyLookupCodes ?? []).map(c =>
    mapLookupCodeWithParentString(c, agencyLookupCodes),
  );
  const classifications = (propertyClassifications ?? []).map(c => mapLookupCode(c));
  const adminAreas = (adminAreaLookupCodes ?? []).map(c => mapLookupCode(c));
  const [clear, setClear] = useState(false);

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
  }, [agencies, propertyFilter, defaultFilter]);

  const changeFilter = (values: IPropertyFilter) => {
    const agencyIds = (values.agencies as any)?.value ?? '';
    setPropertyFilter({ ...values, agencies: agencyIds });
    onChange?.({ ...values, agencies: agencyIds });
  };

  const resetFilter = () => {
    changeFilter(defaultFilter);
    setClear(true);
  };

  const [findMoreOpen, setFindMoreOpen] = useState(false);

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
      {({ isSubmitting, handleReset, handleSubmit, setFieldValue, values }) => (
        <Form>
          <Form.Row className="map-filter-bar">
            <FindMorePropertiesButton
              buttonText="Find available surplus properties"
              onEnter={() => setFindMoreOpen(true)}
              onExit={() => setFindMoreOpen(false)}
            />
            <div className="vl"></div>
            <Col className="bar-item">
              <PropertyFilterOptions disabled={findMoreOpen} />
            </Col>
            <Col className="map-filter-typeahead">
              <TypeaheadField
                name="administrativeArea"
                placeholder="Enter a location"
                selectClosest
                paginate={false}
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
            <Col className="agency-item">
              <ParentSelect
                field="agencies"
                options={agencies}
                filterBy={['code', 'label', 'parent']}
                placeholder="Agency"
                selectClosest
                disabled={findMoreOpen}
              />
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
