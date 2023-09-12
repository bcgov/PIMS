import { Box, Grid, Stack, Typography } from '@mui/material';
import { FastCurrencyInput, FastInput, FastSelect } from 'components/common/form';
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

interface IUsageValuationProps {
  withNameSpace: Function;
  disabled?: boolean;
  classifications: any;
  editInfo: {
    identification: boolean;
    usage: boolean;
    valuation: boolean;
  };
  setEditInfo: Dispatch<SetStateAction<object>>;
  index?: number;
}

/**
 * @description For parcels, shows usage and valuation information.
 * @param {IUsageValuationProps} props
 * @returns React component.
 */
export const UsageValuation: React.FC<any> = (props: IUsageValuationProps) => {
  const { setEditInfo, editInfo, withNameSpace, disabled, classifications, index } = props;
  const formikProps = useFormikContext();

  const currentYear = moment().year();

  const fiscalIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('fiscals', index)),
    FiscalKeys.NetBook,
    currentYear,
  );

  const evaluationIndex = indexOfFinancial(
    getIn(formikProps.values, withNameSpace('evaluations', index)),
    EvaluationKeys.Assessed,
    currentYear,
  );

  const netBookYear = getIn(
    formikProps.values,
    withNameSpace(`fiscals.${fiscalIndex}.fiscalYear`, index),
  );

  // Style Constants
  const { leftColumnWidth, rightColumnWidth, boldFontWeight, fontSize, headerColour } = tabStyles;

  return (
    <>
      {/* USAGE */}
      <div className="usage">
        <Box sx={{ p: 2, background: 'white' }}>
          {/* HEADER */}
          <Stack direction="row" spacing={1}>
            <Typography text-align="left" sx={{ fontWeight: boldFontWeight, color: headerColour }}>
              Usage
            </Typography>
            {!disabled && (
              <Box sx={{ pl: 1 }}>
                <FaEdit
                  size={20}
                  className="edit"
                  onClick={() => {
                    setEditInfo({
                      ...editInfo,
                      usage: formikProps.isValid && !editInfo.usage,
                    });
                  }}
                />
              </Box>
            )}
          </Stack>
          <HeaderDivider />

          {/* CONTENT */}
          <Grid container sx={{ textAlign: 'left' }} rowSpacing={0.5}>
            {/* CLASSIFICATION */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Classification:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <FastSelect
                formikProps={formikProps}
                disabled={editInfo.usage}
                type="number"
                placeholder="Must Select One"
                field={withNameSpace('classificationId', index)}
                options={classifications}
                required={true}
              />
            </Grid>

            {/* CURRENT ZONING */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Current Zoning:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <FastInput
                formikProps={formikProps}
                disabled={editInfo.usage}
                field={withNameSpace('zoning', index)}
              />
            </Grid>

            {/* POTENTIAL ZONING */}
            <Grid item xs={leftColumnWidth}>
              <Typography fontSize={fontSize}>Potential Zoning:</Typography>
            </Grid>
            <Grid item xs={rightColumnWidth}>
              <FastInput
                formikProps={formikProps}
                disabled={editInfo.usage}
                field={withNameSpace('zoningPotential', index)}
              />
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
            <Grid container item xs={rightColumnWidth}>
              <Grid item xs={4}>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace(`fiscals.${fiscalIndex}.value`, index)}
                  disabled={editInfo.valuation}
                />
              </Grid>
              <Grid item xs={3}>
                <FastInput
                  formikProps={formikProps}
                  field="netBookYearDisplay"
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
            <Grid container item xs={rightColumnWidth}>
              <Grid item xs={4}>
                <FastCurrencyInput
                  formikProps={formikProps}
                  field={withNameSpace(`evaluations.${evaluationIndex}.value`, index)}
                  disabled={editInfo.valuation}
                />
              </Grid>
              <Grid item xs={3}>
                <FastInput
                  formikProps={formikProps}
                  field={withNameSpace(`evaluations.${evaluationIndex}.year`, index)}
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
