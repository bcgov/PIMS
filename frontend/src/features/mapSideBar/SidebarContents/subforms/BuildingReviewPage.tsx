import './LandReviewPage.scss';

import {
  Check,
  FastCurrencyInput,
  FastDatePicker,
  FastInput,
  FastSelect,
  Input,
  InputGroup,
  SelectOptions,
  TextArea,
} from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { BuildingSvg, LandSvg } from 'components/common/Icons';
import { Label } from 'components/common/Label';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { FormikTable } from 'features/projects/common';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { getAssociatedLandCols } from 'features/properties/components/forms/subforms/columns';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { getIn, useFormikContext } from 'formik';
import { noop } from 'lodash';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import styled from 'styled-components';
import { formatFiscalYear } from 'utils';

interface IReviewProps {
  nameSpace?: string;
  classifications: any;
  predominateUses: SelectOptions;
  constructionType: SelectOptions;
  occupantTypes: SelectOptions;
  agencies: any;
  disabled: boolean;
  isPropertyAdmin: boolean;
}

const StyledProjectNumbers = styled.div`
  flex-direction: column;
  display: flex;
`;

export const BuildingReviewPage: React.FC<any> = (props: IReviewProps) => {
  const formikProps = useFormikContext();
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );
  const defaultEditValues = useMemo(
    () => ({
      identification: props.disabled || formikProps.isValid,
      tenancy: props.disabled || formikProps.isValid,
      valuation: props.disabled || formikProps.isValid,
    }),
    [formikProps.isValid, props.disabled],
  );
  const [editInfo, setEditInfo] = useState(defaultEditValues);
  const projectNumbers = getIn(formikProps.values, withNameSpace('projectNumbers'));
  const agencyId = getIn(formikProps.values, withNameSpace('agencyId'));
  const [privateProject, setPrivateProject] = useState(false);
  const currentYear = moment().year();
  const evaluationIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('evaluations')),
    EvaluationKeys.Assessed,
    currentYear,
  );
  const fiscalIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('fiscals')),
    FiscalKeys.NetBook,
    currentYear,
  );
  const netBookYear = getIn(formikProps.values, withNameSpace(`fiscals.${fiscalIndex}.fiscalYear`));

  const parcels = getIn(formikProps.values, withNameSpace('parcels'));
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
      <Row className="g-0" style={{ marginBottom: 20 }}>
        <Col md={6} style={{ paddingRight: '10px' }}>
          <Row>
            <div className="identification">
              <Row className="section-header">
                <Col md="auto">
                  <span>
                    <BuildingSvg className="svg" />
                    <h5>Building Identification</h5>
                  </span>
                </Col>
                {!props.disabled && (
                  <Col md="auto">
                    <FaEdit
                      size={20}
                      className="edit"
                      onClick={() =>
                        setEditInfo({
                          ...editInfo,
                          identification: formikProps.isValid && !editInfo.identification,
                        })
                      }
                    />
                  </Col>
                )}
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Agency</Label>
                </Col>
                <Col md="auto">
                  <ParentSelect
                    field={withNameSpace('agencyId')}
                    options={props.agencies}
                    filterBy={['code', 'label', 'parent']}
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Building Name</Label>
                </Col>
                <Col md="auto">
                  <Input disabled={editInfo.identification} field={withNameSpace('name')} />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Description</Label>
                </Col>
                <Col md="auto">
                  <TextArea
                    disabled={editInfo.identification}
                    field={withNameSpace('description')}
                  />
                </Col>
              </Row>

              <AddressForm
                onGeocoderChange={noop}
                {...formikProps}
                disabled={true}
                nameSpace={withNameSpace('address')}
                disableCheckmark
                disableStreetAddress
                buildingReviewStyles
              />
              <br></br>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Latitude</Label>
                </Col>
                <Col md="auto">
                  <FastInput
                    className="input-medium"
                    displayErrorTooltips
                    formikProps={formikProps}
                    disabled={true}
                    type="number"
                    field={withNameSpace('latitude')}
                    required
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Longitude</Label>
                </Col>
                <Col md="auto">
                  <FastInput
                    className="input-medium"
                    displayErrorTooltips
                    formikProps={formikProps}
                    disabled={true}
                    type="number"
                    field={withNameSpace('longitude')}
                    required
                  />
                </Col>
              </Row>
              <br></br>
              <Row className="content-item">
                <Col md="auto">
                  <Label>SRES Classification</Label>
                </Col>
                <Col md="auto">
                  <span className="vl"></span>
                </Col>
                <Col md="auto">
                  <FastSelect
                    formikProps={formikProps}
                    disabled={editInfo.identification}
                    placeholder="Must Select One"
                    field={withNameSpace('classificationId')}
                    type="number"
                    options={props.classifications}
                    required
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Main Usage</Label>
                </Col>
                <Col md="auto">
                  <FastSelect
                    formikProps={formikProps}
                    disabled={editInfo.identification}
                    placeholder="Must Select One"
                    field={withNameSpace('buildingPredominateUseId')}
                    type="number"
                    options={props.predominateUses}
                    required
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Type of Construction</Label>
                </Col>
                <Col md="auto">
                  <FastSelect
                    formikProps={formikProps}
                    disabled={editInfo.identification}
                    placeholder="Must Select One"
                    field={withNameSpace('buildingConstructionTypeId')}
                    type="number"
                    options={props.constructionType}
                    required
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Number of Floors</Label>
                </Col>
                <Col md="auto">
                  <FastInput
                    displayErrorTooltips
                    className="input-small"
                    formikProps={formikProps}
                    disabled={editInfo.identification}
                    field={withNameSpace('buildingFloorCount')}
                    type="number"
                  />
                </Col>
              </Row>
              {!!projectNumbers?.length && (
                <Row style={{ marginTop: '1rem' }}>
                  <Col md="auto">
                    <Label>Project Number(s)</Label>
                  </Col>
                  <Col md="auto">
                    <StyledProjectNumbers>
                      {projectNumbers.map((projectNum: string) => (
                        <ProjectNumberLink
                          projectNumber={projectNum}
                          key={projectNum}
                          agencyId={agencyId}
                          setPrivateProject={setPrivateProject}
                          privateProject={privateProject}
                        />
                      ))}
                    </StyledProjectNumbers>
                  </Col>
                </Row>
              )}
              <Row className="sensitive check-item">
                <Col md="auto">
                  <Label>Harmful if info released?</Label>
                </Col>
                <Col md="auto">
                  <Check
                    type="radio"
                    disabled={editInfo.identification}
                    field={withNameSpace('isSensitive')}
                    radioLabelOne="Yes"
                    radioLabelTwo="No"
                  />
                </Col>
              </Row>
            </div>
          </Row>
        </Col>

        <Col md={6} style={{ paddingLeft: '10px' }}>
          <Row>
            <div className="tenancy">
              <Row className="section-header">
                <Col md="auto">
                  <span>
                    <BuildingSvg className="svg" />
                    <h5>Occupancy</h5>
                  </span>
                </Col>
                {!props.disabled && (
                  <Col md="auto">
                    <FaEdit
                      size={20}
                      className="edit"
                      onClick={() =>
                        setEditInfo({
                          ...editInfo,
                          tenancy: formikProps.isValid && !editInfo.tenancy,
                        })
                      }
                    />
                  </Col>
                )}
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Total Area</Label>
                </Col>
                <Col md="auto">
                  <InputGroup
                    displayErrorTooltips
                    fast={true}
                    formikProps={formikProps}
                    disabled={editInfo.tenancy}
                    type="number"
                    field={withNameSpace('totalArea')}
                    postText="Sq. M"
                    style={{ border: 0 }}
                    required
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Net Usable Area</Label>
                </Col>
                <Col md="auto">
                  <InputGroup
                    displayErrorTooltips
                    fast={true}
                    formikProps={formikProps}
                    disabled={editInfo.tenancy}
                    type="number"
                    field={withNameSpace('rentableArea')}
                    postText="Sq. M"
                    style={{ border: 0 }}
                    required
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Tenancy %</Label>
                </Col>
                <Col md="auto">
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
                      popperModifiers={{
                        preventOverflow: {
                          enabled: true,
                          escapeWithReference: false,
                          boundariesElement: 'scrollParent',
                        },
                      }}
                    />
                  </span>
                </Col>
              </Row>
            </div>
          </Row>
          <Row>
            <div className="valuation">
              <Row className="section-header">
                <Col md="auto">
                  <span>
                    <BuildingSvg className="svg" />
                    <h5>Valuation</h5>
                  </span>
                </Col>
                {!props.disabled && (
                  <Col md="auto">
                    <FaEdit
                      size={20}
                      className="edit"
                      onClick={() =>
                        setEditInfo({
                          ...editInfo,
                          valuation: formikProps.isValid && !editInfo.valuation,
                        })
                      }
                    />
                  </Col>
                )}
              </Row>
              <Row className="val-item" style={{ display: 'flex' }}>
                <Col md="auto">
                  <Label>Net Book Value</Label>
                </Col>
                <Col md="auto">
                  <FastCurrencyInput
                    formikProps={formikProps}
                    field={`data.fiscals.${fiscalIndex}.value`}
                    disabled={editInfo.valuation}
                  />
                </Col>
                <Col md="auto">
                  <Input
                    field="netbookYearDisplay"
                    value={formatFiscalYear(netBookYear)}
                    disabled
                    style={{ width: 50, fontSize: 11 }}
                  />
                </Col>
              </Row>
              <Row className="val-item" style={{ display: 'flex' }}>
                <Col md="auto" style={{ paddingLeft: '2px' }}>
                  <Label>Assessed Value</Label>
                </Col>
                <Col md="auto">
                  <FastCurrencyInput
                    formikProps={formikProps}
                    field={`data.evaluations.${evaluationIndex}.value`}
                    disabled={editInfo.valuation}
                  />
                </Col>
                <Col md="auto">
                  <Input
                    field={`data.evaluations.${evaluationIndex}.year`}
                    disabled
                    style={{ width: 50, fontSize: 11 }}
                  />
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
        {parcels?.length > 0 && (
          <Col md={12}>
            <Row>
              <div className="associated-land">
                <Row className="section-header">
                  <span>
                    <LandSvg className="svg" />
                    <h5>Associated Land</h5>
                  </span>
                </Row>
                <Row>
                  <FormikTable
                    field="data.parcels"
                    name="parcels"
                    columns={getAssociatedLandCols()}
                  />
                </Row>
              </div>
            </Row>
          </Col>
        )}
      </Row>
    </Container>
  );
};
