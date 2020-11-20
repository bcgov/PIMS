import './LandReviewPage.scss';

import { FastInput, Input, TextArea, InputGroup } from 'components/common/form';
import React, { useCallback, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Label } from 'components/common/Label';
import { FaEdit } from 'react-icons/fa';
import { LandSvg } from 'components/common/Icons';
import { TypeaheadField } from 'components/common/form/Typeahead';
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
            <Row>
              <Label>Agency</Label>
              <span className="vl"></span>
              <TypeaheadField
                name={withNameSpace('data.agencyId')}
                options={props.agencies}
                disabled={editInfo.identification}
              />
            </Row>
            <Row>
              <Label>Name</Label>
              <span className="vl"></span>
              <Input disabled={editInfo.identification} field={withNameSpace('data.name')} />
            </Row>
            <Row>
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
            <Row>{/* <PidPin /> */}</Row>
            <br></br>
            <Row>
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
            <Row>
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
            <Row>
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
          <Row>
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
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
