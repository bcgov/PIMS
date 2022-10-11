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
import { FormikContextType, getIn, useFormikContext } from 'formik';
import { noop } from 'lodash';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { Col, Container, Form, Row, Stack } from 'react-bootstrap';
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
  const formikProps: FormikContextType<any> = useFormikContext();
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
      <Row style={{ marginBottom: 20 }}>
        <Col className="me-4">
          <Row>
            <div className="identification">
              <Row className="section-header">
                <Col xs={3}>
                  <BuildingSvg className="svg" />
                </Col>
                <Col xs={3}>
                  <h5>Building Identification</h5>
                </Col>
                <Col xs={3}>
                  {!props.disabled && (
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
                  )}
                </Col>
              </Row>
              <Form.Group as={Row} className="content-item">
                <Label>Agency</Label>
                <Col>
                  <ParentSelect
                    field={withNameSpace('agencyId')}
                    options={props.agencies}
                    filterBy={['code', 'label', 'parent']}
                    disabled={true}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="content-item">
                <Label>Building Name</Label>
                <Col>
                  <Input disabled={editInfo.identification} field={withNameSpace('name')} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="content-item">
                <Label>Description</Label>
                <Col>
                  <TextArea
                    disabled={editInfo.identification}
                    field={withNameSpace('description')}
                  />
                </Col>
              </Form.Group>
              <AddressForm
                onGeocoderChange={noop}
                {...formikProps}
                disabled={true}
                nameSpace={withNameSpace('address')}
                disableCheckmark
                disableStreetAddress
              />
              <br></br>
              <Row className="content-item">
                <Label>Latitude</Label>
                <FastInput
                  className="input-medium"
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={true}
                  type="number"
                  field={withNameSpace('latitude')}
                  required
                />
              </Row>
              <Form.Group as={Row} className="content-item">
                <Label>Longitude</Label>
                <FastInput
                  className="input-medium"
                  displayErrorTooltips
                  formikProps={formikProps}
                  disabled={true}
                  type="number"
                  field={withNameSpace('longitude')}
                  required
                />
              </Form.Group>
              <br></br>
              <Row className="content-item">
                <Label>SRES Class</Label>

                <Col>
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
              <Form.Group as={Row} className="content-item">
                <Label>Main Usage</Label>
                <Col>
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
              </Form.Group>
              <Form.Group as={Row} className="content-item">
                <Label className="text-center">Type of Construction</Label>
                <Col>
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
              </Form.Group>
              <Form.Group as={Row} className="content-item">
                <Label>Number of Floors</Label>
                <Col>
                  <FastInput
                    displayErrorTooltips
                    className="input-small"
                    formikProps={formikProps}
                    disabled={editInfo.identification}
                    field={withNameSpace('buildingFloorCount')}
                    type="number"
                  />
                </Col>
              </Form.Group>
              {!!projectNumbers?.length && (
                <Row style={{ marginTop: '1rem' }}>
                  <Label>Project Number(s)</Label>
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
                </Row>
              )}
              <Form.Group as={Row} className="sensitive check-item">
                <Col xs={6}>
                  <Label>Harmful if info released?</Label>
                </Col>
                <Col xs={2}>
                  <Check
                    type="radio"
                    disabled={editInfo.identification}
                    field={withNameSpace('isSensitive')}
                    radioLabelOne="Yes"
                    radioLabelTwo="No"
                  />
                </Col>
              </Form.Group>
            </div>
          </Row>
        </Col>
        <Col md={6}>
          <div className="tenancy">
            <Row className="section-header">
              <Col>
                <BuildingSvg className="svg" />
              </Col>
              <Col>
                <h5>Occupancy</h5>
              </Col>
              <Col>
                {!props.disabled && (
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
                )}
              </Col>
            </Row>
            <Form.Group as={Row} className="content-item">
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
            </Form.Group>
            <Form.Group as={Row} className="content-item">
              <Label>Net Usable Area</Label>
              <Col>
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
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="content-item">
              <Label>Tenancy %</Label>
              <span className="tenancy-fields" style={{ paddingLeft: 0 }}>
                <Col>
                  <FastInput
                    displayErrorTooltips
                    formikProps={formikProps}
                    disabled={editInfo.tenancy}
                    field={withNameSpace('buildingTenancy')}
                  />
                </Col>
                <Col>
                  <FastDatePicker
                    formikProps={formikProps}
                    disabled={editInfo.tenancy}
                    field={withNameSpace('buildingTenancyUpdatedOn')}
                    // popperModifiers={{
                    //   preventOverflow: {
                    //     enabled: true,
                    //     escapeWithReference: false,
                    //     boundariesElement: 'scrollParent',
                    //   },
                    // }}
                  />
                </Col>
              </span>
            </Form.Group>
          </div>

          <Row>
            <div className="valuation">
              <Row className="section-header">
                <Col>
                  <BuildingSvg className="svg" />
                </Col>
                <Col>
                  <h5>Valuation</h5>
                </Col>
                <Col>
                  {!props.disabled && (
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
                  )}
                </Col>
              </Row>
              <Form.Group as={Row}>
                <Label>Net Book Value</Label>
                <Col xs={6}>
                  <Stack direction="horizontal">
                    <FastCurrencyInput
                      formikProps={formikProps}
                      field={`data.fiscals.${fiscalIndex}.value`}
                      disabled={editInfo.valuation}
                    />
                    <Input
                      field="netbookYearDisplay"
                      value={formatFiscalYear(netBookYear)}
                      disabled
                      style={{ width: 50, fontSize: 11 }}
                    />
                  </Stack>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Label>Assessed Value</Label>
                <Col xs={6}>
                  <Stack direction="horizontal">
                    <FastCurrencyInput
                      formikProps={formikProps}
                      field={`data.evaluations.${evaluationIndex}.value`}
                      disabled={editInfo.valuation}
                    />
                    <Input
                      field={`data.evaluations.${evaluationIndex}.year`}
                      disabled
                      style={{ width: 50, fontSize: 11 }}
                    />
                  </Stack>
                </Col>
              </Form.Group>
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
