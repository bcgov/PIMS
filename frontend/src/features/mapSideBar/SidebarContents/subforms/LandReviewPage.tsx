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
          <Row style={{ marginRight: '15px' }}>
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
                <Col md="auto">
                  <Label>Agency</Label>
                </Col>
                <Col md="auto">
                  <ParentSelect
                    required
                    field={withNameSpace('agencyId')}
                    options={props.agencies}
                    filterBy={['code', 'label', 'parent']}
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Name</Label>
                </Col>
                <Col md="auto">
                  <Input disabled={editInfo.identification} field={withNameSpace('name')} />
                </Col>
              </Row>
              <Row className="content-item resizable">
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
              <Row
                className="content-item resizable"
                style={{ marginTop: '5px', marginBottom: '5px' }}
              >
                <Col md="auto">
                  <Label>Legal Description</Label>
                </Col>
                <Col md="auto">
                  <TextArea disabled={true} field={withNameSpace('landLegalDescription')} />
                </Col>
              </Row>

              <AddressForm
                onGeocoderChange={noop}
                {...formikProps}
                disabled={true}
                nameSpace={withNameSpace('address')}
                disableCheckmark
                disableStreetAddress
                landReviewStyles
              />
              <p className="break"></p>
              <Row className="content-item">
                <Col md="auto">
                  <Label>PID</Label>
                </Col>
                <Col md="auto">
                  <Input
                    displayErrorTooltips
                    className="input-small"
                    disabled={true}
                    required={true}
                    field={withNameSpace('pid')}
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>PIN</Label>
                </Col>
                <Col md="auto">
                  <Input
                    displayErrorTooltips
                    className="input-small"
                    disabled={true}
                    required={true}
                    field={withNameSpace('pin')}
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Lot Size</Label>
                </Col>
                <Col md="auto">
                  <InputGroup
                    displayErrorTooltips
                    fast={true}
                    disabled={true}
                    type="number"
                    field={withNameSpace('landArea')}
                    formikProps={formikProps}
                    postText="Hectares"
                  />
                </Col>
              </Row>
              <Row className="content-item">
                <Col md="auto">
                  <Label>Latitude</Label>
                </Col>
                <Col md="auto">
                  <FastInput
                    className="input-medium"
                    displayErrorTooltips
                    // tooltip={latitudeTooltip}
                    formikProps={formikProps}
                    disabled={true}
                    type="number"
                    field={withNameSpace('latitude')}
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
              <br></br>
              <Row className="harmful">
                <Col md="auto">
                  <Label>Harmful info if released?</Label>
                </Col>
                <Col md="auto">
                  <Check
                    type="radio"
                    field={withNameSpace('isSensitive')}
                    radioLabelOne="Yes"
                    radioLabelTwo="No"
                    disabled={editInfo.identification}
                  />
                </Col>
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
                <Col md="auto" style={{ marginLeft: '20px' }}>
                  <Label>Classification</Label>
                </Col>
                <Col md="auto">
                  <FastSelect
                    formikProps={formikProps}
                    disabled={editInfo.usage}
                    type="number"
                    placeholder="Must Select One"
                    field={withNameSpace('classificationId')}
                    options={props.classifications}
                    required={true}
                  />
                </Col>
              </Row>
              <Row className="field-row">
                <Col md="auto" style={{ marginLeft: '7px' }}>
                  <Label>Current Zoning</Label>
                </Col>
                <Col md="auto">
                  <FastInput
                    formikProps={formikProps}
                    disabled={editInfo.usage}
                    field={withNameSpace('zoning')}
                  />
                </Col>
              </Row>
              <Row className="field-row">
                <Col md="auto">
                  <Label>Potential Zoning</Label>
                </Col>
                <Col md="auto">
                  <FastInput
                    formikProps={formikProps}
                    disabled={editInfo.usage}
                    field={withNameSpace('zoningPotential')}
                  />
                </Col>
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
                <Col md="auto">
                  <Label>Net Book Value</Label>
                </Col>
                <Col md="auto">
                  <FastCurrencyInput
                    formikProps={formikProps}
                    field={withNameSpace(`fiscals.${fiscalIndex}.value`)}
                    disabled={editInfo.valuation}
                  />
                </Col>
                <Col md="auto">
                  <FastInput
                    formikProps={formikProps}
                    field="netBookYearDisplay"
                    value={formatFiscalYear(netBookYear)}
                    disabled
                    style={{ width: 50, fontSize: 11 }}
                  />
                </Col>
              </Row>
              <Row className="val-row">
                <Col md="auto" style={{ marginLeft: '2px' }}>
                  <Label>Assessed Value</Label>
                </Col>
                <Col md="auto">
                  <FastCurrencyInput
                    formikProps={formikProps}
                    field={withNameSpace(`evaluations.${evaluationIndex}.value`)}
                    disabled={editInfo.valuation}
                  />
                </Col>
                <Col md="auto">
                  <FastInput
                    formikProps={formikProps}
                    field={withNameSpace(`evaluations.${evaluationIndex}.year`)}
                    disabled
                    style={{ width: 50, fontSize: 11 }}
                  />
                </Col>
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
