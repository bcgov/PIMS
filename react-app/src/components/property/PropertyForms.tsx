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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IAddressModel } from '@/hooks/api/useToolsApi';
import { LatLng, Map } from 'leaflet';
import usePimsApi from '@/hooks/usePimsApi';
import { centroid } from '@turf/turf';
import ParcelMap from '../map/ParcelMap';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { arrayUniqueBy } from '@/utilities/helperFunctions';
import MetresSquared from '@/components/text/MetresSquared';
import { FeatureCollection } from '@/hooks/api/useParcelLayerApi';
import { Feature } from 'geojson';
import { useMap, useMapEvents } from 'react-leaflet';
import { GeoPoint } from '@/interfaces/IProperty';
import { LookupContext } from '@/contexts/lookupContext';
export type PropertyType = 'Building' | 'Parcel';

interface IParcelInformationForm {
  classificationOptions: ISelectMenuItem[];
}

interface IGeneralInformationForm {
  propertyType: PropertyType;
  defaultLocationValue: GeoPoint | null;
  adminAreas: ISelectMenuItem[];
  agencies: ISelectMenuItem[];
}

export const GeneralInformationForm = (props: IGeneralInformationForm) => {
  const api = usePimsApi();
  const lookup = useContext(LookupContext);
  const { propertyType, adminAreas, defaultLocationValue } = props;
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

  // check for a valid postal code
  const postalRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

  const map = useRef<Map>();
  const position = formContext.watch('Location');
  const updateLocation = (latlng: LatLng) => {
    formContext.setValue('Location', { x: latlng.lng, y: latlng.lat }); //Technically, longitude is x and latitude is y...
  };

  const handleFeatureCollectionResponse = (response: FeatureCollection) => {
    if (response.features.length) {
      const coordArr = centroid(response.features[0] as unknown as Feature).geometry
        .coordinates as [number, number];
      map.current?.setView([coordArr[1], coordArr[0]], 17);
    }
  };

  /**
   * This is null return component will not render anything to the document,
   * but the hooks will still fire. This appears to be the most consistent way to
   * ensure these map events attach and fire.
   * @param props Set onMoveHandler as the function to invoke whenever the map is dragged.
   * @returns null
   */
  const MapMoveEvents = (props: { onMoveHandler: (latlng: LatLng) => void }) => {
    const map = useMap();
    useMapEvents({
      move: () => {
        props.onMoveHandler(map.getCenter());
      },
    });
    return null;
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
                        field.onChange(value.fullAddress.split(',')[0]);
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
        {propertyType === 'Parcel' && (
          <Grid item xs={12}>
            <Typography variant={'caption'}>
              Please note that either a PID or PIN is required for a Parcel entry
            </Typography>
          </Grid>
        )}
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
            noOptionsText={`No matches. Request an administrative area at ${(lookup.data?.Config?.contactEmail ?? 'RealPropertyDivision.Disposals@gov.bc.ca').split('@').join(' @')}`} // TODO: Replace this with a dialog
          />
        </Grid>
        <Grid item xs={6}>
          <TextFormField
            fullWidth
            name={'Postal'}
            label={'Postal code'}
            rules={{
              // Order matters here. If the first condition is true, the second will not be checked.
              validate: (val) =>
                !!String(val).replace(/ /g, '').match(postalRegex) ||
                val === null ||
                val.length === 0 ||
                'Should be a valid postal code or left blank.',
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <AutocompleteFormField
            allowNestedIndent
            required
            name={'AgencyId'}
            label={'Agency'}
            options={props.agencies ?? []}
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
            defaultLocation={
              defaultLocationValue
                ? new LatLng(defaultLocationValue.y, defaultLocationValue.x)
                : undefined
            }
            defaultZoom={defaultLocationValue ? 17 : undefined}
          >
            <MapMoveEvents onMoveHandler={updateLocation} />
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
              <Room
                color="primary"
                sx={{ zIndex: 400, position: 'relative', marginBottom: '12px' }}
              />
            </Box>
          </ParcelMap>
          <Typography textAlign={'center'}>
            {position
              ? `Latitude: ${position.y.toFixed(4)}, Longitude: ${position.x.toFixed(4)}`
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
            label={'Land Area'}
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
                <Tooltip title="Could disclosure of this information threaten another person's safety, mental or physical health, or interfere with public safety?">
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
                if (value == '') return true;
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

  const handleFiscalYearChange = (inputValue: string, otherYears: number[]) => {
    if (String(inputValue) == '' || inputValue == null) {
      return true;
    }
    const inputYear = parseInt(inputValue);
    if (isNaN(inputYear)) {
      return 'Invalid input.';
    }

    const currentYear = new Date().getFullYear();
    if (otherYears.includes(Number(inputValue))) {
      return `An entry already exists for this fiscal year.`;
    }
    return (
      inputYear === currentYear ||
      inputYear === currentYear - 1 ||
      `You may only enter current net book values.`
    );
  };

  const getUnusedYearOptions = (fields: Record<string, any>[]) => {
    const unusedYears = [];
    if (!fields.some((field) => field.FiscalYear == new Date().getFullYear())) {
      unusedYears.push(new Date().getFullYear());
    }
    if (!fields.some((field) => field.FiscalYear == new Date().getFullYear() - 1)) {
      unusedYears.push(new Date().getFullYear() - 1);
    }
    return unusedYears;
  };

  return (
    <Box display={'flex'} flexDirection={'column'} gap={'2rem'}>
      <Grid container spacing={2}>
        {/* Render the current year row first */}
        {fields?.map((netbook, idx) => (
          <React.Fragment key={`netbook-item-${netbook.id}`}>
            <Grid item xs={4}>
              <SelectFormField
                required
                name={`${name}.${idx}.FiscalYear`}
                label={'Fiscal year'}
                options={
                  netbook['isNew']
                    ? getUnusedYearOptions(fields).map((a) => ({
                        value: a,
                        label: a,
                      }))
                    : [{ value: netbook['FiscalYear'], label: netbook['FiscalYear'] }]
                }
                disabled={!netbook['isNew']}
                rules={
                  netbook['isNew']
                    ? {
                        validate: (value) =>
                          handleFiscalYearChange(
                            value,
                            fields.filter((a) => !a['isNew']).map((a) => a['FiscalYear']),
                          ),
                      }
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={4}>
              <DateFormField name={`${name}.${idx}.EffectiveDate`} label={'Effective date'} />
            </Grid>
            <Grid item xs={4}>
              <TextFormField
                name={`${name}.${idx}.Value`}
                label={'Net Book Value'}
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
        disabled={fields.length >= maxRows || !getUnusedYearOptions(fields).length}
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
  const handleAssessmentYearChange = (inputValue: string, otherYears: number[]) => {
    if (String(inputValue) == '' || inputValue == null) {
      return true;
    }
    const inputYear = parseInt(inputValue);
    if (isNaN(inputYear)) {
      return 'Invalid input.';
    }
    if (otherYears.includes(Number(inputValue))) {
      return `An entry already exists for this assessment year.`;
    }
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
                      validate: (value) =>
                        handleAssessmentYearChange(
                          value,
                          fields.filter((a) => !a['isNew']).map((a) => a['Year']),
                        ),
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
