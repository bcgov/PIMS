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
import { parseFloatOrNull, parseIntOrNull, zeroPadPID } from '@/utilities/formatters';
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
      confirmButtonProps={{ loading: submitting }}
      onConfirm={async () => {
        const isValid = await infoFormMethods.trigger();
        if (isValid) {
          const formValues: any = { ...infoFormMethods.getValues(), Id: initialValues.Id };
          formValues.PID = parseIntOrNull(formValues.PID);
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
      confirmButtonProps={{ loading: submitting }}
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

  useEffect(() => {
    assessedFormMethods.reset({
      Evaluations: initialValues?.Evaluations?.map((evalu) => ({
        ...evalu,
        Value: evalu.Value.replace(/[$,]/g, ''), // TODO: Consider some more robust handling for this at the TypeORM level.
      })),
      RelatedBuildings: initialRelatedBuildings?.map((building) => ({
        Id: building.Id,
        Evaluations: building.Evaluations?.map((evalu) => ({
          ...evalu,
          Value: String(evalu.Value).replace(/[$,]/g, ''), // Obviously this double map is pretty evil so suggestions welcome.
        })),
      })),
    });
  }, [initialValues, initialRelatedBuildings]);

  const currentYear = new Date().getFullYear();
  const years = [currentYear];
  const defaultParcelValues = years.map((year) => ({
    Year: year,
    Value: 0,
    EffectiveDate: Date(),
    EvaluationKeyId: 0,
    ParcelId: initialValues?.Id || null,
  }));

  const evaluationMapToRequest = (
    evaluations: Partial<ParcelEvaluation>[] | Partial<BuildingEvaluation>[],
  ) => {
    return evaluations
      .filter((evaluation) => evaluation.Value != null)
      .map((evaluation) => ({
        ...evaluation,
        BuildingId: (evaluation as BuildingEvaluation).BuildingId,
        ParcelId: (evaluation as ParcelEvaluation).ParcelId,
        Value: parseFloat(String(evaluation.Value)),
        EvaluationKeyId: 0,
        Year: evaluation.Year,
      }));
  };

  useEffect(() => {
    if (!initialValues?.Evaluations || initialValues.Evaluations.length === 0) {
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
            Value: String(evalu.Value).replace(/[$,]/g, ''), // Obviously this double map is pretty evil so suggestions welcome.
          })).sort((a, b) => b.Year - a.Year),
        })),
      });
    }
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
          const parcelUpdateResponse = await submitParcel(initialValues.Id, evalus);
          if (formValues.RelatedBuildings) {
            const buildingUpdatePromises = formValues.RelatedBuildings.map(async (building) => {
              const updatedBuilding: Partial<Building> = {
                ...building,
                Evaluations: evaluationMapToRequest(building.Evaluations),
              };
              await submitBuilding(building.Id, updatedBuilding); // Update the building
            });
            await Promise.all(buildingUpdatePromises);
          }
          await parcelUpdateResponse;
          postSubmit();
        } else if (propertyType === 'Building') {
          await submitBuilding(initialValues.Id, evalus).then(() => postSubmit());
        }
      }}
      onCancel={async () => onCancel()}
    >
      <FormProvider {...assessedFormMethods}>
        {(() => {
          const evaluationYears = initialValues?.Evaluations?.map((evalu) => evalu.Year) ?? [];
          const currentYear = new Date().getFullYear();

          // Add current year and previous year if they are not already in the list
          let hasCurrentYear = evaluationYears.includes(currentYear);
          if (!hasCurrentYear) {
            evaluationYears.push(currentYear);
          }

          // Sort the years in descending order
          const sortedYears = evaluationYears.sort((a, b) => b - a);

          // Get the current year and the previous year, ensuring we have at most 2 years
          const mostRecentYears = sortedYears.slice(0, 2);

          // Check if currentYear is not in yearsFromEvaluations array
          if (!evaluationYears.includes(currentYear)) {
            // Add currentYear to yearsFromEvaluations array
            evaluationYears.unshift(currentYear);
            hasCurrentYear = false;
          }
          return (
            <>
              {/* Render top-level AssessedValue with yearsFromEvaluations */}
              <AssessedValue
                hasCurrentYear={hasCurrentYear}
                years={mostRecentYears}
                title={
                  propertyType === 'Building' ? 'Assessed Building Value' : 'Assessed Land Value'
                }
              />
              {/* Map through initialRelatedBuildings and render AssessedValue components */}
              {initialRelatedBuildings?.map((building, idx) => {
                const buildingEvals = building?.Evaluations?.map((evalu) => evalu.Year) ?? [];
                if (!buildingEvals.includes(currentYear)) {
                  // Add currentYear to yearsFromEvaluations array
                  buildingEvals.unshift(currentYear);
                }

                const past2BuildingAssessments = buildingEvals.slice(0, 2);
                return (
                  <AssessedValue
                    title={`Building (${idx + 1}) - ${building.Name + ' - ' + building.Address1}`}
                    key={`assessed-value-${building.Id}`}
                    years={past2BuildingAssessments}
                    topLevelKey={`RelatedBuildings.${idx}.`}
                  />
                );
              })}
            </>
          );
        })()}
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
  const currentYear = new Date().getFullYear();
  const years = [currentYear];
  const defaultValues = years.map((year) => ({
    FiscalYear: year,
    Value: 0,
    EffectiveDate: undefined,
    FiscalKeyId: 0,
    PropertyType: initialValues?.PropertyTypeId || null,
    Id: initialValues?.Id || null,
  }));

  useEffect(() => {
    if (!initialValues?.Fiscals || initialValues.Fiscals.length === 0) {
      // use default values if there are no initial values for fiscal years
      netBookFormMethods.reset({ Fiscals: defaultValues });
    } else {
      const fiscalYears =
        initialValues?.Fiscals?.map((fiscal: { FiscalYear: any }) => fiscal.FiscalYear) ?? [];

      const fiscalValues = initialValues.Fiscals.map((fisc) => ({
        ...fisc,
        Value: String(fisc.Value).replace(/[$,]/g, ''),
        EffectiveDate: dayjs(fisc.EffectiveDate),
      }));
      // Check if currentYear is not in yearsFromEvaluations array
      if (!fiscalYears.includes(currentYear)) {
        // Add currentYear to yearsFromEvaluations array
        fiscalYears.unshift(currentYear);
        fiscalValues.unshift({
          FiscalYear: currentYear,
          Value: 0,
          EffectiveDate: undefined,
          FiscalKeyId: 0,
          PropertyType: initialValues?.PropertyTypeId,
          Id: initialValues?.Id,
        });
      }
      netBookFormMethods.reset({
        Fiscals: fiscalValues.sort((a, b) => b.FiscalYear - a.FiscalYear),
      });
    }
  }, [initialValues]);

  const fiscalMapToRequest = (fiscals: Partial<ParcelFiscal>[] | Partial<BuildingFiscal>[]) => {
    return fiscals
      .filter((fiscal) => fiscal.Value != null)
      .map((fiscal) => ({
        ...fiscal,
        // BuildingId: (fiscal as BuildingFiscal).BuildingId,
        // ParcelId: (fiscal as ParcelFiscal).ParcelId,
        Value: parseFloat(String(fiscal.Value)),
        FiscalKeyId: 0,
        FiscalYear: fiscal.FiscalYear,
        EffectiveDate: fiscal.EffectiveDate,
      }));
  };

  const fiscalYears =
    initialValues?.Fiscals?.map((fiscal: { FiscalYear: any }) => fiscal.FiscalYear) ?? [];

  // Check if currentYear is not in yearsFromEvaluations array
  if (!fiscalYears.includes(currentYear)) {
    // Add currentYear to yearsFromEvaluations array
    fiscalYears.unshift(currentYear);
  }
  // get 2 most recent fiscal years
  const lastTwoFiscalYears = fiscalYears.slice(0, 2);
  return (
    <ConfirmDialog
      title={'Edit net book values'}
      open={open}
      confirmButtonProps={{ loading: submittingParcel || submittingBuilding }}
      onConfirm={async () => {
        const formValues: any = netBookFormMethods.getValues();
        if (propertyType === 'Parcel') {
          submitParcel(initialValues.Id, {
            Id: initialValues.Id,
            PID: initialValues.PID,
            Fiscals: fiscalMapToRequest(formValues.Fiscals),
            ...formValues,
          }).then(() => postSubmit());
        } else {
          submitBuilding(initialValues.Id, {
            Id: initialValues.Id,
            Fiscals: fiscalMapToRequest(formValues.Fiscals),
            ...formValues,
          }).then(() => postSubmit());
        }
      }}
      onCancel={async () => onClose()}
    >
      <FormProvider {...netBookFormMethods}>
        <Box paddingTop={'1rem'}>
          <NetBookValue years={initialValues?.Fiscals ? lastTwoFiscalYears : []} />
        </Box>
      </FormProvider>
    </ConfirmDialog>
  );
};
