import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { Select, SelectOption } from '../../../components/common/form';
import { IPropertyFilter } from './IPropertyFilter';
import { ParentSelect } from 'components/common/form/ParentSelect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Claims } from 'constants/claims';

interface IPropertyFilterAgencyOptions {
  disabled?: boolean;
  agencies: SelectOption[];
}

/**
 * Provides a dropdown that populates includeAllProperties and controls the agencies input.
 */
export const PropertyFilterAgencyOptions: React.FC<IPropertyFilterAgencyOptions> = ({
  disabled,
  agencies,
}) => {
  const state: { options: any[] } = {
    options: [
      { label: 'My Agencies', value: false },
      { label: 'All Government', value: true },
    ],
  };
  const {
    setFieldValue,
    values: { includeAllProperties },
  } = useFormikContext<IPropertyFilter>();
  const keycloak = useKeycloakWrapper();

  useEffect(() => {
    if (includeAllProperties === false) {
      setFieldValue('agencies', keycloak.agencyId);
    }
  }, [includeAllProperties, keycloak.agencyId, setFieldValue]);

  // access the form context values, no need to pass props

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('includeAllProperties', event.target.value === 'true');
    setFieldValue('agencies', '');
  };

  return (
    <>
      <Select
        field="includeAllProperties"
        options={state.options}
        onChange={onChange}
        disabled={disabled}
      />
      <ParentSelect
        field="agencies"
        options={agencies}
        filterBy={['code', 'label', 'parent']}
        placeholder={includeAllProperties ? '' : 'Agency'}
        selectClosest
        disabled={(disabled || includeAllProperties) && !keycloak.hasClaim(Claims.ADMIN_PROPERTIES)}
      />
    </>
  );
};
