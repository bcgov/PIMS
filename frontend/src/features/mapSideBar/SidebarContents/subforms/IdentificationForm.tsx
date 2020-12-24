import './IdentificationForm.scss';

import { FastSelect, FastInput, SelectOptions, Check } from 'components/common/form';
import { Label } from 'components/common/Label';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import InformationForm from 'features/properties/components/forms/subforms/InformationForm';
import LatLongForm from 'features/properties/components/forms/subforms/LatLongForm';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import {
  ClassificationSelectionText,
  sensitiveTooltip,
} from '../../../../../src/features/properties/components/forms/strings';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';
import { ClassificationForm } from './ClassificationForm';

interface IIdentificationProps {
  /** passed down from parent to lock/unlock designated fields */
  isAdmin?: boolean;
  /** the agencies for the form to use */
  agencies: SelectOptions;
  /** the classification for the form to use */
  classifications: SelectOptions;
  /** the predominate uses for the form to use */
  predominateUses: SelectOptions;
  /** the construction types for the form to use */
  constructionType: SelectOptions;
  /** access formik context */
  formikProps: any;
  /** nameSpace passed down to access desired field */
  nameSpace?: any;
  /** used to determine which marker to set the cursor to when adding a new property */
  setMovingPinNameSpace: (nameSpace: string) => void;
}

export const IdentificationForm: React.FC<IIdentificationProps> = ({
  formikProps,
  agencies,
  classifications,
  predominateUses,
  constructionType,
  nameSpace,
  setMovingPinNameSpace,
  isAdmin,
}) => {
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', name].filter(x => x).join('.');
    },
    [nameSpace],
  );
  return (
    <Container>
      <Row>
        <h4>Building Information</h4>
      </Row>
      <Row>
        <Col>
          <InformationForm
            isAdmin={!!isAdmin}
            wizard
            agencies={agencies}
            classifications={classifications}
            nameSpace={withNameSpace('')}
          />
        </Col>
        <Col>
          <Row>
            <Label>Main Usage</Label>
            <FastSelect
              formikProps={formikProps}
              placeholder="Must Select One"
              field={withNameSpace('buildingPredominateUseId')}
              type="number"
              options={predominateUses}
              required
            />
          </Row>
          <Row>
            <Label>Construction Type</Label>
            <FastSelect
              formikProps={formikProps}
              placeholder="Must Select One"
              field={withNameSpace('buildingConstructionTypeId')}
              type="number"
              options={constructionType}
              required
            />
          </Row>
          <Row>
            <Label>Number of Floors</Label>
            <FastInput
              displayErrorTooltips
              style={{ width: '100px' }}
              className="input-small"
              formikProps={formikProps}
              field={withNameSpace('buildingFloorCount')}
              type="number"
            />
          </Row>
          {(formikProps.values as any).data.projectNumber && (
            <Row>
              <Label>SPP</Label>
              <FastInput disabled formikProps={formikProps} field="projectNumber" />
            </Row>
          )}
          <Row>
            <Label></Label>
            <div className="input-medium harmful">
              <p>
                Would this information be harmful if released?&nbsp;
                <TooltipWrapper toolTipId="sensitive-harmful" toolTip={sensitiveTooltip}>
                  <a target="_blank" rel="noopener noreferrer" href={HARMFUL_DISCLOSURE_URL}>
                    Policy
                  </a>
                </TooltipWrapper>
              </p>
              <Check
                type="radio"
                field={withNameSpace('isSensitive')}
                radioLabelOne="Yes"
                radioLabelTwo="No"
              />
            </div>
          </Row>
        </Col>
      </Row>
      <hr></hr>
      <ClassificationForm
        field={withNameSpace('classificationId')}
        fieldLabel="Building Classification"
        classifications={classifications}
        title="Strategic Real Estate Classification"
        fieldDescription={ClassificationSelectionText}
      />
      <hr></hr>
      <Row>
        <h4>Location</h4>
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <Col>
          <AddressForm {...formikProps} nameSpace={withNameSpace('address')} />
        </Col>
        <Col>
          <LatLongForm
            {...formikProps}
            building
            setMovingPinNameSpace={setMovingPinNameSpace}
            nameSpace={withNameSpace('')}
          />
        </Col>
      </Row>
    </Container>
  );
};
