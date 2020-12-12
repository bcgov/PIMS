import './PropertyFilter.scss';

import React, { useMemo } from 'react';
import { Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { ILookupCode } from 'actions/lookupActions';
import { Form, Select, Input, SelectOption } from '../../../components/common/form';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';
import SppButton from 'components/common/form/SppButton';
import { FilterBarSchema } from 'utils/YupSchema';
import ResetButton from 'components/common/form/ResetButton';
import SearchButton from 'components/common/form/SearchButton';
import { mapLookupCodeWithParentString } from 'utils';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { PropertyFilterOptions } from './';
import { useRouterFilter } from 'hooks/useRouterFilter';
import { IPropertyFilter } from './IPropertyFilter';

export type PropertyFilterProps = {
  defaultFilter: IPropertyFilter;
  agencyLookupCodes: ILookupCode[];
  propertyClassifications: ILookupCode[];
  onChange: (filter: IPropertyFilter) => void;
};

/**
 * Property filter bar to search for properties.
 */
export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  defaultFilter,
  agencyLookupCodes,
  propertyClassifications,
  onChange,
}) => {
  const [propertyFilter, setPropertyFilter] = React.useState<IPropertyFilter>(defaultFilter);
  useRouterFilter(
    propertyFilter,
    filter => {
      onChange(filter);
      setPropertyFilter(filter);
    },
    'propertyFilter',
  );
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
  const keycloak = useKeycloakWrapper();
  let formikRef = React.useRef<any>() as any;

  const initialValues = useMemo(() => {
    const values = { ...defaultFilter, ...propertyFilter };
    if (typeof values.agencies === 'string') {
      const agency = agencies.find(x => x.value.toString() === values.agencies?.toString()) as any;
      if (agency) {
        values.agencies = agency;
      }
    }
    return values;
  }, [agencies, propertyFilter, defaultFilter]);

  const applyEnhancedReferralFilter = () => {
    const values: IPropertyFilter = { ...formikRef!.values };
    values.inEnhancedReferralProcess = 'true';
    values.inSurplusPropertyProgram = 'false';
    changeFilter(values);
  };

  const applySurplusPropertyFilter = () => {
    const values: IPropertyFilter = { ...formikRef!.values };
    values.inSurplusPropertyProgram = 'true';
    values.inEnhancedReferralProcess = 'false';
    changeFilter(values);
  };

  const changeFilter = (values: IPropertyFilter) => {
    const agencyIds = (values.agencies as any)?.value ?? '';
    setPropertyFilter({ ...values, agencies: agencyIds });
    onChange?.({ ...values, agencies: agencyIds });
  };

  const resetFilter = () => {
    changeFilter(defaultFilter);
  };

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
      innerRef={ref => (formikRef = ref)}
    >
      {({ isSubmitting, handleReset, handleSubmit, setFieldValue, values }) => (
        <Form>
          <Form.Row className="map-filter-bar align-items-start">
            <Col className="bar-item">
              <PropertyFilterOptions />
            </Col>
            <Col className="agency-item">
              <ParentSelect
                field="agencies"
                options={agencies}
                filterBy={['code', 'label', 'parent']}
                placeholder="Enter an Agency"
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
                  inEnhancedReferralProcess={values.inEnhancedReferralProcess === 'true'}
                  inSurplusPropertyProgram={values.inSurplusPropertyProgram === 'true'}
                />
              </Col>
            )}
            <Col className="bar-item flex-grow-0">
              <SearchButton disabled={isSubmitting} />
            </Col>
            <Col className="bar-item flex-grow-0">
              <ResetButton disabled={isSubmitting} onClick={resetFilter} />
            </Col>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};

export default PropertyFilter;
