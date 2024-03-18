import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import AutocompleteFormField from '../form/AutocompleteFormField';
import SelectFormField from '../form/SelectFormField';
import TextFormField from '../form/TextFormField';
import { Add, DeleteOutline, Help } from '@mui/icons-material';
import DateFormField from '../form/DateFormField';
import dayjs from 'dayjs';
import DeleteDialog from '../dialog/DeleteDialog';
import BuildingIcon from '@/assets/icons/building.svg';
import ParcelIcon from '@/assets/icons/parcel.svg';

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
                value={yr}
                disabled
              />
              <TextFormField
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                name={`AssessedValue.${idx}.LandValue`}
                numeric
                label={'Land'}
              />
              {[...Array(numBuildings).keys()].map((_b, localidx) => {
                return (
                  <TextFormField
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ minWidth: 'calc(33.3% - 1rem)' }}
                    key={`assessedbuilding-${idx}${localidx}`}
                    name={`BuildingFiscal.${yr}.${localidx}.Value`}
                    label={`Building ${localidx + 1}`}
                    numeric
                    defaultVal=""
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
          <TextFormField
            required
            fullWidth
            label={'Building name'}
            name={`Building.${index}.Name`}
          />
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
            numeric
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`Building.${index}.RentableArea`}
            rules={{
              validate: (val, formVals) =>
                val <= formVals.Building?.[index]?.TotalArea ||
                `Cannot be larger than Total area: ${val} <= ${formVals.Building?.[index]?.TotalArea}`,
            }}
            label={'Net usable area'}
            fullWidth
            numeric
            InputProps={{ endAdornment: <InputAdornment position="end">Sq. M</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`Building.${index}.BuildingTenancy`}
            label={'Tenancy'}
            numeric
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
                value={yr}
                disabled
                name={`NetBookValue.${idx}.Year`}
                label={'Fiscal year'}
              />
            </Grid>
            <Grid item xs={4}>
              <DateFormField name={`NetBookValue.${idx}.EffectiveDate`} label={'Effective date'} />
            </Grid>
            <Grid item xs={4}>
              <TextFormField
                name={`NetBookValue.${idx}.Value`}
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

const AddProperty = () => {
  type PropetyType = 'Building' | 'Parcel';
  const years = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const [propertyType, setPropertyType] = useState<PropetyType>('Building');
  const [showErrorText, setShowErrorTest] = useState(false);
  const [selectedDeletionIndex, setSelectedDeletionIndex] = useState<number>(undefined);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleRadioEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyType(event.target.value as PropetyType);
  };

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
      LandArea: '',
      IsSensitive: '',
      Building: [],
      AssessedValue: years.map((yr) => ({
        Year: yr,
        LandValue: '',
      })),
      BuildingFiscal: years.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: [],
        }),
        {},
      ),
      NetBookValue: years.map((yr) => ({
        Year: yr,
        EffectiveDate: dayjs(),
        Value: '',
      })),
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
        <Typography variant="h5">Property type</Typography>
        <RadioGroup name="controlled-radio-property-type">
          <Box
            border={'1px solid rgba(0, 0, 0, 0.23)'}
            borderRadius={'4px'}
            padding={'1.2rem'}
            display={'flex'}
            alignItems={'center'}
            flexDirection={'row'}
            gap={'1.5rem'}
            onClick={() => setPropertyType('Parcel')}
            sx={{
              '&:hover': {
                cursor: 'pointer',
              }
            }}
          >
            <Radio
              checked={propertyType === 'Parcel'}
              //onChange={handleRadioEvent}
              value={'Parcel'}
              sx={{ padding: 0 }}
            />
            <Icon>
              <img height={18} width={18} src={ParcelIcon} />
            </Icon>
            <Box>
              <Typography>Parcel</Typography>
              <Typography
                color={'rgba(0, 0, 0, 0.5)'}
              >{`PID (Parcel Identifier) is required to proceed.`}</Typography>
            </Box>
          </Box>
          <Box
            border={'1px solid rgba(0, 0, 0, 0.23)'}
            borderRadius={'4px'}
            padding={'1.2rem'}
            display={'flex'}
            alignItems={'center'}
            flexDirection={'row'}
            gap={'1.5rem'}
            mt={'1rem'}
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => setPropertyType('Building')}
          >
            <Radio
              checked={propertyType === 'Building'}
              //onChange={handleRadioEvent}
              value={'Building'}
              sx={{ padding: 0 }}
            />
            <Icon>
              <img height={18} width={18} src={BuildingIcon} />
            </Icon>
            <Box>
              <Typography>Building</Typography>
              <Typography
                color={'rgba(0, 0, 0, 0.5)'}
              >{`Street address with postal code is required to proceed.`}</Typography>
            </Box>
          </Box>
        </RadioGroup>
        <Typography mt={'2rem'} variant="h5">
          Address
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFormField
              fullWidth
              name={'Address1'}
              label={'Street address (Leave blank if no address)'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              fullWidth
              name={'PID'}
              label={'PID'}
              numeric
              required
              rules={{ validate: (val) => String(val).length <= 9 || 'PIN is too long.' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField numeric fullWidth name={'PIN'} label={'PIN'} />
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
            <TextFormField
              fullWidth
              numeric
              name={'Latitude'}
              label={'Latitude'}
              rules={{ validate: (val) => Math.abs(val) <= 90 || 'Outside valid range.' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              fullWidth
              numeric
              name={'Longitude'}
              label={'Longitude'}
              rules={{ validate: (val) => Math.abs(val) <= 180 || 'Outside valid range.' }}
            />
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
        <Typography mt={'2rem'} variant="h5">
          Net book value
        </Typography>
        <NetBookValue years={years} />
        {fields.map((_a, idx) => (
          <BuildingInformation
            key={`buildinginfo-${idx}`}
            index={idx}
            onDeleteClick={() => {
              setOpenDeleteDialog(true);
              setSelectedDeletionIndex(idx);
            }}
          />
        ))}
        <Button
          startIcon={<Add />}
          onClick={() => {
            append({
              ClassificationId: '',
              Name: '',
              Address1: '',
              BuildingPredominateUse: '',
              BuildingConstructionType: '',
              TotalArea: '',
              RentableArea: '',
              BuildingTenancy: '',
              BuildingTenancyUpdatedOn: dayjs(),
            });
          }}
          variant="contained"
          sx={{ padding: '8px', width: '9rem', marginX: 'auto', backgroundColor: 'grey' }}
        >
          Add Building
        </Button>
        <AssessedValue years={years} numBuildings={fields.length} />
      </FormProvider>
      {showErrorText && (
        <Typography alignSelf={'center'} variant="h5" color={'error'}>
          Please correct issues in the form input.
        </Typography>
      )}
      <Button
        onClick={async () => {
          const isValid = await formMethods.trigger();
          if (isValid) {
            console.log(JSON.stringify(formMethods.getValues(), null, 2));
            setShowErrorTest(false);
          } else {
            console.log('Error!');
            setShowErrorTest(true);
          }
        }}
        variant="contained"
        color="primary"
        sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
      >
        Submit
      </Button>
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete building'}
        message={
          'Once you delete the selected building section, all the entered data will be removed as well.'
        }
        onDelete={async () => {
          remove(selectedDeletionIndex);
          setOpenDeleteDialog(false);
        }}
        onClose={async () => setOpenDeleteDialog(false)}
      />
    </Box>
  );
};

export default AddProperty;
