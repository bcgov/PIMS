import React, { useEffect, useMemo, useState } from 'react';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { Box, Typography } from '@mui/material';
import DataCard from '../display/DataCard';
import { ClassificationInline } from './ClassificationIcon';
import CollapsibleSidebar from '../layout/CollapsibleSidebar';
import PropertyNetValueTable from './PropertyNetValueTable';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { useClassificationStyle } from './PropertyTable';
import PropertyAssessedValueTable from './PropertyAssessedValueTable';
import { useParams } from 'react-router-dom';
import { Parcel } from '@/hooks/api/useParcelsApi';
import { Building } from '@/hooks/api/useBuildingsApi';
import DeleteDialog from '../dialog/DeleteDialog';
import {
  BuildingInformationEditDialog,
  ParcelInformationEditDialog,
  PropertyAssessedValueEditDialog,
} from './PropertyDialog';

interface IPropertyDetail {
  onClose: () => void;
}

const PropertyDetail = (props: IPropertyDetail) => {
  const params = useParams();
  const parcelId = isNaN(Number(params.parcelId)) ? null : Number(params.parcelId);
  const buildingId = isNaN(Number(params.buildingId)) ? null : Number(params.buildingId);
  const api = usePimsApi();
  const { data: parcel, refreshData: refreshParcel } = useDataLoader(() =>
    api.parcels.getParcelById(parcelId),
  );
  const { data: building, refreshData: refreshBuilding } = useDataLoader(() =>
    api.buildings.getBuildingById(buildingId),
  );
  const { data: relatedBuildings, refreshData: refreshRelated } = useDataLoader(
    () => parcelId && api.buildings.getBuildings(parcel.PID),
  );
  useEffect(() => {
    refreshBuilding();
  }, [buildingId]);

  useEffect(() => {
    refreshParcel();
  }, [parcelId]);

  useEffect(() => {
    console.log(`Will refresh related with pid ${parcel?.PID}`)
    refreshRelated();
  }, [parcel]);

  const classification = useClassificationStyle();

  const assessedValues = useMemo(() => {
    if (parcelId && parcel) {
      //We only want latest two years accroding to PO requirements.
      const lastTwoYrs = parcel.Evaluations?.sort((a, b) => b.Year - a.Year).slice(0, 2);
      const evaluations = [];
      if (lastTwoYrs) {
        for (const parcelEval of lastTwoYrs) {
          //This is a parcel. So first, get fields for the parcel.
          const evaluation = { Year: parcelEval.Year, Land: parcelEval.Value };
          //If exists, iterate over relatedBuildings.
          relatedBuildings?.forEach((building, idx) => {
            //We need to find evaluations with the matching year of the parcel evaluations.
            //We can't just sort naively in the same way since we can't guarantee both lists have the same years.
            const buildingEval = building.Evaluations?.find((e) => e.Year === parcelEval.Year);
            if (buildingEval) {
              evaluation[`Building${idx + 1}`] = buildingEval.Value;
            }
          });
          evaluations.push(evaluation);
        }
      }
      console.log(`Final evaluations: ${JSON.stringify(evaluations)}`);
      return evaluations;
    } else if (buildingId && building) {
      const lastTwoYrs = building.Evaluations?.sort((a, b) => b.Year - a.Year).slice(0, 2);
      return lastTwoYrs?.map((ev) => ({
        Year: ev.Year,
        Value: ev.Value,
      }));
    } else {
      return [];
    }
  }, [parcel, building, relatedBuildings]);

  const netBookValues = useMemo(() => {
    if (parcelId && parcel) {
      return parcel.Fiscals;
    } else if (buildingId && building) {
      return building.Fiscals;
    } else {
      return [];
    }
  }, [parcel, building]);

  const customFormatter = (key: any, val: any) => {
    if (key === 'Agency' && val) {
      return <Typography>{val.Name}</Typography>;
    } else if (key === 'Classification' && val) {
      return (
        <ClassificationInline
          color={classification[val.Id].textColor}
          backgroundColor={classification[val.Id].bgColor}
          title={val.Name}
        />
      );
    } else if (key === 'IsSensitive') {
      return val ? <Typography>Yes</Typography> : <Typography>No</Typography>;
    }
    return <Typography>{val}</Typography>;
  };

  const buildingOrParcel = typeof building === 'object' ? 'Building' : 'Parcel';
  const mainInformation = useMemo(() => {
    const data: Parcel | Building = buildingOrParcel === 'Building' ? building : parcel;
    if (!data) {
      return {};
    } else {
      const info: any = {
        Classification: data.Classification,
        PID: data.PID,
        PIN: data.PIN,
        PostalCode: data.Postal,
        AdministrativeArea: data.AdministrativeArea?.Name,
        Address: data.Address1,
        IsSensitive: data.IsSensitive,
        Description: data.Description,
      };
      if (buildingOrParcel === 'Building') {
        info.TotalArea = (data as Building).TotalArea;
        info.UsableArea = (data as Building).RentableArea;
      } else {
        info.LandArea = (data as Parcel).LandArea;
        info.Owned = !(data as Parcel).NotOwned;
      }
      return info;
    }
  }, [parcel, building]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInformationDialog, setOpenInformationDialog] = useState(false);
  const [openNetBookDialog, setOpenNetBookDialog] = useState(false);
  const [openAssessedValueDialog, setOpenAssessedValueDialog] = useState(false);

  return (
    <CollapsibleSidebar
      items={[
        { title: `${buildingOrParcel} information` },
        { title: `${buildingOrParcel} net book value` },
        { title: 'Assessed value' },
      ]}
    >
      <Box
        display={'flex'}
        gap={'1rem'}
        mt={'2rem'}
        mb={'2rem'}
        flexDirection={'column'}
        width={'46rem'}
        marginX={'auto'}
      >
        <DetailViewNavigation
          navigateBackTitle={'Back to Property Overview'}
          deleteTitle={`Delete ${buildingOrParcel}`}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onBackClick={() => props.onClose()}
        />
        <DataCard
          id="Parcel information"
          customFormatter={customFormatter}
          values={mainInformation}
          title={`${buildingOrParcel} information`}
          onEdit={() => setOpenInformationDialog(true)}
        />
        <DataCard
          id={`${buildingOrParcel} net book value`}
          values={undefined}
          title={`${buildingOrParcel} net book value`}
          onEdit={() => setOpenNetBookDialog(true)}
        >
          <PropertyNetValueTable rows={netBookValues} />
        </DataCard>
        <DataCard
          id={'Assessed value'}
          values={undefined}
          title={'Assessed value'}
          onEdit={() => setOpenAssessedValueDialog(true)}
        >
          <PropertyAssessedValueTable
            rows={assessedValues}
            isBuilding={!!buildingId}
            parcelRelatedBuildingsNum={relatedBuildings?.length ?? 0}
          />
        </DataCard>
      </Box>
      <>
        {buildingOrParcel === 'Parcel' ? (
          <ParcelInformationEditDialog
            open={openInformationDialog}
            onCancel={() => setOpenInformationDialog(false)}
            initialValues={parcel}
          />
        ) : (
          <BuildingInformationEditDialog
            initialValues={building}
            open={openInformationDialog}
            onCancel={() => setOpenInformationDialog(false)}
          />
        )}
      </>
      <PropertyAssessedValueEditDialog
        initialRelatedBuildings={relatedBuildings}
        propertyType={buildingOrParcel}
        initialValues={buildingOrParcel === 'Building' ? building : parcel}
        open={openAssessedValueDialog}
        onCancel={() => setOpenAssessedValueDialog(false)}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete property'}
        message={'Are you sure you want to delete this property?'}
        onDelete={async () => {}}
        onClose={async () => setOpenDeleteDialog(false)}
      />
    </CollapsibleSidebar>
  );
};

export default PropertyDetail;
