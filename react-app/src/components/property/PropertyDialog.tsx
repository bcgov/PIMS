import { Building } from '@/hooks/api/useBuildingsApi';
import { Parcel } from '@/hooks/api/useParcelsApi';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import ConfirmDialog from '../dialog/ConfirmDialog';
import {
  GeneralInformationForm,
  ParcelInformationForm,
  BuildingInformationForm,
  AssessedValue,
  PropertyType,
  NetBookValue,
} from './PropertyForms';
import { parseFloatOrNull, parseIntOrNull, zeroPadPID } from '@/utilities/formatters';

interface IParcelInformationEditDialog {
  initialValues: Parcel;
  open: boolean;
  onCancel: () => void;
  postSubmit: () => void;
}

export const ParcelInformationEditDialog = (props: IParcelInformationEditDialog) => {
  const { initialValues, postSubmit } = props;

  const api = usePimsApi();

  const { data: adminAreasData, loadOnce: adminLoad } = useDataLoader(
    api.administrativeAreas.getAdministrativeAreas,
  );
  const { data: classificationData, loadOnce: classificationLoad } = useDataLoader(
    api.lookup.getClassifications,
  );

  adminLoad();
  classificationLoad();

  const infoFormMethods = useForm({
    defaultValues: {
      NotOwned: true,
      Address1: '',
      PIN: '',
      PID: '',
      Postal: '',
      AdministrativeAreaId: null,
      LandArea: '',
      IsSensitive: false,
      ClassificationId: null,
      Description: '',
      Location: null,
    },
  });

  useEffect(() => {
    infoFormMethods.reset({
      NotOwned: initialValues?.NotOwned,
      Address1: initialValues?.Address1,
      PID: initialValues?.PID ? zeroPadPID(initialValues.PID) : '',
      PIN: String(initialValues?.PIN ?? ''),
      Postal: initialValues?.Postal,
      AdministrativeAreaId: initialValues?.AdministrativeAreaId,
      LandArea: String(initialValues?.LandArea ?? ''),
      IsSensitive: initialValues?.IsSensitive,
      ClassificationId: initialValues?.ClassificationId,
      Description: initialValues?.Description,
      Location: initialValues?.Location,
    });
  }, [initialValues]);
  return (
    <ConfirmDialog
      title={'Edit parcel information'}
      open={props.open}
      onConfirm={async () => {
        const isValid = await infoFormMethods.trigger();
        if (isValid) {
          const formValues: any = { ...infoFormMethods.getValues(), Id: initialValues.Id };
          formValues.PID = parseIntOrNull(formValues.PID);
          formValues.PIN = parseIntOrNull(formValues.PIN);
          formValues.LandArea = parseFloatOrNull(formValues.LandArea);
          api.parcels.updateParcelById(initialValues.Id, formValues).then(() => postSubmit());
        }
      }}
      onCancel={async () => props.onCancel()}
    >
      <FormProvider {...infoFormMethods}>
        <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
          <GeneralInformationForm
            propertyType={'Parcel'}
            adminAreas={
              adminAreasData?.map((admin) => ({ label: admin.Name, value: admin.Id })) ?? []
            }
          />
          <ParcelInformationForm
            classificationOptions={
              classificationData?.map((classif) => ({
                label: classif.Name,
                value: classif.Id,
              })) ?? []
            }
          />
        </Box>
      </FormProvider>
    </ConfirmDialog>
  );
};

interface IBuildingInformationEditDialog {
  initialValues: Building;
  open: boolean;
  onCancel: () => void;
  postSubmit: () => void;
}

export const BuildingInformationEditDialog = (props: IBuildingInformationEditDialog) => {
  const api = usePimsApi();

  const { data: adminAreasData, loadOnce: adminLoad } = useDataLoader(
    api.administrativeAreas.getAdministrativeAreas,
  );
  const { data: classificationData, loadOnce: classificationLoad } = useDataLoader(
    api.lookup.getClassifications,
  );
  const { data: predominateUseData, loadOnce: predominateUseLoad } = useDataLoader(
    api.lookup.getPredominateUses,
  );
  const { data: constructionTypeData, loadOnce: constructionLoad } = useDataLoader(
    api.lookup.getConstructionTypes,
  );

  adminLoad();
  classificationLoad();
  predominateUseLoad();
  constructionLoad();

  const { initialValues, open, onCancel, postSubmit } = props;
  const infoFormMethods = useForm({
    defaultValues: {
      NotOwned: true,
      Address1: '',
      PIN: '',
      PID: '',
      Postal: '',
      AdministrativeAreaId: null,
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
      BuildingTenancyUpdatedOn: null,
      Location: null,
    },
  });

  useEffect(() => {
    infoFormMethods.reset({
      Address1: initialValues?.Address1,
      PIN: String(initialValues?.PIN ?? ''),
      PID: initialValues?.PID ? zeroPadPID(initialValues.PID) : '',
      Postal: initialValues?.Postal,
      AdministrativeAreaId: initialValues?.AdministrativeAreaId,
      IsSensitive: initialValues?.IsSensitive,
      ClassificationId: initialValues?.ClassificationId,
      Description: initialValues?.Description,
      Name: initialValues?.Name,
      BuildingPredominateUseId: initialValues?.BuildingPredominateUseId,
      BuildingConstructionTypeId: initialValues?.BuildingConstructionTypeId,
      TotalArea: String(initialValues?.TotalArea ?? ''),
      RentableArea: String(initialValues?.RentableArea ?? ''),
      BuildingTenancy: initialValues?.BuildingTenancy,
      BuildingTenancyUpdatedOn: initialValues?.BuildingTenancyUpdatedOn
        ? dayjs(initialValues?.BuildingTenancyUpdatedOn)
        : null,
      Location: initialValues?.Location,
    });
  }, [initialValues]);

  return (
    <ConfirmDialog
      title={'Edit building information'}
      open={open}
      onConfirm={async () => {
        const isValid = await infoFormMethods.trigger();
        if (isValid) {
          const formValues: any = { ...infoFormMethods.getValues(), Id: initialValues.Id };
          formValues.PID = parseIntOrNull(formValues.PID);
          formValues.PIN = parseIntOrNull(formValues.PIN);
          formValues.TotalArea = parseFloatOrNull(formValues.TotalArea);
          formValues.RentableArea = parseFloatOrNull(formValues.RentableArea);
          formValues.BuildingTenancyUpdatedOn =
            formValues.BuildingTenancyUpdatedOn?.toDate() ?? null;
          api.buildings.updateBuildingById(initialValues.Id, formValues).then(() => postSubmit());
        }
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...infoFormMethods}>
        <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
          <GeneralInformationForm
            propertyType={'Building'}
            adminAreas={
              adminAreasData?.map((admin) => ({ label: admin.Name, value: admin.Id })) ?? []
            }
          />
          <BuildingInformationForm
            classificationOptions={classificationData}
            constructionOptions={constructionTypeData}
            predominateUseOptions={predominateUseData}
          />
        </Box>
      </FormProvider>
    </ConfirmDialog>
  );
};

interface IPropertyAssessedValueEditDialog {
  initialValues: Parcel | Building;
  initialRelatedBuildings: Building[];
  open: boolean;
  onCancel: () => void;
  postSubmit: () => void;
  propertyType: PropertyType;
}

export const PropertyAssessedValueEditDialog = (props: IPropertyAssessedValueEditDialog) => {
  const { initialValues, initialRelatedBuildings, open, onCancel, postSubmit } = props;
  const api = usePimsApi();
  const assessedFormMethods = useForm({
    defaultValues: {
      Evaluations: [],
      RelatedBuildings: [],
    },
  });

  const currentYear = new Date().getFullYear();
  const years = [currentYear];
  const defaultParcelValues = years.map((year) => ({
    Year: year,
    Value: 0,
    EffectiveDate: Date(),
    EvaluationKeyId: 0,
    ParcelId: initialValues?.Id || null,
  }));

  useEffect(() => {
    if (!initialValues?.Evaluations || initialValues.Evaluations.length === 0) {
      console.log('resetting????');
      assessedFormMethods.reset({ Evaluations: defaultParcelValues });
    } else {
      assessedFormMethods.reset({
        Evaluations: initialValues?.Evaluations?.map((evalu) => ({
          ...evalu,
          Value: evalu.Value.replace(/[$,]/g, ''), // TODO: Consider some more robust handling for this at the TypeORM level.
        })),
        RelatedBuildings: initialRelatedBuildings?.map((building) => ({
          Id: building.Id,
          Evaluations: building.Evaluations?.map((evalu) => ({
            ...evalu,
            Value: evalu.Value.replace(/[$,]/g, ''), // Obviously this double map is pretty evil so suggestions welcome.
          })),
        })),
      });
    }
  }, [initialValues, initialRelatedBuildings]);
  if (!initialValues || Object.keys(initialValues).length === 0) {
    return null; // Or any other JSX to handle the case of empty initialValues
  }
  return (
    <ConfirmDialog
      title={'Edit assessed values'}
      open={open}
      onConfirm={async () => {
        const formValues = assessedFormMethods.getValues();
        const parcelUpdatePromise = api.parcels.updateParcelById(initialValues.Id, {
          Id: initialValues.Id,
          PID: initialValues.PID,
          ...formValues,
        });

        const buildingUpdatePromises = formValues.RelatedBuildings.map(async (building) => {
          const updatedBuilding: Partial<Building> = {
            ...building, // Copy existing building properties
            Evaluations: building.Evaluations.map((evaluation) => ({
              ...evaluation, // Copy existing evaluation properties
              Value: parseFloat(evaluation.Value), // Parse the value to a float
              EvaluationKeyId: 0,
              Year: evaluation.Year,
            })),
          };
          await api.buildings.updateBuildingById(building.Id, updatedBuilding); // Update the building
        });

        // Wait for both parcel update and building assessment updates to complete
        await Promise.all([parcelUpdatePromise, ...buildingUpdatePromises]);
        postSubmit();
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...assessedFormMethods}>
        <AssessedValue
          years={
            initialValues?.Evaluations
              ? initialValues.Evaluations.map((evalu) => evalu.Year)
              : [
                  ...new Set([
                    new Date().getFullYear(),
                    ...(initialValues?.Evaluations?.map((evalu) => evalu.Year) || []),
                  ]),
                ]
          }
          showCurrentYear={
            !initialValues?.Evaluations?.some((evalu) => evalu.Year === new Date().getFullYear())
          }
        />
        {initialRelatedBuildings?.map((building, idx) => (
          <AssessedValue
            title={`Building (${idx + 1}) - ${building.Name + ' - ' + building.Address1 ?? ''}`}
            key={`assessed-value-${building.Id}`}
            years={building?.Evaluations?.map((evalu) => evalu.Year)}
            showCurrentYear={
              !building?.Evaluations?.some((evalu) => evalu.Year === new Date().getFullYear())
            }
            topLevelKey={`RelatedBuildings.${idx}.`}
          />
        ))}
      </FormProvider>
    </ConfirmDialog>
  );
};

interface IPropertyNetBookValueEditDialog {
  open: boolean;
  onClose: () => void;
  postSubmit: () => void;
  initialValues: Parcel | Building;
  propertyType: PropertyType;
}

export const PropertyNetBookValueEditDialog = (props: IPropertyNetBookValueEditDialog) => {
  const { open, onClose, initialValues, propertyType, postSubmit } = props;
  const api = usePimsApi();
  const netBookFormMethods = useForm({
    defaultValues: { Fiscals: [] },
  });
  const currentYear = new Date().getFullYear();
  const years = [currentYear];
  const defaultValues = years.map((year) => ({
    FiscalYear: year,
    Value: 0,
    EffectiveDate: undefined,
    FiscalKeyId: 0,
    ParcelId: initialValues?.Id || null,
  }));

  useEffect(() => {
    if (!initialValues?.Fiscals || initialValues.Fiscals.length === 0) {
      // use default values if there are no initial values for fiscal years
      netBookFormMethods.reset({ Fiscals: defaultValues });
    } else {
      console.log('initial values are', initialValues.Fiscals);
      netBookFormMethods.reset({
        Fiscals: initialValues.Fiscals.map((fisc) => ({
          ...fisc,
          Value: String(fisc.Value).replace(/[$,]/g, ''),
          EffectiveDate: dayjs(fisc.EffectiveDate),
        })),
      });
    }
  }, [initialValues]);

  return (
    <ConfirmDialog
      title={'Edit net book values'}
      open={open}
      onConfirm={async () => {
        const formValues: any = netBookFormMethods.getValues();
        console.log('were here', formValues);
        if (propertyType === 'Parcel') {
          api.parcels
            .updateParcelById(initialValues.Id, {
              Id: initialValues.Id,
              PID: initialValues.PID,
              ...formValues,
            })
            .then(() => postSubmit());
        } else {
          api.buildings
            .updateBuildingById(initialValues.Id, {
              Id: initialValues.Id,
              ...formValues,
            })
            .then(() => postSubmit());
        }
      }}
      onCancel={async () => onClose()}
    >
      <FormProvider {...netBookFormMethods}>
        <Box paddingTop={'1rem'}>
          <NetBookValue
            years={initialValues?.Fiscals ? initialValues.Fiscals.map((f) => f.FiscalYear) : []}
          />
        </Box>
      </FormProvider>
    </ConfirmDialog>
  );
};
