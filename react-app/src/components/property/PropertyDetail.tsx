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
  PropertyNetBookValueEditDialog,
} from './PropertyDialog';
import { PropertyType } from './PropertyForms';
import MetresSquared from '@/components/text/MetresSquared';
import { zeroPadPID } from '@/utilities/formatters';
import ParcelMap from '../map/ParcelMap';
import { Map } from 'leaflet';
import { Room } from '@mui/icons-material';

interface IPropertyDetail {
  onClose: () => void;
}

const PropertyDetail = (props: IPropertyDetail) => {
  const params = useParams();
  const parcelId = isNaN(Number(params.parcelId)) ? null : Number(params.parcelId);
  const buildingId = isNaN(Number(params.buildingId)) ? null : Number(params.buildingId);
  const api = usePimsApi();
  const { data: parcel, refreshData: refreshParcel } = useDataLoader(() => {
    if (parcelId) {
      return api.parcels.getParcelById(parcelId);
    } else {
      return null;
    }
  });
  const { data: building, refreshData: refreshBuilding } = useDataLoader(() => {
    if (buildingId) {
      return api.buildings.getBuildingById(buildingId);
    } else {
      return null;
    }
  });
  const { data: relatedBuildings, refreshData: refreshRelated } = useDataLoader(
    () => parcel?.PID && api.buildings.getBuildings({ pid: parcel.PID, includeRelations: true }),
  );
  const refreshEither = () => {
    if (parcelId) {
      refreshParcel();
    } else {
      refreshBuilding();
    }
  };
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
  const [map, setMap] = useState<Map>(null);
  useEffect(() => {
    if (building) {
      map?.setView([building.Location.y, building.Location.x], 17);
    } else if (parcel) {
      map?.setView([parcel.Location.y, parcel.Location.x], 17);
    }
  }, [building, parcel, map]);

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
      return parcel.Fiscals.map((v) => v).sort((a, b) => b.FiscalYear - a.FiscalYear);
    } else if (buildingId && building) {
      return building.Fiscals.map((v) => v).sort((a, b) => b.FiscalYear - a.FiscalYear);
    } else {
      return [];
    }
  }, [parcel, building]);

  const customFormatter = (key: any, val: any) => {
    switch (key) {
      case 'Agency':
        return <Typography>{val.Name}</Typography>;
      case 'Classification':
        return (
          <ClassificationInline
            color={classification[val.Id].textColor}
            backgroundColor={classification[val.Id].bgColor}
            title={val.Name}
          />
        );
      case 'IsSensitive':
      case 'Owned':
        return val ? <Typography>Yes</Typography> : <Typography>No</Typography>;
      case 'TotalArea':
      case 'UsableArea':
        return (
          <>
            <Typography display={'inline'}>{val}</Typography>
            <MetresSquared />
          </>
        );
      case 'LandArea':
        return <Typography>{`${val} Hectares`}</Typography>;
      default:
        return <Typography>{val}</Typography>;
    }
  };

  const buildingOrParcel: PropertyType = building != null ? 'Building' : 'Parcel';
  const mainInformation = useMemo(() => {
    const data: Parcel | Building = buildingOrParcel === 'Building' ? building : parcel;
    if (!data) {
      return {};
    } else {
      const info: any = {
        Classification: data.Classification,
        PID: data.PID ? zeroPadPID(data.PID) : undefined,
        PIN: data.PIN,
        PostalCode: data.Postal,
        AdministrativeArea: data.AdministrativeArea?.Name,
        Address: data.Address1,
        IsSensitive: data.IsSensitive,
        Description: data.Description,
      };
      if (buildingOrParcel === 'Building') {
        info.Name = (data as Building).Name;
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
          id={`${buildingOrParcel} information`}
          customFormatter={customFormatter}
          values={mainInformation}
          title={`${buildingOrParcel} information`}
          onEdit={() => setOpenInformationDialog(true)}
        />
        <DataCard
          id={`${buildingOrParcel} net book value`}
          values={undefined}
          title={`${buildingOrParcel} net book value`}
          disableEdit={!netBookValues?.length}
          onEdit={() => setOpenNetBookDialog(true)}
        >
          <PropertyNetValueTable rows={netBookValues} />
        </DataCard>
        <DataCard
          id={'Assessed value'}
          values={undefined}
          title={'Assessed value'}
          disableEdit={!assessedValues?.length}
          onEdit={() => setOpenAssessedValueDialog(true)}
        >
          <PropertyAssessedValueTable
            rows={assessedValues}
            isBuilding={!!buildingId}
            parcelRelatedBuildingsNum={relatedBuildings?.length ?? 0}
          />
        </DataCard>
        <ParcelMap height={'500px'} mapRef={setMap} movable={false} zoomable={false}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
            <Room
              color="primary"
              sx={{ zIndex: 400, position: 'relative', marginBottom: '12px' }}
            />
          </Box>
        </ParcelMap>
      </Box>
      <>
        {buildingOrParcel === 'Parcel' ? (
          <ParcelInformationEditDialog
            open={openInformationDialog}
            onCancel={() => setOpenInformationDialog(false)}
            initialValues={parcel}
            postSubmit={() => {
              refreshEither();
              setOpenInformationDialog(false);
            }}
          />
        ) : (
          <BuildingInformationEditDialog
            initialValues={building}
            open={openInformationDialog}
            onCancel={() => setOpenInformationDialog(false)}
            postSubmit={() => {
              refreshEither();
              setOpenInformationDialog(false);
            }}
          />
        )}
      </>
      <PropertyAssessedValueEditDialog
        initialRelatedBuildings={relatedBuildings}
        propertyType={buildingOrParcel}
        initialValues={buildingOrParcel === 'Building' ? building : parcel}
        open={openAssessedValueDialog}
        onCancel={() => setOpenAssessedValueDialog(false)}
        postSubmit={() => {
          refreshEither();
          setOpenAssessedValueDialog(false);
        }}
      />
      <PropertyNetBookValueEditDialog
        postSubmit={() => {
          refreshEither();
          setOpenNetBookDialog(false);
        }}
        open={openNetBookDialog}
        onClose={() => setOpenNetBookDialog(false)}
        initialValues={buildingOrParcel === 'Building' ? building : parcel}
        propertyType={buildingOrParcel}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete property'}
        message={'Are you sure you want to delete this property?'}
        onDelete={async () => {}} //Purposefully omitted for now.
        onClose={async () => setOpenDeleteDialog(false)}
      />
    </CollapsibleSidebar>
  );
};

export default PropertyDetail;
