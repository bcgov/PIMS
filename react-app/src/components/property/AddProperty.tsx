import { Box, Checkbox, FormControlLabel, Grid, InputAdornment, Typography } from '@mui/material';
import React from 'react';
import TextFormField from '../form/TextFormField';
import { FormProvider, useForm } from 'react-hook-form';
import AutocompleteFormField from '../form/AutocompleteFormField';
import SelectFormField from '../form/SelectFormField';

interface IAssessedValue {
  years: number[];
  numBuildings: number;
}

const AssessedValue = (props: IAssessedValue) => {
  const { years, numBuildings } = props;

  return (
    <>
      <Typography mt={2} variant="h5">
        Assessed Value
      </Typography>
      <Box overflow={'auto'} paddingTop={'8px'}>
        {years.map((yr, idx) => {
          return (
            <Box
              mb={2}
              gap={2}
              key={`assessedvaluerow-${yr}`}
              display={'flex'}
              width={'100%'}
              flexDirection={'row'}
            >
              <TextFormField
                sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                name={`AssessedValue.${idx}.Year`}
                label={'Year'}
                defaultValue={yr}
                disabled
              />
              <TextFormField
                sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                name={`AssessedValue.${idx}.LandValue`}
                label={'Land'}
              />
              {[...Array(numBuildings).keys()].map((_b, idx) => {
                return (
                  <TextFormField
                    sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                    key={`assessedbuilding-${idx}`}
                    name={`FiscalBuilding.${idx}.Value`}
                    label={`Building ${idx + 1}`}
                  />
                );
              })}
            </Box>
          );
        })}
      </Box>
    </>
  );
};

interface IBuildingInformation {
  index: number;
}

const BuildingInformation = (props: IBuildingInformation) => {
  const { index } = props;
  return (
    <>
      <Typography mt={'2rem'} variant="h5">{`Building information (${index + 1})`}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AutocompleteFormField
            name={'ClassificationId'}
            label={'Building classification'}
            options={[{ label: 'Placeholder', value: 'Placeholder' }]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextFormField fullWidth label={'Building name'} name={'Name'} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Building address is the same as parcel"
          />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteFormField
            label={'Main usage'}
            name={'BuildingPredominateUse'}
            options={[{ label: 'Placeholder', value: 'Placeholder' }]}
          />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteFormField
            label={'Construction type'}
            name={'BuildingConstructionType'}
            options={[{ label: 'Placeholder', value: 'Placeholder' }]}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={'TotalArea'}
            label={'Total area'}
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={'RentableArea'}
            label={'Net usable area'}
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
      </Grid>
    </>
  );
};

interface INetBookValue {
  year: number[];
}

const NetBookValue = (props: INetBookValue) => {
  return (
    <Grid container spacing={2}>
      {props.year.map((yr, idx) => {
        return (
          <React.Fragment key={`netbookgrid${yr}`}>
            <Grid item xs={4}>
              <TextFormField
                defaultValue={yr}
                disabled
                name={`FiscalYear.${idx}.Year`}
                label={'Fiscal year'}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFormField name={`FiscalYear.${idx}.EffectiveDate`} label={'Effective date'} />
            </Grid>
            <Grid item xs={4}>
              <TextFormField name={`FiscalYear.${idx}.Value`} label={'Net book value'} />
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

const AddProperty = () => {
  const formMethods = useForm();

  return (
    <Box
      display={'flex'}
      gap={'1rem'}
      mt={'2rem'}
      mb={'2rem'}
      flexDirection={'column'}
      width={'38rem'}
      marginX={'auto'}
    >
      <FormProvider {...formMethods}>
        <Typography mb={'2rem'} variant="h2">
          Add new property
        </Typography>
        <Typography variant="h5">Address</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField
              fullWidth
              name={'Address1'}
              label={'Street address (Leave blank if no address'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'PID'} label={'PID'} />
          </Grid>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'PIN'} label={'PIN'} />
          </Grid>
          <Grid item xs={6}>
            <AutocompleteFormField
              name={'AdministrativeArea'}
              label={'Administrative area'}
              options={[{ label: 'Placeholder', value: 'Placeholder' }]}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'Postal code'} label={'Postal code'} />
          </Grid>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'Latitude'} label={'Latitude'} type="number" />
          </Grid>
          <Grid item xs={6}>
            <TextFormField fullWidth name={'Longitude'} label={'Longitude'} type="number" />
          </Grid>
        </Grid>
        <Typography mt={'2rem'} variant="h5">
          Does your agency own the parcel?
        </Typography>
        <SelectFormField
          name={'Toggle'}
          label={'Parcel'}
          options={[
            { label: 'Yes', value: 'Yes' },
            { label: 'No (Only Buildings)', value: 'No' },
          ]}
          required={false}
        />
        <Typography mt={'2rem'} variant="h5">
          Parcel information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AutocompleteFormField
              name={'ClassificationId'}
              label={'Parcel classification'}
              options={[{ label: 'Placeholder', value: 'Placeholder' }]}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              fullWidth
              label={'Lot size'}
              name={'LandArea'}
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">Hectacres</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <SelectFormField
              label={'Sensitive information'}
              name={'IsSensitive'}
              options={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No (Non-confidential)', value: 'No' },
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
        <Typography mt={'2rem'} variant="h5">
          Net book value
        </Typography>
        <NetBookValue year={[2023, 2024]} />
        <BuildingInformation index={0} />
        <BuildingInformation index={1} />
        <AssessedValue years={[2023, 2024]} numBuildings={2} />
      </FormProvider>
    </Box>
  );
};

export default AddProperty;
