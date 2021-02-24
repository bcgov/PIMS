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
import { BuildingSvg, LandSvg } from 'components/common/Icons';
import AddressForm from 'features/properties/components/forms/subforms/AddressForm';
import { noop } from 'lodash';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { formatFiscalYear } from 'utils';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import moment from 'moment';
import { getAssociatedLandCols } from 'features/properties/components/forms/subforms/columns';
import { FormikTable } from 'features/projects/common';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';
import styled from 'styled-components';

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
                        ...editInfo,
                        identification: formikProps.isValid && !editInfo.identification,
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
                  disabled={editInfo.identification || !props.isPropertyAdmin}
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
              <Row className="content-item">
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
                      setEditInfo({
                        ...editInfo,
                        tenancy: formikProps.isValid && !editInfo.tenancy,
                      })
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
                    popperModifiers={{
                      preventOverflow: {
                        enabled: true,
                        escapeWithReference: false,
                        boundariesElement: 'scrollParent',
                      },
                    }}
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
                      setEditInfo({
                        ...editInfo,
                        valuation: formikProps.isValid && !editInfo.valuation,
                      })
                    }
                  />
                )}
              </Row>
              <Row className="val-item" style={{ display: 'flex' }}>
                <Label>Net Book Value</Label>
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
              </Row>
              <Row className="val-item" style={{ display: 'flex' }}>
                <Label>Assessed Value</Label>
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
