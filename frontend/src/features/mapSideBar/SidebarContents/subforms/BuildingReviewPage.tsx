import './LandReviewPage.scss';

import {
  FastSelect,
  FastInput,
  Input,
  TextArea,
  InputGroup,
  SelectOptions,
  Check,
  FastCurrencyInput,
  FastDatePicker,
} from 'components/common/form';
import React, { useCallback, useState, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { getIn, useFormikContext } from 'formik';
import { Label } from 'components/common/Label';
import { FaEdit } from 'react-icons/fa';
import { BuildingSvg } from 'components/common/Icons';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { noop } from 'lodash';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { formatFiscalYear } from 'utils';

interface IReviewProps {
  nameSpace?: string;
  classifications: any;
  predominateUses: SelectOptions;
  constructionType: SelectOptions;
  occupantTypes: SelectOptions;
  agencies: any;
  disabled: boolean;
}

export const BuildingReviewPage: React.FC<any> = (props: IReviewProps) => {
  const formikProps = useFormikContext();
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );
  const netBookYear = getIn(formikProps.values, withNameSpace('financials.0.netbook.fiscalYear'));
  const defaultEditValues = useMemo(
    () => ({
      identification: props.disabled || formikProps.isValid,
      tenancy: props.disabled || formikProps.isValid,
      valuation: props.disabled || formikProps.isValid,
    }),
    [formikProps.isValid, props.disabled],
  );
  const [editInfo, setEditInfo] = useState(defaultEditValues);

  return (
    <Container className="review-section">
      <Row className="review-steps">
        <h4>Review your building info</h4>
        <p>
          Please review the information you have entered. You can edit it by clicking on the edit
          icon for each section. When you are satisfied that the information provided is correct,
          click the submit button to save this information to the PIMS inventory.
        </p>
      </Row>
      <Row noGutters style={{ marginBottom: 20 }}>
        <Col md={6}>
          <Row>
            <div className="identification">
              <Row className="section-header">
                <span>
                  <BuildingSvg className="svg" />
                  <h5>Building Identification</h5>
                </span>
                {!props.disabled && (
                  <FaEdit
                    size={20}
                    className="edit"
                    onClick={() =>
                      setEditInfo({
                        ...defaultEditValues,
                        identification: !editInfo.identification,
                      })
                    }
                  />
                )}
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
                <Label>Building Name</Label>
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
                disableCheckmark
              />
              <br></br>
              <Row className="content-item">
                <Label>Latitude</Label>
                <FastInput
                  className="input-medium"
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  type="number"
                  field={withNameSpace('latitude')}
                  required
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
                  required
                />
              </Row>
              <br></br>
              <Row className="content-item">
                <Label>SRES Classification</Label>
                <span className="vl"></span>
                <FastSelect
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  placeholder="Must Select One"
                  field={withNameSpace('classificationId')}
                  type="number"
                  options={props.classifications}
                  required
                />
              </Row>
              <Row className="content-item">
                <Label>Main Usage</Label>
                <FastSelect
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  placeholder="Must Select One"
                  field={withNameSpace('buildingPredominateUseId')}
                  type="number"
                  options={props.predominateUses}
                  required
                />
              </Row>
              <Row className="content-item">
                <Label>Type of Construction</Label>
                <FastSelect
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  placeholder="Must Select One"
                  field={withNameSpace('buildingConstructionTypeId')}
                  type="number"
                  options={props.constructionType}
                  required
                />
              </Row>
              <Row className="content-item">
                <Label>Number of Floors</Label>
                <FastInput
                  displayErrorTooltips
                  className="input-small"
                  formikProps={formikProps}
                  disabled={editInfo.identification}
                  field={withNameSpace('buildingFloorCount')}
                  type="number"
                />
              </Row>
              {(formikProps.values as any).data?.projectNumber && (
                <Row>
                  <Label>SPP</Label>
                  <FastInput
                    displayErrorTooltips
                    className="input-small"
                    formikProps={formikProps}
                    disabled={editInfo.identification}
                    field={withNameSpace('projectNumber')}
                  />
                </Row>
              )}
              <Row className="sensitive check-item">
                <Label>Harmful if info released?</Label>
                <Check
                  type="radio"
                  disabled={editInfo.identification}
                  field={withNameSpace('isSensitive')}
                  radioLabelOne="Yes"
                  radioLabelTwo="No"
                />
              </Row>
            </div>
          </Row>
        </Col>

        <Col md={6}>
          <Row>
            <div className="tenancy">
              <Row className="section-header">
                <span>
                  <BuildingSvg className="svg" />
                  <h5>Occupancy</h5>
                </span>
                {!props.disabled && (
                  <FaEdit
                    size={20}
                    className="edit"
                    onClick={() =>
                      setEditInfo({ ...defaultEditValues, tenancy: !editInfo.tenancy })
                    }
                  />
                )}
              </Row>
              <Row className="content-item">
                <Label>Total Area</Label>
                <InputGroup
                  displayErrorTooltips
                  fast={true}
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  type="number"
                  field={withNameSpace('totalArea')}
                  postText="Sq. M"
                  required
                />
              </Row>
              <Row className="content-item">
                <Label>Net Usable Area</Label>
                <InputGroup
                  displayErrorTooltips
                  fast={true}
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  type="number"
                  field={withNameSpace('rentableArea')}
                  postText="Sq. M"
                  required
                />
              </Row>
              <Row className="content-item">
                <Label>Tenancy %</Label>
                <span className="tenancy-fields">
                  <FastInput
                    displayErrorTooltips
                    formikProps={formikProps}
                    disabled={editInfo.tenancy}
                    field={withNameSpace('buildingTenancy')}
                  />
                  <FastDatePicker
                    formikProps={formikProps}
                    disabled={editInfo.tenancy}
                    field={withNameSpace('buildingTenancyUpdatedOn')}
                  />
                </span>
              </Row>
            </div>
          </Row>
          <Row>
            <div className="valuation">
              <Row className="section-header">
                <span>
                  <BuildingSvg className="svg" />
                  <h5>Valuation</h5>
                </span>
                {!props.disabled && (
                  <FaEdit
                    size={20}
                    className="edit"
                    onClick={() =>
                      setEditInfo({ ...defaultEditValues, valuation: !editInfo.valuation })
                    }
                  />
                )}
              </Row>
              <Row className="val-item" style={{ display: 'flex' }}>
                <Label>Net Book Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field="data.financials.0.netbook.value"
                  disabled={editInfo.valuation}
                />
                <Input
                  field="netbookYearDisplay"
                  value={formatFiscalYear(netBookYear)}
                  disabled
                  style={{ width: 50, fontSize: 11 }}
                />
              </Row>
              <Row className="val-item" style={{ display: 'flex' }}>
                <Label>Assessed Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field="data.financials.0.assessed.value"
                  disabled={editInfo.valuation}
                />
                <Input
                  field="data.financials.0.assessed.year"
                  disabled
                  style={{ width: 50, fontSize: 11 }}
                />
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
