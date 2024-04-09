import { Box, Grid, InputAdornment, Tooltip, Typography } from '@mui/material';
import TextFormField from '../form/TextFormField';
import AutocompleteFormField from '../form/AutocompleteFormField';
import SelectFormField, { ISelectMenuItem } from '../form/SelectFormField';
import { Room, Help } from '@mui/icons-material';
import { LookupObject } from '@/hooks/api/useLookupApi';
import DateFormField from '../form/DateFormField';
import React, { useCallback, useEffect, useState } from 'react';
import { LatLng, Map } from 'leaflet';
import usePimsApi from '@/hooks/usePimsApi';
import { centroid } from '@turf/turf';
import ParcelMap from '../map/ParcelMap';
import { useFormContext } from 'react-hook-form';

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

  const formContext = useFormContext();
  const api = usePimsApi();
  const [map, setMap] = useState<Map>(null);
  const [position, setPosition] = useState<LatLng>(null);

  const updateLocation = (latlng: LatLng) => {
    formContext.setValue('Location', { x: latlng.lng, y: latlng.lat }); //Technically, longitude is x and latitude is y...
  };

  useEffect(() => {
    const vals = formContext?.getValues();
    if (vals?.Location) {
      map?.setView([vals.Location.y, vals.Location.x], 17);
      onMove();
    }
  }, [formContext, map]);

  const onMove = useCallback(() => {
    if (map) {
      setPosition(map.getCenter());
      updateLocation(map.getCenter());
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on('move', onMove);
      return () => {
        map.off('move', onMove);
      };
    }
  }, [map, onMove]);

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
            onBlur={(event) => {
              api.parcel.getParcelByPid(event.target.value).then((response) => {
                if (response.features.length) {
                  const coordArr: [number, number] = centroid(response.features[0]).geometry
                    .coordinates;
                  map.setView([coordArr[1], coordArr[0]], 17);
                }
              });
            }}
            rules={{
              validate: (val, formVals) =>
                (val.length <= 9 &&
                  (val.length > 0 || formVals['PIN'].length > 0 || propertyType === 'Building')) ||
                'Must have set either PID or PIN',
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
              api.parcel.getParcelByPin(event.target.value).then((response) => {
                if (response.features.length) {
                  const coordArr: number[] = centroid(response.features[0]).geometry.coordinates;
                  map.setView([coordArr[1], coordArr[0]], 17);
                }
              });
            }}
            rules={{
              validate: (val, formVals) =>
                (val.length <= 9 &&
                  (val.length > 0 || formVals['PID'].length > 0 || propertyType === 'Building')) ||
                'Must have set either PID or PIN',
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
          <ParcelMap height={'500px'} mapRef={setMap}>
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
            required
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
        <Grid item xs={12}>
          <TextFormField multiline label={'Description'} name={'Description'} fullWidth />
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
    <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
      <Typography mt={2} variant="h5">
        {title ?? 'Assessed Value'}
      </Typography>
      {!years.length ? (
        <Typography alignSelf={'center'}>No values.</Typography>
      ) : (
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
      )}
    </Box>
  );
};
