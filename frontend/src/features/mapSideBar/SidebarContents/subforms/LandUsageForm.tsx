import './LandUsageForm.scss';

import { FastInput } from 'components/common/form';
import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { FormikProps, useFormikContext, getIn } from 'formik';
import { Label } from 'components/common/Label';
import { ClassificationForm } from './ClassificationForm';
import GenericModal from 'components/common/GenericModal';

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
  const { values, initialValues } = useFormikContext();
  const [showSurplusActiveWarning, setShowSurplusActiveWarning] = useState(false);
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );

  const classificationId = getIn(values, withNameSpace('classificationId'));
  const initialClassificationId = getIn(initialValues, withNameSpace('classificationId'));
  const buildings = getIn(values, withNameSpace('buildings'));
  useEffect(() => {
    if (initialClassificationId !== classificationId && buildings.length > 0) {
      setShowSurplusActiveWarning(true);
    }
  }, [buildings.length, classificationId, initialClassificationId]);

  return (
    <Container>
      <ClassificationForm
        field={withNameSpace('classificationId')}
        encumbranceField={withNameSpace('encumbranceReason')}
        fieldLabel="Parcel Classification"
        classifications={props.classifications}
        title="Strategic Real Estate Classification"
        disabled={props.disabled}
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
      <GenericModal
        title="Land Classification Changed"
        message="Remember to update any buildings to this new classification as well."
        display={showSurplusActiveWarning}
        setDisplay={setShowSurplusActiveWarning}
        okButtonText="Ok"
        handleOk={() => setShowSurplusActiveWarning(false)}
        handleCancel={() => setShowSurplusActiveWarning(false)}
      />
    </Container>
  );
};
