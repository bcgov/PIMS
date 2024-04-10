import { Box, Button, RadioGroup, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import BuildingIcon from '@/assets/icons/building.svg';
import ParcelIcon from '@/assets/icons/parcel.svg';
import BoxedIconRadio from '../form/BoxedIconRadio';
import useDataLoader from '@/hooks/useDataLoader';
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
import { BuildingAdd } from '@/hooks/api/useBuildingsApi';
import { AuthContext } from '@/contexts/authContext';
import { parseFloatOrNull, parseIntOrNull } from '@/utilities/formatters';

const AddProperty = () => {
  const years = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const [propertyType, setPropertyType] = useState<PropertyType>('Parcel');
  const [showErrorText, setShowErrorTest] = useState(false);
  const navigate = useNavigate();
  const api = usePimsApi();
  const userContext = useContext(AuthContext);
  const { data: adminAreasData, loadOnce: loadAdminAreas } = useDataLoader(
    api.administrativeAreas.getAdministrativeAreas,
  );
  const { data: classificationData, loadOnce: loadClassifications } = useDataLoader(
    api.lookup.getClassifications,
  );
  const { data: predominateUseData, loadOnce: loadPredominateUse } = useDataLoader(
    api.lookup.getPredominateUses,
  );
  const { data: constructionTypeData, loadOnce: loadConstructionTypeData } = useDataLoader(
    api.lookup.getConstructionTypes,
  );

  loadAdminAreas();
  loadClassifications();
  loadPredominateUse();
  loadConstructionTypeData();

  const formMethods = useForm({
    defaultValues: {
      NotOwned: true,
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
      Fiscals: years.map((yr) => ({
        FiscalYear: yr,
        Value: '',
        FiscalKeyId: 0,
        EffectiveDate: dayjs(),
      })),
      Evaluations: years.map((yr) => ({
        Year: yr,
        EvaluationKeyId: 0,
        Value: '',
      })),
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
          navigateBackTitle={'Back to properties'}
          onBackClick={() => navigate('/properties')}
        />
      </Box>
      <FormProvider {...formMethods}>
        <Typography mb={'2rem'} variant="h2">
          Add new property
        </Typography>
        <Typography variant="h5">Property type</Typography>
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
          adminAreas={adminAreasData?.map((area) => ({ label: area.Name, value: area.Id })) ?? []}
        />
        {propertyType === 'Parcel' ? (
          <ParcelInformationForm
            classificationOptions={classificationData?.map((classif) => ({
              label: classif.Name,
              value: classif.Id,
            }))}
          />
        ) : (
          <BuildingInformationForm
            predominateUseOptions={predominateUseData}
            classificationOptions={classificationData}
            constructionOptions={constructionTypeData}
          />
        )}
        <Typography mt={'2rem'} variant="h5">
          Net book value
        </Typography>
        <NetBookValue years={years} />
        <AssessedValue years={years} />
      </FormProvider>
      {showErrorText && (
        <Typography alignSelf={'center'} variant="h5" color={'error'}>
          Please correct issues in the form input.
        </Typography>
      )}
      <Button
        onClick={async () => {
          const isValid = await formMethods.trigger();
          if (isValid && formMethods.getValues()['Location'] != null) {
            setShowErrorTest(false);
            if (propertyType === 'Parcel') {
              const formValues = formMethods.getValues();
              const addParcel: ParcelAdd = {
                ...formValues,
                LandArea: parseFloatOrNull(formValues.LandArea),
                PID: parseIntOrNull(formValues.PID),
                PIN: parseIntOrNull(formValues.PIN),
                PropertyTypeId: 0,
                AgencyId: userContext.pimsUser.data.AgencyId,
                IsVisibleToOtherAgencies: false,
                Fiscals: formValues.Fiscals.map((a) => ({
                  ...a,
                  EffectiveDate: a?.EffectiveDate?.toDate(),
                })),
              };
              addParcel.Evaluations = addParcel.Evaluations.filter((a) => a.Value);
              addParcel.Fiscals = addParcel.Fiscals.filter((a) => a.Value);
              api.parcels.addParcel(addParcel).then((ret) => {
                if (ret.status == 201) navigate('/properties');
              });
            } else {
              const formValues = formMethods.getValues();
              const addBuilding: BuildingAdd = {
                ...formValues,
                PID: parseIntOrNull(formValues.PID),
                PIN: parseIntOrNull(formValues.PIN),
                RentableArea: parseFloatOrNull(formValues.RentableArea),
                TotalArea: parseFloatOrNull(formValues.TotalArea),
                BuildingFloorCount: 0,
                PropertyTypeId: 0,
                AgencyId: userContext.pimsUser.data.AgencyId,
                IsVisibleToOtherAgencies: false,
                Fiscals: formValues.Fiscals.map((a) => ({
                  ...a,
                  EffectiveDate: a?.EffectiveDate?.toDate(),
                })),
                BuildingTenancyUpdatedOn: formValues.BuildingTenancyUpdatedOn.toDate(),
              };
              addBuilding.Evaluations = addBuilding.Evaluations.filter((a) => a.Value);
              addBuilding.Fiscals = addBuilding.Fiscals.filter((a) => a.Value);
              api.buildings.addBuilding(addBuilding).then((ret) => {
                if (ret.status == 201) navigate('/properties');
              });
            }
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
    </Box>
  );
};

export default AddProperty;
