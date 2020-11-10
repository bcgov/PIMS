import { useCallback } from 'react';
import React from 'react';
import { FormikProps } from 'formik';
import { Form, FastInput } from 'components/common/form';
import { latitudeTooltip } from '../strings';
import { ReactComponent as BuildingDraftIcon } from 'assets/images/draft-building-icon.svg';
import { ReactComponent as ParcelDraftIcon } from 'assets/images/draft-parcel-icon.svg';
import styled from 'styled-components';

interface LatLongFormProps {
  setMovingPinNameSpace: (nameSpace: string) => void;
  nameSpace?: string;
  disabled?: boolean;
}

export const defaultLatLongValues: any = {
  latitude: '',
  longitude: '',
};

const DraftMarkerButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border: 0px;
  display: flex;
  p {
    width: 35px;
    margin: 0;
  }
`;

const LatLongForm = <T extends any>(props: LatLongFormProps & FormikProps<T>) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  return (
    <div style={{ position: 'relative' }}>
      <Form.Row>
        <Form.Label className="required">Latitude</Form.Label>
        <FastInput
          className="input-medium"
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
          className="input-medium"
          displayErrorTooltips
          formikProps={props}
          disabled={props.disabled}
          type="number"
          field={withNameSpace('longitude')}
        />
      </Form.Row>
      <DraftMarkerButton
        disabled={props.disabled}
        onClick={(e: any) => {
          props.setMovingPinNameSpace(props.nameSpace ?? '');
          e.preventDefault();
        }}
      >
        <p>Place Pin</p>
        {props?.nameSpace?.includes('building') === true ? (
          <BuildingDraftIcon />
        ) : (
          <ParcelDraftIcon />
        )}
      </DraftMarkerButton>
    </div>
  );
};

export default LatLongForm;
