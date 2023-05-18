import { FastInput, Form, InputGroup } from 'components/common/form';
import { FormikProps } from 'formik';
import { useCallback } from 'react';
import React from 'react';

interface LandProps {
  nameSpace?: string;
  disabled?: boolean;
}

interface ILandFormValues {
  landArea: number | '';
  zoning: string;
  zoningPotential: string;
}

export const defaultLandValues: ILandFormValues = {
  landArea: '',
  zoning: '',
  zoningPotential: '',
};

const LandForm = <T,>(props: LandProps & FormikProps<T>) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  return (
    <>
      <Form.Group>
        <Form.Label>Lot Size</Form.Label>
        <InputGroup
          required
          displayErrorTooltips
          fast={true}
          disabled={props.disabled}
          type="number"
          field={withNameSpace('landArea')}
          formikProps={props}
          postText="Hectares"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Current Zoning</Form.Label>
        <FastInput formikProps={props} disabled={props.disabled} field={withNameSpace('zoning')} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Potential Zoning</Form.Label>
        <FastInput
          formikProps={props}
          disabled={props.disabled}
          field={withNameSpace('zoningPotential')}
        />
      </Form.Group>
    </>
  );
};

export default LandForm;
