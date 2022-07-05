import './LandReviewPage.scss';

import { IBuilding } from 'actions/parcelsActions';
import {
  Check,
  FastCurrencyInput,
  FastInput,
  FastSelect,
  Input,
  InputGroup,
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
import { getAssociatedBuildingsCols } from 'features/properties/components/forms/subforms/columns';
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
  disabled?: boolean;
  classifications: any;
  agencies: any;
  /** handle the pid formatting on change */
  handlePidChange: (pid: string) => void;
  /** handle the pin formatting on change */
  handlePinChange: (pin: string) => void;
  isPropertyAdmin: boolean;
}

const StyledProjectNumbers = styled.div`
  flex-direction: column;
  display: flex;
`;

export const LandReviewPage: React.FC<any> = (props: IReviewProps) => {
  const withNameSpace: Function = useCallback(
    (fieldName: string) => {
      return props.nameSpace ? `${props.nameSpace}.${fieldName}` : fieldName;
    },
    [props.nameSpace],
  );
  const formikProps = useFormikContext();

  const onRowClick = (data: IBuilding) => {
    window.open(`/mapview?sidebar=true&buildingId=${data.id}`, `_blank`);
  };

  const defaultEditValues = useMemo(
    () => ({
      identification: props.disabled || formikProps.isValid,
      usage: props.disabled || formikProps.isValid,
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

  const buildings = getIn(formikProps.values, withNameSpace('buildings'));
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
                  required
                  field={withNameSpace('agencyId')}
                  options={props.agencies}
                  filterBy={['code', 'label', 'parent']}
                  disabled={true}
                />
              </Row>
              <Row className="content-item">
                <Label>Name</Label>
                <Input disabled={editInfo.identification} field={withNameSpace('name')} />
              </Row>
              <Row className="content-item resizable">
                <Label>Description</Label>
                <TextArea disabled={editInfo.identification} field={withNameSpace('description')} />
              </Row>
              <Row className="content-item resizable">
                <Label>Legal Description</Label>
                <TextArea disabled={true} field={withNameSpace('landLegalDescription')} />
              </Row>

              <AddressForm
                onGeocoderChange={noop}
                {...formikProps}
                disabled={true}
                nameSpace={withNameSpace('address')}
                disableCheckmark
                disableStreetAddress
              />
              <p className="break"></p>
              <Row className="content-item">
                <Label>PID</Label>
                <Input
                  displayErrorTooltips
                  className="input-small"
                  disabled={true}
                  required={true}
                  field={withNameSpace('pid')}
                />
              </Row>
              <Row className="content-item">
                <Label>PIN</Label>
                <Input
                  displayErrorTooltips
                  className="input-small"
                  disabled={true}
                  required={true}
                  field={withNameSpace('pin')}
                />
              </Row>
              <Row className="content-item">
                <Label>Lot Size</Label>

                <InputGroup
                  displayErrorTooltips
                  fast={true}
                  disabled={true}
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
                  disabled={true}
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
                  disabled={true}
                  type="number"
                  field={withNameSpace('longitude')}
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
                {!props.disabled && (
                  <FaEdit
                    size={20}
                    className="edit"
                    onClick={() =>
                      setEditInfo({
                        ...editInfo,
                        usage: formikProps.isValid && !editInfo.usage,
                      })
                    }
                  />
                )}
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
                  required={true}
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
              <Row className="val-row">
                <Label>Net Book Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace(`fiscals.${fiscalIndex}.value`)}
                  disabled={editInfo.valuation}
                />
                <FastInput
                  formikProps={formikProps}
                  field="netBookYearDisplay"
                  value={formatFiscalYear(netBookYear)}
                  disabled
                  style={{ width: 50, fontSize: 11 }}
                />
              </Row>
              <Row className="val-row">
                <Label>Assessed Value</Label>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace(`evaluations.${evaluationIndex}.value`)}
                  disabled={editInfo.valuation}
                />
                <FastInput
                  formikProps={formikProps}
                  field={withNameSpace(`evaluations.${evaluationIndex}.year`)}
                  disabled
                  style={{ width: 50, fontSize: 11 }}
                />
              </Row>
            </div>
          </Row>
        </Col>
        {buildings?.length > 0 && (
          <Col md={12}>
            <Row>
              <div className="associated-buildings">
                <Row className="section-header">
                  <span>
                    <BuildingSvg className="svg" />
                    <h5>Associated Buildings</h5>
                  </span>
                </Row>
                <Row>
                  <FormikTable
                    field="data.buildings"
                    name="buildings"
                    columns={getAssociatedBuildingsCols()}
                    clickableTooltip="Click to view building details"
                    onRowClick={onRowClick}
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
