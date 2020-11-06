import { useCallback } from 'react';
import React from 'react';
import { FormikProps } from 'formik';
import { Form, FastInput } from 'components/common/form';
import { IGeocoderResponse } from 'hooks/useApi';
import { latitudeTooltip } from '../strings';

interface LatLongFormProps {
  nameSpace?: string;
  disabled?: boolean;
  onGeocoderChange?: (data: IGeocoderResponse) => void;
}

export const defaultLatLongValues: any = {
  latitude: '',
  longitude: '',
};
const LatLongForm = <T extends any>(props: LatLongFormProps & FormikProps<T>) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  return (
    <>
      <Form.Row>
        <Form.Label className="required">Latitude</Form.Label>
        <FastInput
          displayErrorTooltips
          tooltip={latitudeTooltip}
          formikProps={props}
          disabled={props.disabled}
          type="number"
          field={withNameSpace('latitude')}
        />
      </Form.Row>
      <Form.Row>
        <Form.Label className="required">Longitude</Form.Label>
        <FastInput
          displayErrorTooltips
          formikProps={props}
          disabled={props.disabled}
          type="number"
          field={withNameSpace('longitude')}
        />
      </Form.Row>
    </>
  );
};

export default LatLongForm;
