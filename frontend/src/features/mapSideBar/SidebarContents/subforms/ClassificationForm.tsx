import { FastSelect, SelectOptions } from 'components/common/form';
import { Label } from 'components/common/Label';
import TooltipIcon from 'components/common/TooltipIcon';
import { CLASSIFICATIONS } from 'constants/classifications';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

/**
 * component responsible for displaying classifcations of properties with conditional renders of information based on the classification selected.
 */

const Title = styled.h4`
  float: left;
`;

/** formated information box to display the classification definitions to the right of the select */
const InfoBox = styled.div`
  border: 1px solid #f2f2f2;
  border-radius: 4px;
  text-align: left;
  padding: 8px 12px 10px;
`;

/** formatted field description that will appear underneath the select input */
const FieldDescription = styled.p`
  margin-left: 152px;
  font-size: 12px;
  width: 250px;
  text-align: left;
`;

/** used to conditionally render the information display box with the desired content */
const InfoBoxWithContent = (content: string) => {
  return (
    <InfoBox>
      <p style={{ fontSize: '11px' }}>{content}</p>
    </InfoBox>
  );
};

interface IClassificationFormProps {
  /** title to be displayed at the top of the form */
  title?: string;
  /** the classification set to be used with the component, could vary by form */
  classifications: SelectOptions;
  /** the field label for the select options (eg) Building Classification/Land Classification */
  fieldLabel?: string;
  /** pass down the appropriate field to edit */
  field: string;
  /** pass a tooltip for the classification field */
  toolTip?: string;
  /** enter a brief description if desired regarding the select options */
  fieldDescription?: string;
}

export const ClassificationForm: React.FC<IClassificationFormProps> = ({
  title,
  classifications,
  fieldLabel,
  field,
  toolTip,
  fieldDescription,
}) => {
  const formikProps = useFormikContext();

  /** classId based on current formik values to determine which classsification information box to display */
  let classId = getIn(formikProps.values, field);

  const renderInfo = () => {
    switch (classId) {
      case CLASSIFICATIONS.CoreOperational:
        return InfoBoxWithContent('Core Operational');
      case CLASSIFICATIONS.CoreStrategic:
        return InfoBoxWithContent('Core Strategic');
      case CLASSIFICATIONS.SurplusActive:
        return InfoBoxWithContent('Surplus Actice');
      case CLASSIFICATIONS.SurplusEncumbered:
        return InfoBoxWithContent('Surplus Encumbered');
    }
  };

  return (
    <>
      <Row>
        <Title>{title}</Title>
      </Row>
      <Row>
        <Col md={6}>
          <Row style={{ display: 'flex' }}>
            <Label required>{fieldLabel}</Label>
            <FastSelect
              formikProps={formikProps}
              type="number"
              style={{ marginTop: '5px', display: 'flex' }}
              placeholder="Must Select One"
              field={field}
              options={classifications}
            />
            {toolTip && (
              <div style={{ marginTop: '8px', marginLeft: '20px' }}>
                <TooltipIcon toolTip={toolTip} toolTipId="classificationToolTip" />
              </div>
            )}
          </Row>
          {fieldDescription && (
            <Row>
              <FieldDescription>{fieldDescription}</FieldDescription>
            </Row>
          )}
        </Col>
        <Col md={6}>{renderInfo()}</Col>
      </Row>
    </>
  );
};
