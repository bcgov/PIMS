import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import TextFormField from '../form/TextFormField';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import AutocompleteFormField from '../form/AutocompleteFormField';
import SelectFormField from '../form/SelectFormField';
import NumberFormField from '../form/NumberFormField';
import { Add, DeleteOutline } from '@mui/icons-material';
import DateFormField from '../form/DateFormField';

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
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                name={`AssessedValue.${idx}.LandValue`}
                label={'Land'}
              />
              {[...Array(numBuildings).keys()].map((_b, idx) => {
                return (
                  <TextFormField
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
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
  onDeleteClick: () => void;
}

const BuildingInformation = (props: IBuildingInformation) => {
  const formContext = useFormContext();
  const [addressSame, setAddressSame] = useState(true);
  const onCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      formContext.setValue(`Building.${index}.Address1`, undefined);
    }
    setAddressSame(checked);
  };

  const { index } = props;
  return (
    <>
      <Box display={'flex'} mt={'2rem'} flexDirection={'row'} alignItems={'center'}>
        <Typography variant="h5">{`Building information (${index + 1})`}</Typography>
        <IconButton onClick={() => props.onDeleteClick()} sx={{ marginLeft: 'auto' }}>
          <DeleteOutline />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} paddingTop={'1rem'}>
          <AutocompleteFormField
            name={`Building.${index}.ClassificationId`}
            label={'Building classification'}
            options={[{ label: 'Placeholder', value: 'Placeholder' }]}
          />
        </Grid>
        <Grid item xs={12}>
          <TextFormField fullWidth label={'Building name'} name={`Building.${index}.Name`} />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={addressSame} onChange={onCheckboxClick} />}
            label="Building address is the same as parcel"
          />
        </Grid>
        {!addressSame && (
          <Grid item xs={12}>
            <TextFormField
              fullWidth
              label={'Building address'}
              name={`Building.${index}.Address1`}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <AutocompleteFormField
            label={'Main usage'}
            name={`Building.${index}.BuildingPredominateUse`}
            options={[{ label: 'Placeholder', value: 'Placeholder' }]}
          />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteFormField
            label={'Construction type'}
            name={`Building.${index}.BuildingConstructionType`}
            options={[{ label: 'Placeholder', value: 'Placeholder' }]}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`Building.${index}.TotalArea`}
            label={'Total area'}
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`Building.${index}.RentableArea`}
            label={'Net usable area'}
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`Building.${index}.BuildingTenancy`}
            label={'Tenancy'}
            type={'number'}
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateFormField
            name={`Building.${index}.BuildingTenancyUpdatedOn`}
            label={'Tenancy date'}
          />
        </Grid>
      </Grid>
    </>
  );
};

interface INetBookValue {
  years: number[];
}

const NetBookValue = (props: INetBookValue) => {
  return (
    <Grid container spacing={2}>
      {props.years.map((yr, idx) => {
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
              <DateFormField name={`FiscalYear.${idx}.EffectiveDate`} label={'Effective date'} />
            </Grid>
            <Grid item xs={4}>
              <NumberFormField
                name={`FiscalYear.${idx}.Value`}
                label={'Net book value'}
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

const AddProperty = () => {
  const formMethods = useForm({
    defaultValues: {
      Address1: '',
      PIN: '',
      PID: '',
      PostalCode: '',
      AdministrativeArea: '',
      Latitude: '',
      Longitude: '',
      Toggle: '',
      Building: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'Building',
    control: formMethods.control,
  });

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
              label={'Street address (Leave blank if no address)'}
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
            <TextFormField fullWidth name={'PostalCode'} label={'Postal code'} />
          </Grid>
          <Grid item xs={6}>
            <NumberFormField fullWidth name={'Latitude'} label={'Latitude'} />
          </Grid>
          <Grid item xs={6}>
            <NumberFormField fullWidth name={'Longitude'} label={'Longitude'} />
          </Grid>
        </Grid>
        <Typography mt={'2rem'} variant="h5">
          Does your agency own the parcel?
        </Typography>
        <SelectFormField
          name={'Toggle'}
          label={'Parcel'}
          options={[
            { label: 'Yes', value: true },
            { label: 'No (Only Buildings)', value: false },
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
            <NumberFormField
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
              label={'Sensitive information'}
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
        <Typography mt={'2rem'} variant="h5">
          Net book value
        </Typography>
        <NetBookValue years={[2023, 2024]} />
        {fields.map((_a, idx) => (
          <BuildingInformation
            key={`buildinginfo-${idx}`}
            index={idx}
            onDeleteClick={() => remove(idx)}
          />
        ))}
        <Button
          startIcon={<Add />}
          onClick={() => {
            append({});
          }}
          variant="contained"
          sx={{ padding: '8px', width: '9rem', marginX: 'auto', backgroundColor: 'grey' }}
        >
          Add Building
        </Button>
        <AssessedValue years={[2023, 2024]} numBuildings={2} />
      </FormProvider>
      <Button
        onClick={async () => {
          const isValid = await formMethods.trigger();
          if (isValid) {
            console.log(JSON.stringify(formMethods.getValues(), null, 2));
          }
        }}
        variant="contained"
        color="primary"
        sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddProperty;
