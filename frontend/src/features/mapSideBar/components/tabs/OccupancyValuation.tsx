import './../../SidebarContents/subforms/LandReviewPage.scss';

import { Box, Grid, Stack, Typography } from '@mui/material';
import {
  FastCurrencyInput,
  FastDatePicker,
  FastInput,
  Input,
  InputGroup,
} from 'components/common/form';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { indexOfFinancial } from 'features/properties/components/forms/subforms/EvaluationForm';
import { getIn, useFormikContext } from 'formik';
import moment from 'moment';
import React, { Dispatch, SetStateAction } from 'react';
import { FaEdit } from 'react-icons/fa';
import { formatFiscalYear } from 'utils';

import { HeaderDivider } from './HeaderDivider';
import { tabStyles } from './TabStyles';

interface IOccupancyValuation {
  withNameSpace: Function;
  disabled?: boolean;
  classifications: any;
  editInfo: {
    identification: boolean;
    tenancy: boolean;
    valuation: boolean;
  };
  setEditInfo: Dispatch<SetStateAction<object>>;
}

/**
 * @description For buildings, shows info on occupancy and valuation
 * @param {IOccupancyValuation} props
 * @returns React component.
 */
export const OccupancyValuation: React.FC<any> = (props: IOccupancyValuation) => {
  const { setEditInfo, editInfo, withNameSpace, disabled } = props;
  const formikProps = useFormikContext();
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
  // Style Constants
  const { leftColumnWidth, rightColumnWidth, boldFontWeight, fontSize, headerColour } = tabStyles;

  return (
    <>
      {/* OCCUPANCY */}
      <div className="occupancy">
        <Box sx={{ p: 2, background: 'white' }}>
          {/* HEADER */}
          <Stack direction="row" spacing={1}>
            <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
              Occupancy
            </Typography>
            {!disabled && (
              <Box sx={{ pl: 1 }}>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() => {
                    setEditInfo({
                      ...editInfo,
                      tenancy: formikProps.isValid && !editInfo.tenancy,
                    });
                  }}
                />
              </Box>
            )}
          </Stack>
          <HeaderDivider />

          {/* CONTENT */}
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
            {/* TOTAL AREA */}
            <Grid item container>
              <Grid item xs={leftColumnWidth}>
                <Typography fontSize={fontSize}>Total Area:</Typography>
              </Grid>
              <Grid item xs={rightColumnWidth} className="tenancy-fields">
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
              </Grid>
            </Grid>

            {/* NET USABLE AREA */}
            <Grid item container>
              <Grid item xs={leftColumnWidth}>
                <Typography fontSize={fontSize}>Net Usable Area:</Typography>
              </Grid>
              <Grid item xs={rightColumnWidth} className="tenancy-fields">
                <InputGroup
                  displayErrorTooltips
                  fast={true}
                  formikProps={formikProps}
                  disabled={editInfo.tenancy}
                  type="number"
                  field={withNameSpace('rentableArea')}
                  postText="Sq. M"
                  style={{ border: 'solid' }}
                  required
                />
              </Grid>
            </Grid>

            {/* TENANCY % */}
            <Grid item container>
              <Grid item xs={leftColumnWidth}>
                <Typography fontSize={fontSize}>Tenancy %:</Typography>
              </Grid>
              <Grid item xs={rightColumnWidth} className="content-item">
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
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
      {/* VALUATION */}
      <div className="valuation">
        <Box sx={{ p: 2, background: 'white' }}>
          {/* HEADER */}
          <Stack direction="row" spacing={1}>
            <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
              Valuation
            </Typography>
            {!disabled && (
              <Box sx={{ pl: 1 }}>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() => {
                    setEditInfo({
                      ...editInfo,
                      valuation: formikProps.isValid && !editInfo.valuation,
                    });
                  }}
                />
              </Box>
            )}
          </Stack>
          <HeaderDivider />

          {/* CONTENT */}
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
            {/* NET BOOK VALUE */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Net Book Value:</Typography>
            </Grid>
            <Grid item container xs={rightColumnWidth} className="val-item">
              <Grid item>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={`data.fiscals.${fiscalIndex}.value`}
                  disabled={editInfo.valuation}
                />
              </Grid>
              <Grid item>
                <Input
                  field="netbookYearDisplay"
                  value={formatFiscalYear(netBookYear)}
                  disabled
                  style={{ width: 50, fontSize: 11 }}
                />
              </Grid>
            </Grid>
            {/* ASSESSED VALUE */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Assessed Value:</Typography>
            </Grid>
            <Grid item container xs={rightColumnWidth} className="val-item">
              <Grid item>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={`data.evaluations.${evaluationIndex}.value`}
                  disabled={editInfo.valuation}
                />
              </Grid>
              <Grid item>
                <Input
                  field={`data.evaluations.${evaluationIndex}.year`}
                  disabled
                  style={{ width: 50, fontSize: 11 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};
