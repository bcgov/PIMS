import './LandReviewPage.scss';

import {
  FastInput,
  Input,
  TextArea,
  InputGroup,
  FastCurrencyInput,
  Check,
  FastSelect,
} from 'components/common/form';
import React, { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { Label } from 'components/common/Label';
import { FaEdit } from 'react-icons/fa';
import { LandSvg } from 'components/common/Icons';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { noop } from 'lodash';
import styled from 'styled-components';
import { ParentSelect } from 'components/common/form/ParentSelect';

interface IReviewProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
  agencies: any;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string) => void;
}

const LinkButton = styled.span`
  background: none;
  border: none;
  padding: 0;
  color: #069;
  text-decoration: underline;
`;

export const LandReviewPage: React.FC<any> = (props: IReviewProps) => {
  const defaultEditValues = {
    identification: true,
    usage: true,
    valuation: true,
  };
  const [editInfo, setEditInfo] = useState(defaultEditValues);
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );
  const formikProps = useFormikContext();
  const projectNumber = getIn(formikProps.values, withNameSpace('projectNumber'));

  return (
    <Container className="review-section">
      <Row className="review-steps">
        <h4>Review your land info</h4>
        <p>
          Please review the information you have entered. You can edit it by clicking on the edit
          icon for each section. When you are satisfied that the infomation provided is correct,
          click the submit button to save this information to the PIMS inventory.
        </p>
      </Row>
      <Row>
        <Col md={6}>
          <Row>
            <div className="identification">
              <Row className="section-header">
                <span>
                  <LandSvg className="svg" />
                  <h5>Parcel Identification</h5>
                </span>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() =>
                    setEditInfo({ ...defaultEditValues, identification: !editInfo.identification })
                  }
                />
              </Row>
              <Row className="content-item">
                <Label>Agency</Label>
                <ParentSelect
                  field={withNameSpace('agencyId')}
                  options={props.agencies}
                  filterBy={['code', 'label', 'parent']}
                  disabled={editInfo.identification}
                />
              </Row>
              <Row className="content-item">
                <Label>Name</Label>
                <Input disabled={editInfo.identification} field={withNameSpace('name')} />
              </Row>
              <Row className="content-item">
                <Label>Description</Label>
                <TextArea disabled={editInfo.identification} field={withNameSpace('description')} />
              </Row>

              <AddressForm
                onGeocoderChange={noop}
                {...formikProps}
                disabled={editInfo.identification}
                nameSpace={withNameSpace('address')}
              />
              <p className="break"></p>
              <Row className="content-item">
                <Label>PID/PIN</Label>
                <Input
                  displayErrorTooltips
                  className="input-small"
                  disabled={editInfo.identification}
                  field={
                    (formikProps.values as any).data.pid
                      ? withNameSpace('pid')
                      : withNameSpace('pin')
                  }
                />
              </Row>
              <Row className="content-item">
                <Label>Lot Size</Label>

                <InputGroup
                  displayErrorTooltips
                  fast={true}
                  disabled={editInfo.identification}
                  type="number"
                  field={withNameSpace('landArea')}
                  formikProps={formikProps}
                  postText="Hectares"
                />
              </Row>
              <Row className="content-item">
                <Label>Latitude</Label>
                <FastInput
                  className="input-medium"
                  displayErrorTooltips
                  // tooltip={latitudeTooltip}
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  type="number"
                  field={withNameSpace('latitude')}
                />
              </Row>
              <Row className="content-item">
                <Label>Longitude</Label>
                <FastInput
                  className="input-medium"
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  type="number"
                  field={withNameSpace('longitude')}
                />
              </Row>
              {!!projectNumber && (
                <Row className="content-item">
                  <Label>SPP</Label>
                  <LinkButton>
                    {
                      projectNumber //TODO: make this a proper link when PA-1974 is fixed
                    }
                  </LinkButton>
                </Row>
              )}
              <br></br>
              <Row className="harmful">
                <Label>Harmful info if released?</Label>
                <Check
                  type="radio"
                  field={withNameSpace('isSensitive')}
                  radioLabelOne="Yes"
                  radioLabelTwo="No"
                  disabled={editInfo.identification}
                />
              </Row>
            </div>
          </Row>
        </Col>
        <Col md={6}>
          <Row>
            <div className="usage">
              <Row className="section-header">
                <span>
                  <LandSvg className="svg" />
                  <h5>Usage</h5>
                </span>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() => setEditInfo({ ...defaultEditValues, usage: !editInfo.usage })}
                />
              </Row>
              <Row className="classification field-row">
                <Label>Classification</Label>
                <FastSelect
                  formikProps={formikProps}
                  disabled={editInfo.usage}
                  type="number"
                  placeholder="Must Select One"
                  field={withNameSpace('classificationId')}
                  options={props.classifications}
                />
              </Row>
              <Row className="field-row">
                <Label>Current Zoning</Label>
                <FastInput
                  formikProps={formikProps}
                  disabled={editInfo.usage}
                  field={withNameSpace('zoning')}
                />
              </Row>
              <Row className="field-row">
                <Label>Potential Zoning</Label>
                <FastInput
                  formikProps={formikProps}
                  disabled={editInfo.usage}
                  field={withNameSpace('zoningPotential')}
                />
              </Row>
            </div>
          </Row>
          <Row className="content-item">
            <div className="valuation">
              <Row className="section-header">
                <span>
                  <LandSvg className="svg" />
                  <h5>Valuation</h5>
                </span>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() =>
                    setEditInfo({ ...defaultEditValues, valuation: !editInfo.valuation })
                  }
                />
              </Row>
              <Row className="val-row">
                <Label>Net Book Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace('financials.0.netbook.value')}
                  disabled={editInfo.valuation}
                />
              </Row>
              <Row className="val-row">
                <Label>Assessed Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace('financials.0.assessed.value')}
                  disabled={editInfo.valuation}
                />
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
