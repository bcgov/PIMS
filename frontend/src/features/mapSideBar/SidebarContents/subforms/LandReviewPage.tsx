import './LandReviewPage.scss';

import { Box, Tab, Tabs } from '@mui/material';
import { IBuilding } from 'actions/parcelsActions';
import { FastCurrencyInput, FastInput, FastSelect } from 'components/common/form';
import { BuildingSvg, LandSvg } from 'components/common/Icons';
import { Label } from 'components/common/Label';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { ParcelDetails } from 'features/mapSideBar/components/tabs/ParcelDetails';
import { FormikTable } from 'features/projects/common';
import { getAssociatedBuildingsCols } from 'features/properties/components/forms/subforms/columns';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { getIn, useFormikContext } from 'formik';
import moment from 'moment';
import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
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

  // Tabs.
  const [tab, setTab] = useState<number>(0);
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

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
          You can edit some information by clicking on the edit icon for each section. When you are
          satisfied that the infomation provided is correct, click the submit button to save to the
          PIMS inventory.
        </p>
      </Row>

      <Box>
        {/* TABS */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="property review tabs">
            <Tab label="Parcel Details" id="parcel-details-tab" />
            <Tab label="Usage & Valuation" id="usage-valuation-tab" />
            <Tab label="Title & Ownership Details" id="title-ownership-tab" />
            <Tab label="Associated Buildings" id="associated-buildings-tab" />
          </Tabs>
        </Box>

        {/* PARCEL DETAILS TAB */}
        <Box role="tabpanel" hidden={tab !== 0} id="parcel-details-tabpanel">
          <ParcelDetails
            disabled={props.disabled}
            agencies={props.agencies}
            {...{ withNameSpace, editInfo, setEditInfo }}
          />
        </Box>

        {/* USAGE & VALUATION TAB */}
        <Box role="tabpanel" hidden={tab !== 1} id="usage-valuation-tabpanel" sx={{ p: 3 }}>
          <Row>
            <div className="usage">
              <Row className="section-header">
                <Col md="auto">
                  <span>
                    <LandSvg className="svg" />
                    <h5>Usage</h5>
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
                          usage: formikProps.isValid && !editInfo.usage,
                        })
                      }
                    />
                  </Col>
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
                  <Label style={{ marginLeft: '-0.5px' }}>Potential Zoning</Label>
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
                <Col md="auto">
                  <span>
                    <LandSvg className="svg" />
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
        </Box>

        {/* TITLE & OWNERSHIP TAB */}
        <Box role="tabpanel" hidden={tab !== 2} id="title-ownership-tabpanel" sx={{ p: 3 }}></Box>

        {/* ASSOCIATED BUILDINGS TAB */}
        <Box role="tabpanel" hidden={tab !== 3} id="associated-buildings-tabpanel" sx={{ p: 3 }}>
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
        </Box>
      </Box>
    </Container>
  );
};
