import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import SelectFormField, { ISelectMenuItem } from '../form/SelectFormField';
import { Room, Help } from '@mui/icons-material';
import { LookupObject } from '@/hooks/api/useLookupApi';
import DateFormField from '../form/DateFormField';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IAddressModel } from '@/hooks/api/useToolsApi';
import { LatLng, Map } from 'leaflet';
import usePimsApi from '@/hooks/usePimsApi';
import { centroid } from '@turf/turf';
import ParcelMap from '../map/ParcelMap';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { arrayUniqueBy } from '@/utilities/helperFunctions';
import MetresSquared from '@/components/text/MetresSquared';
import { FeatureCollection } from '@/hooks/api/useParcelLayerApi';
export type PropertyType = 'Building' | 'Parcel';

interface IParcelInformationForm {
  classificationOptions: ISelectMenuItem[];
}

interface IGeneralInformationForm {
  propertyType: PropertyType;
  adminAreas: ISelectMenuItem[];
}

export const GeneralInformationForm = (props: IGeneralInformationForm) => {
  const api = usePimsApi();
  const { propertyType, adminAreas } = props;
  const [addressOptions, setAddressOptions] = useState<IAddressModel[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const formContext = useFormContext();

  useEffect(() => {
    const formValues = formContext.getValues();
    if (formValues.Address1) {
      api.tools.getAddresses(formValues.Address1, 40, 5).then((resolved) => {
        setAddressOptions(
          arrayUniqueBy(resolved.filter((x) => x.fullAddress) ?? [], (a) => a.fullAddress),
        );
      });
    }
  }, [formContext]);

  const previousController = useRef<AbortController>();
  const onAddressInputChange = (_event: any, value: string) => {
    if (value && !addressOptions.find((a) => a.fullAddress === value)) {
      if (previousController.current) {
        previousController.current.abort();
      }
      //We use this AbortController to cancel requests that haven't finished yet everytime we start a new one.
      //Without this the state can change in unexpected ways which usually results in the text input or autocomplete options disappearing.
      const controller = new AbortController();
      const signal = controller.signal;
      previousController.current = controller;
      setLoadingOptions(true);
      api.tools
        .getAddresses(value, 40, 5, signal)
        .then((resolved) => {
          setAddressOptions(
            arrayUniqueBy(resolved.filter((x) => x.fullAddress) ?? [], (a) => a.fullAddress), //Not removing duplicates here makes the autocomplete go crazy.
          );
          setLoadingOptions(false);
        })
        .catch((e) => {
          if (!(e instanceof DOMException)) {
            //Represses DOMException which is the expected result of aborting the connection.
            //If something else happens though, we may want to rethrow that.
            throw e;
          }
        });
    }
  };

  const map = useRef<Map>();
  const [position, setPosition] = useState<LatLng>(null);

  const updateLocation = (latlng: LatLng) => {
    formContext.setValue('Location', { x: latlng.lng, y: latlng.lat }); //Technically, longitude is x and latitude is y...
  };

  //Necessary to make sure we set the map to the correct place when opening this form in the edit view.
  useEffect(() => {
    const vals = formContext?.getValues();
    if (vals?.Location) {
      map.current?.setView([vals.Location.y, vals.Location.x], 17);
      onMove();
    }
  }, [formContext, map]);

  const onMove = useCallback(() => {
    if (map.current) {
      setPosition(map.current.getCenter());
      updateLocation(map.current.getCenter());
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.current?.on('move', onMove);
      return () => {
        map.current?.off('move', onMove);
      };
    }
  }, [map.current, onMove]);

  const handleFeatureCollectionResponse = (response: FeatureCollection) => {
    if (response.features.length) {
      const coordArr = centroid(response.features[0]).geometry.coordinates as [number, number];
      map.current?.setView([coordArr[1], coordArr[0]], 17);
    }
  };

  return (
    <>
      <Typography mt={'2rem'} variant="h5">
        Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name={'Address1'}
            control={formContext.control}
            render={({ field }) => {
              return (
                <Autocomplete
                  freeSolo
                  loading={loadingOptions}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.fullAddress
                  }
                  renderInput={(params) => (
                    <TextField
                      error={!!formContext.formState.errors?.['Address1']}
                      required={propertyType === 'Building'}
                      label={'Street address'}
                      helperText={
                        formContext.formState.errors?.['Address1']
                          ? 'This field is required.'
                          : undefined
                      }
                      {...params}
                    />
                  )}
                  options={addressOptions}
                  onChange={(e, value) => {
                    if (value != null) {
                      if (typeof value !== 'string') {
                        map.current?.setView(new LatLng(value.latitude, value.longitude), 17);
                        field.onChange(value.fullAddress);
                      } else {
                        field.onChange(value);
                      }
                    }
                  }}
                  onInputChange={(event, data) => {
                    if (data) {
                      field.onChange(data);
                      onAddressInputChange(event, data);
                    }
                  }}
                  value={field.value}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            fullWidth
            name={'PID'}
            label={'PID'}
            isPid
            onBlur={(event) => {
              // Only do this if there's a value here
              if (event.target.value) {
                map.current?.closePopup();
                api.parcelLayer
                  .getParcelByPid(event.target.value)
                  .then(handleFeatureCollectionResponse);
              }
            }}
            rules={{
              validate: (val, formVals) =>
                (String(val.replace(/-/g, '')).length <= 9 &&
                  (String(val).length > 0 ||
                    String(formVals['PIN']).length > 0 ||
                    propertyType === 'Building')) ||
                'Must have set either PID or PIN not exceeding 9 digits.',
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            numeric
            fullWidth
            name={'PIN'}
            label={'PIN'}
            onBlur={(event) => {
              // Only do this if there's a value here
              if (event.target.value) {
                map.current?.closePopup();
                api.parcelLayer
                  .getParcelByPin(event.target.value)
                  .then(handleFeatureCollectionResponse);
              }
            }}
            rules={{
              validate: (val, formVals) =>
                (String(val).length <= 9 &&
                  (String(val).length > 0 ||
                    String(formVals['PID']).length > 0 ||
                    propertyType === 'Building')) ||
                'Must have set either PID or PIN not exceeding 9 digits.',
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteFormField
            required
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
            rules={{
              validate: (val) =>
                val.length == 0 || val.length == 6 || 'Should be exactly 6 characters.',
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ParcelMap
            height={'500px'}
            mapRef={map}
            movable={true}
            zoomable={true}
            zoomOnScroll={false}
            popupSize="small"
            hideControls
          >
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
              <Room
                color="primary"
                sx={{ zIndex: 400, position: 'relative', marginBottom: '12px' }}
              />
            </Box>
          </ParcelMap>
          <Typography textAlign={'center'}>
            {position
              ? `Latitude: ${position.lat.toFixed(4)}, Longitude: ${position.lng.toFixed(4)}`
              : 'Fill fields or drag map to set location.'}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export const ParcelInformationForm = (props: IParcelInformationForm) => {
  return (
    <>
      <Typography mt={'2rem'} variant="h5">
        Parcel Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AutocompleteFormField
            required
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
              endAdornment: <InputAdornment position="end">Hectares</InputAdornment>,
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
          <TextFormField multiline label={'Description'} name={'Description'} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextFormField
            multiline
            label={'Legal description'}
            name={'LandLegalDescription'}
            fullWidth
          />
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
      <Typography mt={'2rem'} variant="h5">{`Building Information`}</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} paddingTop={'1rem'}>
          <AutocompleteFormField
            name={`ClassificationId`}
            label={'Building classification'}
            required
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
            required
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
            required
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
            required
            numeric
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MetresSquared />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`RentableArea`}
            required
            label={'Net usable area'}
            fullWidth
            numeric
            rules={{
              validate: (val, formVals) =>
                val <= formVals.TotalArea ||
                `Cannot be larger than Total Area: ${val} <= ${formVals?.TotalArea}`,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MetresSquared />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            name={`BuildingTenancy`}
            label={'Tenancy'}
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            rules={{
              validate: (value) => {
                /*  Need to make sure this string only contains valid numbers, while still allowing
                    for old data that was a mix of text and numbers. Using numeric prop stops any 
                    edit of text values, even removal.
                 */
                if (!/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/.test(value)) {
                  return 'This value is a percentage and must be a number greater than or equal to 0.';
                }
                const parsedValue = parseFloat(value);
                if (parsedValue < 0 || parsedValue > 100) {
                  return 'Tenancy value must be between 0 - 100';
                }
                return true;
              },
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <DateFormField name={`BuildingTenancyUpdatedOn`} label={'Tenancy date'} />
        </Grid>
        <Grid item xs={12}>
          <TextFormField
            multiline
            label={'Description'}
            name={'Description'}
            fullWidth
            minRows={2}
          />
        </Grid>
      </Grid>
    </>
  );
};

interface INetBookValue {
  name: string;
  maxRows: number;
}

// Property.Fiscals
export const NetBookValue = (props: INetBookValue) => {
  const { name, maxRows } = props;
  const { control } = useFormContext();
  const { fields, prepend } = useFieldArray({
    control: control,
    name: name,
  });

  const handleFiscalYearChange = (inputValue: string) => {
    if (String(inputValue) == '' || inputValue == null) {
      return true;
    }
    const inputYear = parseInt(inputValue);
    if (isNaN(inputYear)) {
      return 'Invalid input.';
    }
    // const yearValues: number[] = getValueByNestedKey(formValues, name).map(
    //   (evaluation: ParcelFiscal | BuildingFiscal): number =>
    //     parseInt(String(evaluation.FiscalYear)),
    // );
    const currentYear = new Date().getFullYear();
    return (
      inputYear === currentYear ||
      inputYear === currentYear - 1 ||
      `You may only enter current net book values.`
    );
  };
  return (
    <Box display={'flex'} flexDirection={'column'} gap={'2rem'}>
      <Grid container spacing={2}>
        {/* Render the current year row first */}
        {fields?.map((netbook, idx) => (
          <React.Fragment key={`netbook-item-${netbook.id}`}>
            <Grid item xs={4}>
              <TextFormField
                name={`${name}.${idx}.FiscalYear`}
                label={'Fiscal year'}
                disabled={!netbook['isNew']}
                rules={
                  netbook['isNew']
                    ? {
                        validate: handleFiscalYearChange,
                      }
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={4}>
              <DateFormField
                disabled={!netbook['isNew']}
                name={`${name}.${idx}.EffectiveDate`}
                label={'Effective date'}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFormField
                name={`${name}.${idx}.Value`}
                label={'Net Book Value'}
                disabled={!netbook['isNew']}
                numeric
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Button
        sx={{ maxWidth: '14rem', alignSelf: 'center' }}
        variant="outlined"
        disabled={fields.length >= maxRows}
        onClick={() =>
          prepend({
            FiscalYear: '',
            Value: '',
            EffectiveDate: null,
            FiscalKeyId: 0,
            isNew: true,
          })
        }
      >
        Add Current Value
      </Button>
    </Box>
  );
};

interface IAssessedValue {
  name: string;
  maxRows: number;
  title?: string;
}

export const AssessedValue = (props: IAssessedValue) => {
  const { title, name, maxRows } = props;
  const handleAssessmentYearChange = (inputValue: string) => {
    if (String(inputValue) == '' || inputValue == null) {
      return true;
    }
    const inputYear = parseInt(inputValue);
    if (isNaN(inputYear)) {
      return 'Invalid input.';
    }
    // const yearValues: number[] = getValueByNestedKey(formValues, name).map((evaluation): number =>
    //   parseInt(evaluation.Year),
    // );
    const currentYear = new Date().getFullYear();
    return (
      inputYear === currentYear ||
      inputYear === currentYear - 1 ||
      `You may only enter current assessment values.`
    );
  };
  const { control } = useFormContext();
  const { fields, prepend } = useFieldArray({
    //Ideally we provide typing for this but too annoying right now
    control: control,
    name: name,
  });

  return (
    <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
      <Typography mt={4} variant="h5">
        {title ?? 'Assessed Value'}
      </Typography>
      <Box overflow={'auto'} paddingTop={'8px'}>
        {fields?.map((evaluation, idx) => (
          <Box
            mb={2}
            gap={2}
            display={'flex'}
            width={'100%'}
            flexDirection={'row'}
            key={`${name}-assessedvaluerow-current-${evaluation.id}`}
          >
            <TextFormField
              sx={{ minWidth: 'calc(33.3% - 1rem)' }}
              name={`${name}.${idx}.Year`}
              label={'Year'}
              numeric
              disabled={!evaluation['isNew']} //Could be improved with better typing
              rules={
                evaluation['isNew']
                  ? {
                      validate: handleAssessmentYearChange,
                    }
                  : undefined
              }
            />
            <TextFormField
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ minWidth: 'calc(33.3% - 1rem)' }}
              name={`${name}.${idx}.Value`}
              disabled={!evaluation['isNew']}
              numeric
              label={'Value'}
            />
          </Box>
        ))}
      </Box>
      <Button
        sx={{ maxWidth: '14rem', alignSelf: 'center' }}
        variant="outlined"
        disabled={fields.length >= maxRows}
        onClick={() => prepend({ EvaluationKeyId: 0, Value: '', Year: '', isNew: true })}
      >
        Add Current Assessment
      </Button>
    </Box>
  );
};
