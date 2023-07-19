import './LandReviewPage.scss';

import { Box, Divider, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ILookupCode } from 'actions/ILookupCode';
import { IBuilding } from 'actions/parcelsActions';
import {
  Check,
  FastCurrencyInput,
  FastInput,
  FastSelect,
  Input,
  InputGroup,
  Select,
  TextArea,
} from 'components/common/form';
import { ParentSelect } from 'components/common/form/ParentSelect';
import { TypeaheadField } from 'components/common/form/Typeahead';
import { BuildingSvg, LandSvg } from 'components/common/Icons';
import { Label } from 'components/common/Label';
import { ProjectNumberLink } from 'components/maps/leaflet/InfoSlideOut/ProjectNumberLink';
import * as API from 'constants/API';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { FormikTable } from 'features/projects/common';
import { getAssociatedBuildingsCols } from 'features/properties/components/forms/subforms/columns';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { getIn, useFormikContext } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import React, { SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { useAppSelector } from 'store';
import styled from 'styled-components';
import { formatFiscalYear, mapLookupCode } from 'utils';

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

const HeaderDivider = () => (
  <Divider sx={{ mt: '5px', mb: '5px', height: '1px', background: '#1a57c7', opacity: '100%' }} />
);

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

  // Address form:
  const lookupCodes = useAppSelector((store) => store.lookupCode.lookupCodes);
  const provinces = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROVINCE_CODE_SET_NAME;
  }).map(mapLookupCode);
  const administrativeAreas = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.AMINISTRATIVE_AREA_CODE_SET_NAME;
  }).map(mapLookupCode);

  /**
   * postalCodeFormatter takes the specified postal code and formats it with a space in the middle
   * @param {string} postal The target postal to be formatted
   */
  const postalCodeFormatter = (postal: string) => {
    const regex = /([a-zA-z][0-9][a-zA-z])[\s-]?([0-9][a-zA-z][0-9])/;
    const format = postal.match(regex);
    if (format !== null && format.length === 3) {
      postal = `${format[1]} ${format[2]}`;
    }
    return postal.toUpperCase();
  };

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
          <div className="identification">
            <Box sx={{ p: 2, background: 'white' }}>
              {/* HEADER */}
              <Stack direction="row" spacing={1}>
                <Typography text-align="left" sx={{ fontWeight: 700, color: '#1a57c7' }}>
                  Parcel Identification
                </Typography>
                {!props.disabled && (
                  <Box sx={{ pl: 1 }}>
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
                  </Box>
                )}
              </Stack>
              <HeaderDivider />

              {/* CONTENT */}
              <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
                {/* AGENCY FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Agency:</Typography>
                </Grid>
                <Grid item xs={7}>
                  <ParentSelect
                    required
                    field={withNameSpace('agencyId')}
                    options={props.agencies}
                    filterBy={['code', 'label', 'parent']}
                    disabled={true}
                  />
                </Grid>

                {/* NAME FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Name:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <Input disabled={editInfo.identification} field={withNameSpace('name')} />
                </Grid>

                {/* DESCRIPTION FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Description:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <TextArea
                    disabled={editInfo.identification}
                    field={withNameSpace('description')}
                  />
                </Grid>

                {/* PID FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>PID:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <Input
                    displayErrorTooltips
                    className="input-small"
                    disabled={true}
                    required={true}
                    field={withNameSpace('pid')}
                  />
                </Grid>

                {/* PIN FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>PIN:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <Input
                    displayErrorTooltips
                    className="input-small"
                    disabled={true}
                    required={true}
                    field={withNameSpace('pin')}
                  />
                </Grid>

                {/* LOT SIZE FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Lot Size:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <InputGroup
                    displayErrorTooltips
                    fast={true}
                    disabled={true}
                    type="number"
                    field={withNameSpace('landArea')}
                    formikProps={formikProps}
                    postText="Hectares"
                  />
                </Grid>

                {/* LATITUDE FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Latitude:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <FastInput
                    className="input-medium"
                    displayErrorTooltips
                    formikProps={formikProps}
                    disabled={true}
                    type="number"
                    field={withNameSpace('latitude')}
                  />
                </Grid>

                {/* LONGITUDE FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Longitude:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <FastInput
                    className="input-medium"
                    displayErrorTooltips
                    formikProps={formikProps}
                    disabled={true}
                    type="number"
                    field={withNameSpace('longitude')}
                  />
                </Grid>

                {/* STREET ADDRESS FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Street Address:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <GeocoderAutoComplete
                    tooltip={undefined}
                    value={getIn(formikProps.values, withNameSpace('address.line1'))}
                    disabled={true}
                    field={withNameSpace('line1')}
                    onSelectionChanged={() => {}}
                    onTextChange={(value) =>
                      formikProps.setFieldValue(withNameSpace('address.line1'), value)
                    }
                    error={getIn(formikProps.errors, withNameSpace('address.line1'))}
                    touch={getIn(formikProps.touched, withNameSpace('address.line1'))}
                    displayErrorTooltips
                    required={true}
                  />
                </Grid>

                {/* LOCATION FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Location:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <TypeaheadField
                    options={administrativeAreas.map((x) => x.label)}
                    name={withNameSpace('address.administrativeArea')}
                    disabled={true}
                    hideValidation={true}
                    paginate={false}
                    required
                    displayErrorTooltips
                  />
                </Grid>

                {/* PROVINCE FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Province:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <Select
                    disabled={true}
                    placeholder="Must Select One"
                    field={withNameSpace('address.provinceId')}
                    options={provinces}
                  />
                </Grid>

                {/* POSTAL CODE FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Postal Code:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <FastInput
                    className="input-small"
                    formikProps={formikProps}
                    style={{ width: '120px' }}
                    disabled={true}
                    onBlurFormatter={(postal: string) =>
                      postal.replace(postal, postalCodeFormatter(postal))
                    }
                    field={withNameSpace('address.postal')}
                    displayErrorTooltips
                  />
                </Grid>

                {/* LEGAL DESCRIPTION FIELD */}
                <Grid item xs={5}>
                  <Typography fontSize={14}>Legal Description:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
                  <TextArea
                    style={{ width: '400px', height: '80px' }}
                    disabled={true}
                    field={withNameSpace('landLegalDescription')}
                  />
                </Grid>

                {/* PROJECT NUMBERS */}
                {!!projectNumbers?.length && (
                  <>
                    <Grid item xs={5}>
                      <Typography fontSize={14}>Project Number(s):</Typography>
                    </Grid>
                    <Grid item xs={7} sx={{ display: 'flex', alignItems: 'left' }}>
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
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            {/* Harmful if released? */}
            <Box
              sx={{
                mt: '15px',
                p: 2,
                background: 'white',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontWeight: 700 }}>Harmful info if released?</Typography>
                <Check
                  type="radio"
                  field={withNameSpace('isSensitive')}
                  radioLabelOne="Yes"
                  radioLabelTwo="No"
                  disabled={editInfo.identification}
                />
              </Stack>
            </Box>
          </div>
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
