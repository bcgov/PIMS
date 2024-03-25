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
import { ParcelInformationEditDialog } from './PropertyForms';
import { Parcel } from '@/hooks/api/useParcelsApi';

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
    () => parcel && api.buildings.getBuildingsByPid(parcel.PID),
  );
  useEffect(() => {
    refreshBuilding();
  }, [buildingId]);

  useEffect(() => {
    refreshParcel();
  }, [parcelId]);

  useEffect(() => {
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
            const buildingEval = building.Evaluations?.find(
              (e) => e.Date.getFullYear() === parcelEval.Year,
            );
            if (buildingEval) {
              evaluation[`Building${idx + 1}`] = buildingEval.Value;
            }
          });
          evaluations.push(evaluation);
        }
      }
      return evaluations;
    } else if (buildingId && building) {
      const lastTwoYrs = building.Evaluations?.sort(
        (a, b) => b.Date.getFullYear() - a.Date.getFullYear(),
      ).slice(0, 2);
      return lastTwoYrs?.map((ev) => ({
        Year: ev.Date.getFullYear(),
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

  const buildingOrParcel = building ? 'Building' : 'Parcel';
  const mainInformation = useMemo(() => {
    const data: any = parcel ?? building;
    if (!data) {
      return {};
    } else {
      const info = {
        Classification: data.Classification,
        PID: data.PID,
        PIN: data.PIN,
        PostalCode: data.Postal,
        AdministrativeArea: data.AdministrativeArea?.Name,
        Address: data.Address1,
        LotSize: data.TotalArea,
        IsSensitive: data.IsSensitive,
        Description: data.Description,
        LandArea: data.LandArea,
        Owned: !data.NotOwned,
      };
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
          onDeleteClick={() => {}}
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
          onEdit={() => {}}
        >
          <PropertyNetValueTable rows={netBookValues} />
        </DataCard>
        <DataCard
          id={'Assessed value'}
          values={undefined}
          title={'Assessed value'}
          onEdit={() => {}}
        >
          <PropertyAssessedValueTable
            rows={assessedValues}
            isBuilding={!!buildingId}
            parcelRelatedBuildingsNum={relatedBuildings?.length ?? 0}
          />
        </DataCard>
      </Box>
      <ParcelInformationEditDialog
        open={openInformationDialog}
        onCancel={() => setOpenInformationDialog(false)}
        initialValues={parcel}
      />
    </CollapsibleSidebar>
  );
};

export default PropertyDetail;
