import { Box, Grid, InputAdornment, Tooltip, Typography } from '@mui/material';
import React, { useContext } from 'react';
import AutocompleteFormField from '../form/AutocompleteFormField';
import { UserContext } from '@/contexts/userContext';
import TextFormField from '../form/TextFormField';
import { ISelectMenuItem } from '../form/SelectFormField';
import SingleSelectBoxFormField from '../form/SingleSelectBoxFormField';
import { LookupContext } from '@/contexts/lookupContext';
import { Roles } from '@/constants/roles';
import { useFormContext } from 'react-hook-form';
import { formatFiscalYear } from '@/utilities/formatters';
import { generateNumberList, getFiscalYear } from '@/utilities/helperFunctions';
import Help from '@mui/icons-material/Help';

interface IProjectGeneralInfoForm {
  projectStatuses: ISelectMenuItem[];
  agencyOptions: ISelectMenuItem[];
}

export const ProjectGeneralInfoForm = (props: IProjectGeneralInfoForm) => {
  const { agencyOptions } = props;
  const { data: lookupData } = useContext(LookupContext);
  const { pimsUser } = useContext(UserContext);
  const canEdit = pimsUser.hasOneOfRoles([Roles.ADMIN]);
  const { getValues } = useFormContext();

  return (
    <Grid mt={'1rem'} spacing={2} container>
      <Grid item xs={6}>
        <AutocompleteFormField
          required
          disabled={!canEdit}
          options={props.projectStatuses}
          name={'StatusId'}
          label={'Status'}
        />
      </Grid>
      <Grid item xs={12}>
        <TextFormField
          disabled
          required
          fullWidth
          name={'ProjectNumber'}
          label={'Project Number'}
        />
      </Grid>
      <Grid item xs={6}>
        <TextFormField required fullWidth name={'Name'} label={'Name'} />
      </Grid>
      <Grid item xs={6}>
        <AutocompleteFormField
          name={'TierLevelId'}
          label={'Assign Tier'}
          required
          options={
            lookupData?.ProjectTiers?.map((t) => ({
              label: t.Name,
              value: t.Id,
              tooltip: t.Description,
            })) ?? []
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextFormField fullWidth multiline name={'Description'} label={'Description'} minRows={3} />
      </Grid>
      {canEdit && (
        <>
          <Grid item xs={12}>
            <AutocompleteFormField
              name={'AgencyId'}
              label={'Agency'}
              options={agencyOptions ?? []}
              allowNestedIndent
            />
          </Grid>
          <Grid item xs={4}>
            <AutocompleteFormField
              fullWidth
              name={'ReportedFiscalYear'}
              label={'Reported Fiscal Year'}
              disabled
              options={[getValues()['ReportedFiscalYear']].map((year) => ({
                value: year,
                label: formatFiscalYear(year),
              }))}
            />
          </Grid>
          <Grid item xs={4}>
            <AutocompleteFormField
              fullWidth
              name={'ActualFiscalYear'}
              label={'Fiscal Year of Disposal'}
              options={generateNumberList(
                getValues()['ActualFiscalYear'] ?? getFiscalYear(),
                getFiscalYear() + 5,
              ).map((year) => ({
                value: year,
                label: formatFiscalYear(year),
              }))}
            />
          </Grid>
          <Grid item xs={12}>
            <AutocompleteFormField
              name={'RiskId'}
              label={
                <Box display={'inline-flex'} alignItems={'center'}>
                  Risk Level
                  <Tooltip title="The risk associated with completion of the sale of a property during the forecasted fiscal year. Risk status on property sales can change through the sales process.">
                    <Help sx={{ ml: '4px' }} fontSize="small" />
                  </Tooltip>
                </Box>
              }
              required
              options={
                lookupData?.Risks.map((risk) => ({
                  value: risk.Id,
                  label: risk.Name,
                  tooltip: risk.Description,
                })) ?? []
              }
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export const ProjectFinancialInfoForm = () => {
  return (
    <Grid mt={'1rem'} spacing={2} container>
      <Grid item xs={6}>
        <TextFormField
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          fullWidth
          numeric
          name={'Assessed'}
          label={'Assessed value'}
          rules={{
            min: {
              value: 0.01,
              message: 'Must be greater than 0.',
            },
          }}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextFormField
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          fullWidth
          numeric
          name={'NetBook'}
          label={'Net book value'}
          rules={{
            min: {
              value: 0.01,
              message: 'Must be greater than 0.',
            },
          }}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextFormField
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          numeric
          fullWidth
          name={'Market'}
          label={'Estimated market value'}
          rules={{
            min: {
              value: 0.01,
              message: 'Must be greater than 0.',
            },
          }}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextFormField
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          numeric
          fullWidth
          name={'Appraised'}
          label={'Appraised value'}
        />
      </Grid>
      <Grid item xs={6}>
        <TextFormField
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          numeric
          fullWidth
          name={'SalesCost'}
          label={'Estimated sales cost'}
        />
      </Grid>
      <Grid item xs={6}>
        <TextFormField
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          numeric
          fullWidth
          name={'ProgramCost'}
          label={'Estimated program recovery fees'}
        />
      </Grid>
    </Grid>
  );
};

export const ProjectDocumentationForm = () => {
  return (
    <>
      <Typography variant="h5">Documentation</Typography>
      <Grid mt={'1rem'} spacing={2} container>
        {/* <Grid container spacing={2}></Grid> */}
        <Grid item xs={12}>
          <SingleSelectBoxFormField
            name={'Tasks.surplusDeclarationReadiness'}
            label={'Surplus declaration & readiness checklist document emailed to SRES.'}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <SingleSelectBoxFormField
            name={'Tasks.tripleBottomLine'}
            label={'Triple bottom line document emailed to SRES or Project is in Tier 1'}
            required
          />
        </Grid>
        <Typography variant="h5">Approval</Typography>
        <Grid item xs={12}>
          <SingleSelectBoxFormField
            name={'Approval'}
            label={
              'My ministry/agency has approval/authority to submit the disposal project to SRES for review.'
            }
            required
          />
        </Grid>
      </Grid>
    </>
  );
};
