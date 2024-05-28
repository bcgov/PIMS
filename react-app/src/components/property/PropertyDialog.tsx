import { Building, BuildingEvaluation, BuildingFiscal } from '@/hooks/api/useBuildingsApi';
import { Parcel, ParcelEvaluation, ParcelFiscal } from '@/hooks/api/useParcelsApi';
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
import { parseFloatOrNull, parseIntOrNull, pidFormatter } from '@/utilities/formatters';
import useDataSubmitter from '@/hooks/useDataSubmitter';

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
  const { submit, submitting } = useDataSubmitter(api.parcels.updateParcelById);
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
      title={'Edit parcel information'}
      open={props.open}
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        const isValid = await infoFormMethods.trigger();
        if (isValid) {
          const formValues: any = { ...infoFormMethods.getValues(), Id: initialValues.Id };
          formValues.PID = parseIntOrNull(formValues.PID.replace(/-/g, ''));
          formValues.PIN = parseIntOrNull(formValues.PIN);
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
  const { submit, submitting } = useDataSubmitter(api.buildings.updateBuildingById);

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
      title={'Edit building information'}
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
    for (const newEntry of evaluations.filter((f) => f['isNew'])) {
      const oldEntry = evaluations.findIndex(
        (f) => Number(f.Year) === Number(newEntry.Year) && !f['isNew'],
      );
      if (oldEntry > -1) {
        evaluations = [...evaluations.slice(0, oldEntry), ...evaluations.slice(oldEntry + 1)];
      }
    }
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
          Value: evalu.Value.replace(/[$,]/g, ''),
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
      title={'Edit assessed values'}
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
          // const buildingEvals = building?.Evaluations?.map((evalu) => evalu.Year) ?? [];
          // if (!buildingEvals.includes(currentYear)) {
          //   // Add currentYear to yearsFromEvaluations array
          //   buildingEvals.unshift(currentYear);
          // }

          // const past2BuildingAssessments = buildingEvals.slice(0, 2);
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
  // const currentYear = new Date().getFullYear();
  // const years = [currentYear];
  // const defaultValues = years.map((year) => ({
  //   FiscalYear: year,
  //   Value: 0,
  //   EffectiveDate: undefined,
  //   FiscalKeyId: 0,
  //   PropertyType: initialValues?.PropertyTypeId || null,
  //   Id: initialValues?.Id || null,
  // }));

  useEffect(() => {
    const fiscalValues = initialValues?.Fiscals.map((fisc) => ({
      ...fisc,
      Value: String(fisc.Value).replace(/[$,]/g, ''),
      EffectiveDate: fisc.EffectiveDate == null ? null : dayjs(fisc.EffectiveDate),
    }));
    // // Check if currentYear is not in yearsFromEvaluations array
    // if (!fiscalYears.includes(currentYear)) {
    //   // Add currentYear to yearsFromEvaluations array
    //   fiscalYears.unshift(currentYear);
    //   fiscalValues.unshift({
    //     FiscalYear: currentYear,
    //     Value: 0,
    //     EffectiveDate: undefined,
    //     FiscalKeyId: 0,
    //     PropertyType: initialValues?.PropertyTypeId,
    //     Id: initialValues?.Id,
    //   });
    // }
    netBookFormMethods.reset({
      Fiscals: fiscalValues?.sort((a, b) => b.FiscalYear - a.FiscalYear),
    });
  }, [initialValues]);

  const fiscalMapToRequest = (fiscals: Partial<ParcelFiscal>[] | Partial<BuildingFiscal>[]) => {
    for (const newEntry of fiscals.filter((f) => f['isNew'])) {
      const oldEntry = fiscals.findIndex(
        (f) => Number(f.FiscalYear) === Number(newEntry.FiscalYear) && !f['isNew'],
      );
      if (oldEntry > -1) {
        fiscals = [...fiscals.slice(0, oldEntry), ...fiscals.slice(oldEntry + 1)];
      }
    }
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
      title={'Edit net book values'}
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
