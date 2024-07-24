import {
  Building,
  BuildingConstructionType,
  BuildingEvaluation,
  BuildingFiscal,
  BuildingPredominateUse,
} from '@/hooks/api/useBuildingsApi';
import { Parcel, ParcelEvaluation, ParcelFiscal } from '@/hooks/api/useParcelsApi';
import usePimsApi from '@/hooks/usePimsApi';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect } from 'react';
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
import { parseFloatOrNull, parseIntOrNull, pidFormatter } from '@/utilities/formatters';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { LookupContext } from '@/contexts/lookupContext';
import { Classification } from '@/hooks/api/useLookupApi';

interface IParcelInformationEditDialog {
  initialValues: Parcel;
  open: boolean;
  onCancel: () => void;
  postSubmit: () => void;
}

export const ParcelInformationEditDialog = (props: IParcelInformationEditDialog) => {
  const { initialValues, postSubmit } = props;

  const api = usePimsApi();
  const { data: lookupData } = useContext(LookupContext);

  const { submit, submitting } = useDataSubmitter(api.parcels.updateParcelById);

  const infoFormMethods = useForm({
    defaultValues: {
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
      Address1: initialValues?.Address1,
      PID: initialValues?.PID ? pidFormatter(initialValues.PID) : '',
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
      title={'Edit Parcel Information'}
      open={props.open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        const isValid = await infoFormMethods.trigger();
        if (isValid) {
          const formValues: any = { ...infoFormMethods.getValues(), Id: initialValues.Id };
          formValues.PID = parseIntOrNull(formValues.PID.replace(/-/g, ''));
          formValues.PIN = parseIntOrNull(formValues.PIN);
          formValues.Postal = formValues.Postal.replace(/ /g, '').toUpperCase();
          formValues.LandArea = parseFloatOrNull(formValues.LandArea);
          submit(initialValues.Id, formValues).then(() => postSubmit());
        }
      }}
      onCancel={async () => props.onCancel()}
    >
      <FormProvider {...infoFormMethods}>
        <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
          <GeneralInformationForm
            propertyType={'Parcel'}
            defaultLocationValue={initialValues?.Location}
            adminAreas={
              lookupData?.AdministrativeAreas?.map((admin) => ({
                label: admin.Name,
                value: admin.Id,
              })) ?? []
            }
          />
          <ParcelInformationForm
            classificationOptions={
              lookupData?.Classifications.map((classif) => ({
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
  const { data: lookupData } = useContext(LookupContext);

  const { submit, submitting } = useDataSubmitter(api.buildings.updateBuildingById);

  const { initialValues, open, onCancel, postSubmit } = props;
  const infoFormMethods = useForm({
    defaultValues: {
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
      PID: initialValues?.PID ? pidFormatter(initialValues.PID) : '',
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
      title={'Edit Building Information'}
      open={open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        const isValid = await infoFormMethods.trigger();
        if (isValid) {
          const formValues: any = { ...infoFormMethods.getValues(), Id: initialValues.Id };
          formValues.PID = parseIntOrNull(formValues.PID.replace(/-/g, ''));
          formValues.PIN = parseIntOrNull(formValues.PIN);
          formValues.TotalArea = parseFloatOrNull(formValues.TotalArea);
          formValues.RentableArea = parseFloatOrNull(formValues.RentableArea);
          formValues.BuildingTenancyUpdatedOn =
            formValues.BuildingTenancyUpdatedOn?.toDate() ?? null;
          submit(initialValues.Id, formValues).then(() => postSubmit());
        }
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...infoFormMethods}>
        <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
          <GeneralInformationForm
            propertyType={'Building'}
            defaultLocationValue={initialValues?.Location}
            adminAreas={
              lookupData?.AdministrativeAreas.map((admin) => ({
                label: admin.Name,
                value: admin.Id,
              })) ?? []
            }
          />
          <BuildingInformationForm
            classificationOptions={lookupData?.Classifications as Classification[]}
            constructionOptions={lookupData?.ConstructionTypes as BuildingConstructionType[]}
            predominateUseOptions={lookupData?.PredominateUses as BuildingPredominateUse[]}
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
  const { initialValues, initialRelatedBuildings, open, onCancel, propertyType, postSubmit } =
    props;
  const api = usePimsApi();

  const assessedFormMethods = useForm({
    defaultValues: {
      Evaluations: [],
      RelatedBuildings: [],
    },
    mode: 'onBlur',
  });

  const { submit: submitParcel, submitting: submittingParcel } = useDataSubmitter(
    api.parcels.updateParcelById,
  );
  const { submit: submitBuilding, submitting: submittingBuilding } = useDataSubmitter(
    api.buildings.updateBuildingById,
  );

  const evaluationMapToRequest = (
    evaluations: Partial<ParcelEvaluation>[] | Partial<BuildingEvaluation>[],
  ) => {
    return evaluations
      .filter((evaluation) => evaluation.Value != null && evaluation.Year)
      .map((evaluation) => ({
        ...evaluation,
        BuildingId: (evaluation as BuildingEvaluation).BuildingId,
        ParcelId: (evaluation as ParcelEvaluation).ParcelId,
        Value: parseFloat(String(evaluation.Value)),
        EvaluationKeyId: 0,
        Year: evaluation.Year,
      }));
  };

  const evaluationMapToFormValues = (
    evaluations: Partial<ParcelEvaluation>[] | Partial<BuildingEvaluation>[],
  ) => {
    const existingEvaluations =
      evaluations
        ?.map((evalu) => ({
          ...evalu,
          Value: evalu.Value,
        }))
        ?.sort((a, b) => b.Year - a.Year) ?? [];
    return existingEvaluations;
  };

  useEffect(() => {
    const relatedBuildings = initialRelatedBuildings?.map((building) => ({
      Id: building.Id,
      Evaluations: evaluationMapToFormValues(building.Evaluations),
    }));
    assessedFormMethods.reset({
      Evaluations: evaluationMapToFormValues(initialValues?.Evaluations),
      RelatedBuildings: relatedBuildings,
    });
  }, [initialValues, initialRelatedBuildings]);

  if (!initialValues || Object.keys(initialValues).length === 0) {
    return null; // Or any other JSX to handle the case of empty initialValues
  }

  return (
    <ConfirmDialog
      confirmButtonProps={{ loading: submittingParcel || submittingBuilding }}
      title={'Edit Assessed Values'}
      open={open}
      onConfirm={async () => {
        const isValid = await assessedFormMethods.trigger();
        if (!isValid) {
          return;
        }
        const formValues = assessedFormMethods.getValues();
        const evalus = {
          Id: initialValues.Id,
          PID: initialValues.PID,
          Evaluations: evaluationMapToRequest(formValues.Evaluations),
        };
        if (propertyType === 'Parcel') {
          await submitParcel(initialValues.Id, evalus);
          if (formValues.RelatedBuildings) {
            const buildingUpdatePromises = formValues.RelatedBuildings.map(async (building) => {
              const updatedBuilding: Partial<Building> = {
                ...building,
                Evaluations: evaluationMapToRequest(building.Evaluations),
              };
              return api.buildings.updateBuildingById(building.Id, updatedBuilding); // Update the building
            });
            await Promise.all(buildingUpdatePromises);
          }
          postSubmit();
        } else if (propertyType === 'Building') {
          await submitBuilding(initialValues.Id, evalus).then(() => postSubmit());
        }
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...assessedFormMethods}>
        {/* Render top-level AssessedValue with yearsFromEvaluations */}
        <AssessedValue
          maxRows={(initialValues?.Evaluations?.length ?? 0) + 1}
          name={'Evaluations'}
          title={propertyType === 'Building' ? 'Assessed Building Value' : 'Assessed Land Value'}
        />
        {/* Map through initialRelatedBuildings and render AssessedValue components */}
        {initialRelatedBuildings?.map((building, idx) => {
          return (
            <AssessedValue
              maxRows={(building.Evaluations?.length ?? 0) + 1}
              title={`Building (${idx + 1}) - ${building.Name + ' - ' + building.Address1}`}
              key={`assessed-value-${building.Id}`}
              name={`RelatedBuildings.${idx}.Evaluations`}
            />
          );
        })}
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
  const { submit: submitParcel, submitting: submittingParcel } = useDataSubmitter(
    api.parcels.updateParcelById,
  );
  const { submit: submitBuilding, submitting: submittingBuilding } = useDataSubmitter(
    api.buildings.updateBuildingById,
  );
  const netBookFormMethods = useForm({
    defaultValues: { Fiscals: [] },
    mode: 'onBlur',
  });

  useEffect(() => {
    const fiscalValues =
      initialValues?.Fiscals?.map((fisc) => ({
        ...fisc,
        EffectiveDate: fisc.EffectiveDate == null ? null : dayjs(fisc.EffectiveDate),
      })) ?? [];
    netBookFormMethods.reset({
      Fiscals: fiscalValues?.sort((a, b) => b.FiscalYear - a.FiscalYear) ?? [],
    });
  }, [initialValues]);

  const fiscalMapToRequest = (fiscals: Partial<ParcelFiscal>[] | Partial<BuildingFiscal>[]) => {
    return fiscals
      .filter((fiscal) => fiscal.Value != null && fiscal.FiscalYear)
      .map((fiscal) => ({
        ...fiscal,
        BuildingId: propertyType === 'Building' ? initialValues.Id : undefined,
        ParcelId: propertyType === 'Parcel' ? initialValues.Id : undefined,
        Value: parseFloat(String(fiscal.Value)),
        FiscalKeyId: 0,
        FiscalYear: Number(fiscal.FiscalYear),
        EffectiveDate: fiscal.EffectiveDate,
      }));
  };

  return (
    <ConfirmDialog
      title={'Edit Net Book Values'}
      open={open}
      confirmButtonProps={{ loading: submittingParcel || submittingBuilding }}
      onConfirm={async () => {
        const formValues: any = netBookFormMethods.getValues();
        const isValid = await netBookFormMethods.trigger();
        if (isValid) {
          if (propertyType === 'Parcel') {
            submitParcel(initialValues.Id, {
              Id: initialValues.Id,
              PID: initialValues.PID,
              Fiscals: fiscalMapToRequest(formValues.Fiscals),
            }).then(() => postSubmit());
          } else {
            submitBuilding(initialValues.Id, {
              Id: initialValues.Id,
              Fiscals: fiscalMapToRequest(formValues.Fiscals),
            }).then(() => postSubmit());
          }
        }
      }}
      onCancel={async () => onClose()}
    >
      <FormProvider {...netBookFormMethods}>
        <Box paddingTop={'1rem'}>
          <NetBookValue name={'Fiscals'} maxRows={(initialValues?.Fiscals?.length ?? 0) + 1} />
        </Box>
      </FormProvider>
    </ConfirmDialog>
  );
};
