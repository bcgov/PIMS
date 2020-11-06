import { useCallback } from 'react';
import React from 'react';
import { FormikProps } from 'formik';
import { Form, InputGroup, FastInput } from 'components/common/form';
import { currentZoningTooltip, potentialZoningTooltip } from '../strings';

interface LandProps {
  nameSpace?: string;
  disabled?: boolean;
}

export const defaultLandValues = {
  landArea: '',
  zoning: '',
  zoningPotential: '',
};

const LandForm = <T extends any>(props: LandProps & FormikProps<T>) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  return (
    <>
      <Form.Row>
        <Form.Label className="required">Lot Size</Form.Label>
        <InputGroup
          displayErrorTooltips
          fast={true}
          disabled={props.disabled}
          type="number"
          field={withNameSpace('landArea')}
          formikProps={props}
          postText="Hectares"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label>Current Zoning</Form.Label>
        <FastInput
          tooltip={currentZoningTooltip}
          formikProps={props}
          disabled={props.disabled}
          field={withNameSpace('zoning')}
        />
      </Form.Row>
      <Form.Row>
        <Form.Label>Potential Zoning</Form.Label>
        <FastInput
          tooltip={potentialZoningTooltip}
          formikProps={props}
          disabled={props.disabled}
          field={withNameSpace('zoningPotential')}
        />
      </Form.Row>
    </>
  );
};

export default LandForm;
