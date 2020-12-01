import './LandUsageForm.scss';

import { FastSelect, FastInput } from 'components/common/form';
import React, { useCallback } from 'react';
import { Container, Row } from 'react-bootstrap';
import { FormikProps, useFormikContext } from 'formik';
import { Label } from 'components/common/Label';
import { ClassificationForm } from './ClassificationForm';

interface ILandUsageProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
  verticalLine?: boolean;
}

export const LandUsageForm = <T extends any>(props: ILandUsageProps & FormikProps<T>) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );
  const formikProps = useFormikContext();

  return (
    <Container>
      <ClassificationForm
        field={withNameSpace('classificationId')}
        fieldLabel="Parcel Classification"
        classifications={props.classifications}
        title="Strategic Real Estate Classification"
        toolTip="Placeholder"
      />
      <hr></hr>
      <Row>
        <h4>Zoning</h4>
      </Row>
      <Row className="field-row">
        <Label>Current Zoning</Label>
        {props.verticalLine && <span className="vl"></span>}
        <FastInput formikProps={props} disabled={props.disabled} field={withNameSpace('zoning')} />
      </Row>
      <Row className="field-row">
        <Label>Potential Zoning</Label>
        {props.verticalLine && <span className="vl"></span>}
        <FastInput
          formikProps={props}
          disabled={props.disabled}
          field={withNameSpace('zoningPotential')}
        />
      </Row>
    </Container>
  );
};
