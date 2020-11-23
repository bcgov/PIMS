import './LandReviewPage.scss';

import {
  FastInput,
  Input,
  TextArea,
  InputGroup,
  AutoCompleteText,
  FastCurrencyInput,
  Check,
} from 'components/common/form';
import React, { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Label } from 'components/common/Label';
import { FaEdit } from 'react-icons/fa';
import { LandSvg } from 'components/common/Icons';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { noop } from 'lodash';
import { LandUsageForm } from './LandUsageForm';

interface IReviewProps {
  nameSpace?: string;
  disabled?: boolean;
  classifications: any;
  agencies: any;
}

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
      <Row noGutters>
        <Col md={6}>
          <div className="identification">
            <Row className="identification-header">
              <LandSvg className="svg" />
              <h5>Parcel Identification</h5>
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
              <span className="vl"></span>
              <AutoCompleteText
                field={withNameSpace('data.agencyId')}
                options={props.agencies}
                disabled={editInfo.identification}
              />
            </Row>
            <Row className="content-item">
              <Label>Name</Label>
              <span className="vl"></span>
              <Input disabled={editInfo.identification} field={withNameSpace('data.name')} />
            </Row>
            <Row className="content-item">
              <Label>Description</Label>
              <span className="vl"></span>
              <TextArea
                disabled={editInfo.identification}
                field={withNameSpace('data.description')}
              />
            </Row>

            <AddressForm
              verticalLine
              onGeocoderChange={noop}
              {...formikProps}
              disabled={editInfo.identification}
              nameSpace="data.address"
            />
            <p className="break"></p>
            <Row className="content-item">
              <Label>Lot Size</Label>
              <span className="vl"></span>

              <InputGroup
                displayErrorTooltips
                fast={true}
                disabled={editInfo.identification}
                type="number"
                field={withNameSpace('data.landArea')}
                formikProps={formikProps}
                postText="Hectares"
              />
            </Row>
            <Row className="content-item">
              <Label>Latitude</Label>
              <span className="vl"></span>
              <FastInput
                className="input-medium"
                displayErrorTooltips
                // tooltip={latitudeTooltip}
                formikProps={formikProps}
                disabled={editInfo.identification}
                type="number"
                field={withNameSpace('data.latitude')}
              />
            </Row>
            <Row className="content-item">
              <Label>Longitude</Label>
              <span className="vl"></span>
              <FastInput
                className="input-medium"
                displayErrorTooltips
                formikProps={formikProps}
                disabled={editInfo.identification}
                type="number"
                field={withNameSpace('data.longitude')}
              />
            </Row>
            <Row className="content-item">
              <Label>SPP</Label>
              <span className="vl"></span>
              <FastInput
                className="input-medium"
                displayErrorTooltips
                formikProps={formikProps}
                disabled={editInfo.identification}
                type="text"
                field={withNameSpace('data.projectNumber')}
              />
            </Row>
            <br></br>
            <Row className="harmful">
              <Label>Harmful info if released?</Label>
              <Check
                type="radio"
                field={withNameSpace('data.isSensitive')}
                radioLabelOne="Yes"
                radioLabelTwo="No"
                disabled={editInfo.identification}
              />
            </Row>
          </div>
        </Col>
        <Col md={5}>
          <Row>
            <div className="usage">
              <Row className="usage-header">
                <LandSvg className="svg" />
                <h5>Usage</h5>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() => setEditInfo({ ...defaultEditValues, usage: !editInfo.usage })}
                />
              </Row>
              <LandUsageForm
                nameSpace="data"
                disabled={editInfo.usage}
                verticalLine
                {...formikProps}
                classifications={props.classifications}
              />
            </div>
          </Row>
          <Row className="content-item">
            <div className="valuation">
              <Row className="valuation-header">
                <LandSvg className="svg" />
                <h5>Valuation</h5>
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
                <span className="vl"></span>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace('data.financials.0.netbook.value')}
                  disabled={editInfo.valuation}
                />
              </Row>
              <Row className="val-row">
                <Label>Est'd Market Value</Label>
                <span className="vl"></span>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace('data.financials.0.estimated.value')}
                  disabled={editInfo.valuation}
                />
              </Row>
              <Row className="val-row">
                <Label>Assessed Value</Label>
                <span className="vl"></span>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace('data.financials.0.assessed.value')}
                  disabled={editInfo.valuation}
                />
              </Row>
              <Row className="val-row">
                <Label>Appraised Value</Label>
                <span className="vl"></span>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace('data.financials.0.appraised.value')}
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
