import './IdentificationForm.scss';

import { FastSelect, FastInput, SelectOptions, Check } from 'components/common/form';
import { Label } from 'components/common/Label';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import InformationForm from 'features/properties/components/forms/subforms/InformationForm';
import LatLongForm from 'features/properties/components/forms/subforms/LatLongForm';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { senstiveTooltip as sensitiveTooltip } from '../../../../../src/features/properties/components/forms/strings';
import { HARMFUL_DISCLOSURE_URL } from 'constants/strings';

interface IIdentificationProps {
  agencies: SelectOptions;
  classifications: SelectOptions;
  predominateUses: SelectOptions;
  constructionType: SelectOptions;
  formikProps: any;
  nameSpace?: any;
  index?: any;
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
  index,
}) => {
  const withNameSpace: Function = React.useCallback(
    (name?: string) => {
      return [nameSpace ?? '', `${index ?? ''}`, name].filter(x => x).join('.');
    },
    [nameSpace, index],
  );
  return (
    <Container>
      <Row>
        <h4>Building Identification</h4>
      </Row>
      <Row>
        <Col>
          <InformationForm isAdmin agencies={agencies} classifications={classifications} />
        </Col>
        <Col>
          <Row>
            <Label>Main Usage</Label>
            <FastSelect
              formikProps={formikProps}
              // disabled={disabled || readonly}
              placeholder="Must Select One"
              field={withNameSpace('buildingPredominateUseId')}
              type="number"
              options={predominateUses}
            />
          </Row>
          <Row>
            <Label>Construction Type</Label>
            <FastSelect
              formikProps={formikProps}
              // disabled={props.disabled || readonly}
              placeholder="Must Select One"
              field={withNameSpace('buildingConstructionTypeId')}
              type="number"
              options={constructionType}
            />
          </Row>
          <Row>
            <Label>Number of Floors</Label>
            <FastInput
              displayErrorTooltips
              className="input-small"
              formikProps={formikProps}
              field={withNameSpace('buildingFloorCount')}
              type="number"
            />
          </Row>
          <Row>
            <Label>SPP</Label>
            <FastInput formikProps={formikProps} field="spp" />
          </Row>
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
                // disabled={disabled}
                field={withNameSpace('isSensitive')}
                radioLabelOne="Yes"
                radioLabelTwo="No"
              />
            </div>
          </Row>
        </Col>
      </Row>
      <hr></hr>
      <Row>
        <Col>
          <AddressForm {...formikProps} />
        </Col>
        <Col>
          <LatLongForm
            {...formikProps}
            setMovingPinNameSpace={setMovingPinNameSpace}
            nameSpace="building"
          />
        </Col>
      </Row>
    </Container>
  );
};
