import { ParentSelect } from 'components/common/form/ParentSelect';
import { Claims } from 'constants/claims';
import { useFormikContext } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { useEffect } from 'react';

import { Select, SelectOption } from '../../../components/common/form';
import { IPropertyFilter } from './IPropertyFilter';

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
  const { setFieldValue } = useFormikContext<IPropertyFilter>();
  let {
    values: { includeAllProperties },
  } = useFormikContext<IPropertyFilter>();
  const keycloak = useKeycloakWrapper();

  useEffect(() => {
    if (includeAllProperties === false) {
      setFieldValue('agencies', keycloak.agencyId);
    }
  }, [includeAllProperties, keycloak.agencyId, setFieldValue]);

  // access the form context values, no need to pass props

  const onChange = (event: any) => {
    setFieldValue('includeAllProperties', event.target.value === 'true');
    setFieldValue('agencies', '');
  };

  if (typeof includeAllProperties !== 'boolean') includeAllProperties = false;

  return (
    <div className="agency-container">
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
    </div>
  );
};
