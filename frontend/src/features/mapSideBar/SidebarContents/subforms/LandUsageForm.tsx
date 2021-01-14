import './LandUsageForm.scss';

import { FastInput } from 'components/common/form';
import React, { useCallback } from 'react';
import { Container, Row } from 'react-bootstrap';
import { FormikProps } from 'formik';
import { Label } from 'components/common/Label';
import { ClassificationForm } from './ClassificationForm';
import { ClassificationSelectionText } from 'features/properties/components/forms/strings';

interface ILandUsageProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
}

/**
 * Display land classification and municipality fields.
 * @param {ILandUsageProps} props
 */
export const LandUsageForm = <T extends any>(props: ILandUsageProps & FormikProps<T>) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  return (
    <Container>
      <ClassificationForm
        field={withNameSpace('classificationId')}
        encumbranceField={withNameSpace('encumbranceReason')}
        fieldLabel="Parcel Classification"
        classifications={props.classifications}
        title="Strategic Real Estate Classification"
        toolTip="Placeholder"
        disabled={props.disabled}
        fieldDescription={ClassificationSelectionText}
      />
      <hr></hr>
      <Row>
        <h4>Zoning</h4>
      </Row>
      <Row className="field-row">
        <Label>Current Zoning</Label>
        <FastInput formikProps={props} disabled={props.disabled} field={withNameSpace('zoning')} />
      </Row>
      <Row className="field-row">
        <Label>Potential Zoning</Label>
        <FastInput
          formikProps={props}
          disabled={props.disabled}
          field={withNameSpace('zoningPotential')}
        />
      </Row>
    </Container>
  );
};
