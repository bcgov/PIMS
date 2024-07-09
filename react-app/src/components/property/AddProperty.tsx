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
import { useNavigate } from 'react-router-dom';
import { ParcelAdd } from '@/hooks/api/useParcelsApi';
import {
  BuildingAdd,
  BuildingConstructionType,
  BuildingPredominateUse,
} from '@/hooks/api/useBuildingsApi';
import { AuthContext } from '@/contexts/authContext';
import { parseFloatOrNull, parseIntOrNull } from '@/utilities/formatters';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { LoadingButton } from '@mui/lab';
import { LookupContext } from '@/contexts/lookupContext';
import { Classification } from '@/hooks/api/useLookupApi';

const AddProperty = () => {
  //const years = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const [propertyType, setPropertyType] = useState<PropertyType>('Parcel');
  const [showErrorText, setShowErrorTest] = useState(false);
  const navigate = useNavigate();
  const api = usePimsApi();
  const userContext = useContext(AuthContext);
  const { data: lookupData } = useContext(LookupContext);
  const { submit: submitParcel, submitting: submittingParcel } = useDataSubmitter(
    api.parcels.addParcel,
  );
  const { submit: submitBuilding, submitting: submittingBuilding } = useDataSubmitter(
    api.buildings.addBuilding,
  );

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
      LandLegalDescription: '',
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
          onBackClick={() => navigate('/properties')}
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
          propertyType={propertyType}
          adminAreas={
            lookupData?.AdministrativeAreas.map((area) => ({ label: area.Name, value: area.Id })) ??
            []
          }
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
            setShowErrorTest(false);
            if (propertyType === 'Parcel') {
              const formValues = formMethods.getValues();
              const addParcel: ParcelAdd = {
                ...formValues,
                LandArea: parseFloatOrNull(formValues.LandArea),
                PID: parseIntOrNull(formValues.PID.replace(/-/g, '')),
                PIN: parseIntOrNull(formValues.PIN),
                Postal: formValues.Postal.replace(' ', ''),
                PropertyTypeId: 0,
                AgencyId: userContext.pimsUser.data.AgencyId,
                IsVisibleToOtherAgencies: false,
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
              console.log(addParcel);
              submitParcel(addParcel).then((ret) => {
                if (ret && ret.ok) navigate('/properties');
              });
            } else {
              const formValues = formMethods.getValues();
              const addBuilding: BuildingAdd = {
                ...formValues,
                PID: parseIntOrNull(formValues.PID.replace(/-/g, '')),
                PIN: parseIntOrNull(formValues.PIN),
                Postal: formValues.Postal.replace(' ', ''),
                RentableArea: parseFloatOrNull(formValues.RentableArea),
                TotalArea: parseFloatOrNull(formValues.TotalArea),
                BuildingFloorCount: 0,
                PropertyTypeId: 1,
                AgencyId: userContext.pimsUser.data.AgencyId,
                IsVisibleToOtherAgencies: false,
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
              console.log(addBuilding);
              submitBuilding(addBuilding).then((ret) => {
                if (ret && ret.ok) navigate('/properties');
              });
            }
          } else {
            const formValues = formMethods.getValues();
            console.log('Error!');
            console.log(formValues.Postal);
            setShowErrorTest(true);
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
