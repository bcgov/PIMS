import { Box, RadioGroup, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import BuildingIcon from '@/assets/icons/building.svg';
import ParcelIcon from '@/assets/icons/parcel.svg';
import BoxedIconRadio from '../form/BoxedIconRadio';
import usePimsApi from '@/hooks/usePimsApi';
import {
  AssessedValue,
  BuildingInformationForm,
  GeneralInformationForm,
  NetBookValue,
  ParcelInformationForm,
  PropertyType,
} from './PropertyForms';
import { NavigateBackButton } from '../display/DetailViewNavigation';
import { ParcelAdd } from '@/hooks/api/useParcelsApi';
import {
  BuildingAdd,
  BuildingConstructionType,
  BuildingPredominateUse,
} from '@/hooks/api/useBuildingsApi';
import { parseFloatOrNull, parseIntOrNull } from '@/utilities/formatters';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { LoadingButton } from '@mui/lab';
import { LookupContext } from '@/contexts/lookupContext';
import { Classification } from '@/hooks/api/useLookupApi';
import useHistoryAwareNavigate from '@/hooks/useHistoryAwareNavigate';
import useUserAgencies from '@/hooks/api/useUserAgencies';
import useAdministrativeAreaOptions from '@/hooks/useAdministrativeAreaOptions';

const AddProperty = () => {
  //const years = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const [propertyType, setPropertyType] = useState<PropertyType>('Parcel');
  const [showErrorText, setShowErrorText] = useState(false);
  const { goToFromStateOrSetRoute } = useHistoryAwareNavigate();
  const api = usePimsApi();
  const { adminAreaOptions } = useAdministrativeAreaOptions();
  const { data: lookupData } = useContext(LookupContext);
  const { submit: submitParcel, submitting: submittingParcel } = useDataSubmitter(
    api.parcels.addParcel,
  );
  const { submit: submitBuilding, submitting: submittingBuilding } = useDataSubmitter(
    api.buildings.addBuilding,
  );
  const { menuItems: agencyOptions } = useUserAgencies();

  const formMethods = useForm({
    defaultValues: {
      Address1: '',
      PIN: '',
      PID: '',
      Postal: '',
      AdministrativeAreaId: null,
      Latitude: '',
      Longitude: '',
      LandArea: '',
      IsSensitive: false,
      ClassificationId: null,
      Description: '',
      Name: '',
      BuildingPredominateUseId: null,
      BuildingConstructionTypeId: null,
      TotalArea: '',
      RentableArea: '',
      BuildingTenancy: '',
      Location: null,
      BuildingTenancyUpdatedOn: dayjs(),
      Fiscals: [],
      Evaluations: [],
      AgencyId: null,
    },
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
      <Box>
        <NavigateBackButton
          navigateBackTitle={'Back to Property Overview'}
          onBackClick={() => goToFromStateOrSetRoute('/properties')}
        />
      </Box>
      <FormProvider {...formMethods}>
        <Typography mb={'2rem'} variant="h2">
          Add New Property
        </Typography>
        <Typography variant="h5">Property Type</Typography>
        <RadioGroup name="controlled-radio-property-type">
          <BoxedIconRadio
            onClick={() => setPropertyType('Parcel')}
            checked={propertyType === 'Parcel'}
            value={'Parcel'}
            icon={ParcelIcon}
            mainText={'Parcel'}
            subText={`PID (Parcel Identifier) is required to proceed.`}
          />
          <BoxedIconRadio
            onClick={() => setPropertyType('Building')}
            checked={propertyType === 'Building'}
            value={'Building'}
            icon={BuildingIcon}
            mainText={'Building'}
            subText={`Street address with postal code is required to proceed.`}
            boxSx={{ mt: '1rem' }}
          />
        </RadioGroup>
        <GeneralInformationForm
          agencies={agencyOptions}
          defaultLocationValue={undefined}
          propertyType={propertyType}
          adminAreas={adminAreaOptions ?? []}
        />
        {propertyType === 'Parcel' ? (
          <ParcelInformationForm
            classificationOptions={lookupData?.Classifications.map((classif) => ({
              label: classif.Name,
              value: classif.Id,
            }))}
          />
        ) : (
          <BuildingInformationForm
            predominateUseOptions={lookupData?.PredominateUses as BuildingPredominateUse[]}
            classificationOptions={lookupData?.Classifications as Classification[]}
            constructionOptions={lookupData?.ConstructionTypes as BuildingConstructionType[]}
          />
        )}
        <Typography mt={'2rem'} variant="h5">
          Net Book Value
        </Typography>
        <NetBookValue name="Fiscals" maxRows={1} />
        <AssessedValue name="Evaluations" maxRows={1} />
      </FormProvider>
      {showErrorText && (
        <Typography alignSelf={'center'} variant="h5" color={'error'}>
          Please correct issues in the form input.
        </Typography>
      )}
      <LoadingButton
        loading={submittingBuilding || submittingParcel}
        onClick={async () => {
          const isValid = await formMethods.trigger();
          if (isValid && formMethods.getValues()['Location'] != null) {
            setShowErrorText(false);
            if (propertyType === 'Parcel') {
              const formValues = formMethods.getValues();
              const addParcel: ParcelAdd = {
                ...formValues,
                LandArea: parseFloatOrNull(formValues.LandArea),
                PID: parseIntOrNull(formValues.PID.replace(/-/g, '')),
                PIN: parseIntOrNull(formValues.PIN),
                Postal: formValues.Postal.replace(/ /g, '').toUpperCase(),
                PropertyTypeId: 0,
                Fiscals: formValues.Fiscals.map((a) => ({
                  ...a,
                  Value: Number(a?.Value),
                  EffectiveDate: a?.EffectiveDate?.toDate(),
                })),
                Evaluations: formValues.Evaluations.map((a) => ({
                  ...a,
                  Value: Number(a?.Value),
                })),
              };
              addParcel.Evaluations = addParcel.Evaluations.filter((a) => a.Value);
              addParcel.Fiscals = addParcel.Fiscals.filter((a) => a.Value);
              submitParcel(addParcel).then((ret) => {
                if (ret && ret.ok) goToFromStateOrSetRoute('/properties');
              });
            } else {
              const formValues = formMethods.getValues();
              const addBuilding: BuildingAdd = {
                ...formValues,
                PID: parseIntOrNull(formValues.PID.replace(/-/g, '')),
                PIN: parseIntOrNull(formValues.PIN),
                Postal: formValues.Postal.replace(/ /g, '').toUpperCase(),
                RentableArea: parseFloatOrNull(formValues.RentableArea),
                TotalArea: parseFloatOrNull(formValues.TotalArea),
                BuildingFloorCount: 0,
                PropertyTypeId: 1,
                Fiscals: formValues.Fiscals.map((a) => ({
                  ...a,
                  Value: Number(a?.Value),
                  EffectiveDate: a?.EffectiveDate?.toDate(),
                })),
                Evaluations: formValues.Evaluations.map((a) => ({
                  ...a,
                  Value: Number(a.Value),
                })),
                BuildingTenancyUpdatedOn: formValues.BuildingTenancyUpdatedOn.toDate(),
              };
              addBuilding.Evaluations = addBuilding.Evaluations.filter((a) => a.Value);
              addBuilding.Fiscals = addBuilding.Fiscals.filter((a) => a.Value);
              submitBuilding(addBuilding).then((ret) => {
                if (ret && ret.ok) goToFromStateOrSetRoute('/properties');
              });
            }
          } else {
            console.log('Error!');
            setShowErrorText(true);
          }
        }}
        variant="contained"
        color="primary"
        sx={{ padding: '8px', width: '6rem', marginX: 'auto' }}
      >
        Submit
      </LoadingButton>
    </Box>
  );
};

export default AddProperty;
