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
} from './PropertyForms';

interface IParcelInformationEditDialog {
  initialValues: Parcel;
  open: boolean;
  onCancel: () => void;
}

export const ParcelInformationEditDialog = (props: IParcelInformationEditDialog) => {
  const { initialValues } = props;

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
      PIN: null,
      PID: null,
      Postal: '',
      AdministrativeAreaId: null,
      LandArea: null,
      IsSensitive: false,
      ClassificationId: null,
      Description: '',
    },
  });

  useEffect(() => {
    infoFormMethods.reset({
      NotOwned: initialValues?.NotOwned,
      Address1: initialValues?.Address1,
      PIN: initialValues?.PIN,
      PID: initialValues?.PID,
      Postal: initialValues?.Postal,
      AdministrativeAreaId: initialValues?.AdministrativeAreaId,
      LandArea: initialValues?.LandArea,
      IsSensitive: initialValues?.IsSensitive,
      ClassificationId: initialValues?.ClassificationId,
      Description: initialValues?.Description,
    });
  }, [initialValues]);
  return (
    <ConfirmDialog
      title={'Edit parcel information'}
      open={props.open}
      onConfirm={async () => {
        const formValues: any = infoFormMethods.getValues();
        formValues.Id = initialValues.Id;
        api.parcels.updateParcelById(initialValues.Id, formValues);
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

  const { initialValues, open, onCancel } = props;
  const infoFormMethods = useForm({
    defaultValues: {
      NotOwned: true,
      Address1: '',
      PIN: null,
      PID: null,
      Postal: '',
      AdministrativeAreaId: null,
      LandArea: null,
      IsSensitive: false,
      ClassificationId: null,
      Description: '',
      Name: '',
      BuildingPredominateUseId: null,
      BuildingConstructionTypeId: null,
      TotalArea: null,
      RentableArea: null,
      BuildingTenancy: '',
      BuildingTenancyUpdatedOn: dayjs(),
    },
  });

  useEffect(() => {
    infoFormMethods.reset({
      Address1: initialValues?.Address1,
      PIN: initialValues?.PIN,
      PID: initialValues?.PID,
      Postal: initialValues?.Postal,
      AdministrativeAreaId: initialValues?.AdministrativeAreaId,
      IsSensitive: initialValues?.IsSensitive,
      ClassificationId: initialValues?.ClassificationId,
      Description: initialValues?.Description,
      Name: initialValues?.Name,
      BuildingPredominateUseId: initialValues?.BuildingPredominateUseId,
      BuildingConstructionTypeId: initialValues?.BuildingConstructionTypeId,
      TotalArea: initialValues?.TotalArea,
      RentableArea: initialValues?.RentableArea,
      BuildingTenancy: initialValues?.BuildingTenancy,
      BuildingTenancyUpdatedOn: dayjs(initialValues?.BuildingTenancyUpdatedOn),
    });
  }, [initialValues]);

  return (
    <ConfirmDialog
      title={'Edit building information'}
      open={open}
      onConfirm={async () => {
        const formValues: any = { ...infoFormMethods.getValues() };
        formValues.Id = initialValues.Id;
        formValues.BuildingTenancyUpdatedOn = formValues.BuildingTenancyUpdatedOn.toDate();
        api.buildings.updateBuildingById(initialValues.Id, formValues);
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
