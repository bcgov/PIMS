import { Box, Grid, InputAdornment, Tooltip, Typography } from '@mui/material';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import SelectFormField, { ISelectMenuItem } from '../form/SelectFormField';
import { Help } from '@mui/icons-material';
import { LookupObject } from '@/hooks/api/useLookupApi';
import DateFormField from '../form/DateFormField';
import React from 'react';

export type PropertyType = 'Building' | 'Parcel';

interface IParcelInformationForm {
  classificationOptions: ISelectMenuItem[];
}

interface IGeneralInformationForm {
  propertyType: PropertyType;
  adminAreas: ISelectMenuItem[];
}

export const GeneralInformationForm = (props: IGeneralInformationForm) => {
  const { propertyType, adminAreas } = props;
  return (
    <>
      <Typography mt={'2rem'} variant="h5">
        Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextFormField
            fullWidth
            required={propertyType === 'Building'}
            name={'Address1'}
            label={`Street address${propertyType === 'Parcel' ? ' (Leave blank if no address)' : ''}`}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            fullWidth
            name={'PID'}
            label={'PID'}
            numeric
            required={propertyType === 'Parcel'}
            rules={{ validate: (val) => String(val).length <= 9 || 'PIN is too long.' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField numeric fullWidth name={'PIN'} label={'PIN'} />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteFormField
            name={'AdministrativeAreaId'}
            label={'Administrative area'}
            options={adminAreas ?? []}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            fullWidth
            name={'Postal'}
            label={'Postal code'}
            required
            rules={{ validate: (val) => val?.length == 6 || 'Should be exactly 6 characters.' }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export const ParcelInformationForm = (props: IParcelInformationForm) => {
  return (
    <>
      <Typography mt={'2rem'} variant="h5">
        Does your agency own the parcel?
      </Typography>
      <SelectFormField
        name={'NotOwned'}
        label={'Owned'}
        options={[
          { label: 'Yes', value: false },
          { label: 'No', value: true },
        ]}
        required={true}
      />
      <Typography mt={'2rem'} variant="h5">
        Parcel information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AutocompleteFormField
            name={'ClassificationId'}
            label={'Parcel classification'}
            options={props.classificationOptions ?? []}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            fullWidth
            label={'Lot size'}
            name={'LandArea'}
            InputProps={{
              endAdornment: <InputAdornment position="end">Hectacres</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <SelectFormField
            label={
              <Box display={'inline-flex'} alignItems={'center'}>
                Sensitive information{' '}
                <Tooltip title="Some blurb about sensitive information will go here I don't know what it should say.">
                  <Help sx={{ ml: '4px' }} fontSize="small" />
                </Tooltip>
              </Box>
            }
            name={'IsSensitive'}
            options={[
              { label: 'Yes', value: true },
              { label: 'No (Non-confidential)', value: false },
            ]}
            required={false}
          />
        </Grid>
        <Grid item xs={12}>
          <TextFormField label={'Description'} name={'Description'} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextFormField label={'Legal description'} name={'LandLegalDescription'} fullWidth />
        </Grid>
      </Grid>
    </>
  );
};

interface IBuildingInformationForm {
  classificationOptions: LookupObject[];
  constructionOptions: LookupObject[];
  predominateUseOptions: LookupObject[];
}

export const BuildingInformationForm = (props: IBuildingInformationForm) => {
  return (
    <>
      <Typography mt={'2rem'} variant="h5">{`Building information`}</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} paddingTop={'1rem'}>
          <AutocompleteFormField
            name={`ClassificationId`}
            label={'Building classification'}
            options={
              props.classificationOptions?.map((classification) => ({
                label: classification.Name,
                value: classification.Id,
              })) ?? []
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextFormField required fullWidth label={'Building name'} name={`Name`} />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteFormField
            label={'Main usage'}
            name={`BuildingPredominateUseId`}
            options={
              props.predominateUseOptions?.map((usage) => ({
                label: usage.Name,
                value: usage.Id,
              })) ?? []
            }
          />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteFormField
            label={'Construction type'}
            name={`BuildingConstructionTypeId`}
            options={
              props.constructionOptions?.map((construct) => ({
                label: construct.Name,
                value: construct.Id,
              })) ?? []
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`TotalArea`}
            label={'Total area'}
            fullWidth
            numeric
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`RentableArea`}
            rules={{
              validate: (val, formVals) =>
                val <= formVals.TotalArea ||
                `Cannot be larger than Total area: ${val} <= ${formVals?.TotalArea}`,
            }}
            label={'Net usable area'}
            fullWidth
            numeric
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`BuildingTenancy`}
            label={'Tenancy'}
            numeric
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateFormField name={`BuildingTenancyUpdatedOn`} label={'Tenancy date'} />
        </Grid>
      </Grid>
    </>
  );
};

interface INetBookValue {
  years: number[];
}

// Property.Fiscals
export const NetBookValue = (props: INetBookValue) => {
  return (
    <Grid container spacing={2}>
      {props.years.map((yr, idx) => {
        return (
          <React.Fragment key={`netbookgrid${yr}`}>
            <Grid item xs={4}>
              <TextFormField
                value={yr}
                disabled
                name={`Fiscals.${idx}.FiscalYear`}
                label={'Fiscal year'}
              />
            </Grid>
            <Grid item xs={4}>
              <DateFormField name={`Fiscals.${idx}.EffectiveDate`} label={'Effective date'} />
            </Grid>
            <Grid item xs={4}>
              <TextFormField
                name={`Fiscals.${idx}.Value`}
                label={'Net book value'}
                numeric
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

interface IAssessedValue {
  years: number[];
  title?: string;
  topLevelKey?: string;
}

export const AssessedValue = (props: IAssessedValue) => {
  const { years, title, topLevelKey } = props;

  return (
    <>
      <Typography mt={2} variant="h5">
        {title ?? 'Assessed Value'}
      </Typography>
      <Box overflow={'auto'} paddingTop={'8px'}>
        {years.map((yr, idx) => {
          return (
            <Box
              mb={2}
              gap={2}
              key={`assessedvaluerow-${yr}${'-' + topLevelKey}`}
              display={'flex'}
              width={'100%'}
              flexDirection={'row'}
            >
              <TextFormField
                sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                name={`${topLevelKey ?? ''}Evaluations.${idx}.Year`}
                label={'Year'}
                value={yr}
                disabled
              />
              <TextFormField
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                name={`${topLevelKey ?? ''}Evaluations.${idx}.Value`}
                numeric
                label={'Value'}
              />
            </Box>
          );
        })}
      </Box>
    </>
  );
};
