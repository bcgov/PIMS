import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import DetailViewNavigation from '../display/DetailViewNavigation';
import { Box, Skeleton, Typography } from '@mui/material';
import DataCard from '../display/DataCard';
import { ClassificationInline } from './ClassificationIcon';
import CollapsibleSidebar from '../layout/CollapsibleSidebar';
import PropertyNetValueTable from './PropertyNetValueTable';
import usePimsApi from '@/hooks/usePimsApi';
import useDataLoader from '@/hooks/useDataLoader';
import { useClassificationStyle } from './PropertyTable';
import PropertyAssessedValueTable from './PropertyAssessedValueTable';
import { useNavigate, useParams } from 'react-router-dom';
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
import { dateFormatter, pidFormatter, zeroPadPID } from '@/utilities/formatters';
import ParcelMap from '../map/ParcelMap';
import { Map } from 'leaflet';
import { Room } from '@mui/icons-material';
import TitleOwnership from '../ltsa/TitleOwnership';
import useDataSubmitter from '@/hooks/useDataSubmitter';
import { AuthContext } from '@/contexts/authContext';
import { Roles } from '@/constants/roles';
import { LookupContext } from '@/contexts/lookupContext';

interface IPropertyDetail {
  onClose: () => void;
}

const PropertyDetail = (props: IPropertyDetail) => {
  const navigate = useNavigate();
  const params = useParams();
  const { keycloak } = useContext(AuthContext);
  const { getLookupValueById } = useContext(LookupContext);
  const parcelId = isNaN(Number(params.parcelId)) ? null : Number(params.parcelId);
  const buildingId = isNaN(Number(params.buildingId)) ? null : Number(params.buildingId);
  const api = usePimsApi();
  const {
    data: parcel,
    refreshData: refreshParcel,
    isLoading: parcelsLoading,
  } = useDataLoader(() => {
    if (parcelId) {
      return api.parcels.getParcelById(parcelId);
    } else {
      return null;
    }
  });
  const {
    data: building,
    refreshData: refreshBuilding,
    isLoading: buildingsLoading,
  } = useDataLoader(() => {
    if (buildingId) {
      return api.buildings.getBuildingById(buildingId);
    } else {
      return null;
    }
  });

  const { submit: deleteProperty, submitting: deletingProperty } = useDataSubmitter(() => {
    if (parcelId && parcel) {
      return api.parcels.deleteParcelById(parcelId);
    } else {
      return api.buildings.deleteBuildingById(buildingId);
    }
  });

  const propertyLoading = buildingsLoading || parcelsLoading;
  const { data: relatedBuildings, refreshData: refreshRelated } = useDataLoader(
    () =>
      parcel?.parsedBody?.PID &&
      api.buildings.getBuildings({ pid: parcel?.parsedBody?.PID, includeRelations: true }),
  );

  const isAuditor = keycloak.hasRoles([Roles.AUDITOR]);

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

  // If neither the parcel nor building call was successful, return home.
  // Could be because doesn't exist or lack of permissions
  useEffect(() => {
    if (parcel || building) {
      if (parcel?.status !== 200 && building?.status !== 200) {
        navigate('/');
      }
    }
  }, [parcel, building]);

  const classification = useClassificationStyle();
  const map = useRef<Map>();
  useEffect(() => {
    if (building?.parsedBody?.Location || parcel?.parsedBody?.Location) {
      if (building) {
        map.current?.setView(
          [building?.parsedBody?.Location.y, building?.parsedBody?.Location.x],
          17,
        );
      } else if (parcel) {
        map.current?.setView([parcel?.parsedBody?.Location.y, parcel?.parsedBody?.Location.x], 17);
      }
    }
  }, [building, parcel, map]);

  const assessedValues = useMemo(() => {
    if (parcelId && parcel) {
      //We only want latest two years accroding to PO requirements.
      const lastTwoYrs =
        parcel?.parsedBody?.Evaluations?.sort((a, b) => b.Year - a.Year).slice(0, 2) ?? [];
      const evaluations = [];
      if (lastTwoYrs) {
        for (const parcelEval of lastTwoYrs) {
          //This is a parcel. So first, get fields for the parcel.
          const evaluation = { Year: parcelEval.Year, Land: parcelEval.Value };
          //If exists, iterate over relatedBuildings.
          relatedBuildings?.forEach((building, idx) => {
            //We need to find evaluations with the matching year of the parcel evaluations.
            //We can't just sort naively in the same way since we can't guarantee both lists have the same years.
            const buildingEval = building?.Evaluations?.find((e) => e.Year === parcelEval.Year);
            if (buildingEval) {
              evaluation[`Building${idx + 1}`] = buildingEval.Value;
            }
          });
          evaluations.push(evaluation);
        }
      }
      return evaluations;
    } else if (buildingId && building) {
      const lastTwoYrs =
        building?.parsedBody?.Evaluations?.sort((a, b) => b.Year - a.Year).slice(0, 2) ?? [];
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
      return (
        parcel?.parsedBody?.Fiscals?.map((v) => v)
          .sort((a, b) => b.FiscalYear - a.FiscalYear)
          .slice(0, 2) ?? []
      );
    } else if (buildingId && building) {
      return (
        building?.parsedBody?.Fiscals?.map((v) => v)
          .sort((a, b) => b.FiscalYear - a.FiscalYear)
          .slice(0, 2) ?? []
      );
    } else {
      return [];
    }
  }, [parcel, building]);

  const customFormatter = (key: any, val: any) => {
    switch (key) {
      case 'PID':
        return <Typography>{pidFormatter(val)}</Typography>;
      case 'Classification':
        return !val || propertyLoading ? (
          <Skeleton />
        ) : (
          <ClassificationInline
            color={classification[val.Id].textColor}
            backgroundColor={classification[val.Id].bgColor}
            title={val.Name}
          />
        );
      case 'IsSensitive':
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
      case 'Tenancy':
        return (
          <Typography>{`${val}${/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/.test(val) ? ' %' : ''}`}</Typography>
        );
      default:
        return <Typography>{val}</Typography>;
    }
  };

  const buildingOrParcel: PropertyType = building != null ? 'Building' : 'Parcel';
  const mainInformation = useMemo(() => {
    const data: Parcel | Building =
      buildingOrParcel === 'Building' ? building?.parsedBody : parcel?.parsedBody;
    const info: any = {
      Classification: getLookupValueById('Classifications', data?.ClassificationId),
      PID: data?.PID ? zeroPadPID(data.PID) : undefined,
      PIN: data?.PIN,
      PostalCode: data?.Postal,
      Agency: getLookupValueById('Agencies', data?.AgencyId)?.Name,
      AdministrativeArea: getLookupValueById('AdministrativeAreas', data?.AdministrativeAreaId)
        ?.Name,
      Address: data?.Address1,
      IsSensitive: data?.IsSensitive,
      Description: data?.Description,
    };
    if (buildingOrParcel === 'Building') {
      info.Name = (data as Building)?.Name;
      info.MainUsage = getLookupValueById(
        'PredominateUses',
        (data as Building)?.BuildingPredominateUseId,
      )?.Name;
      info.ConstructionType = getLookupValueById(
        'ConstructionTypes',
        (data as Building)?.BuildingConstructionTypeId,
      )?.Name;
      info.TotalArea = (data as Building)?.TotalArea;
      info.UsableArea = (data as Building)?.RentableArea;
      info.Tenancy = (data as Building)?.BuildingTenancy;
      info.TenancyDate = dateFormatter((data as Building)?.BuildingTenancyUpdatedOn);
    } else {
      info.LandArea = (data as Parcel)?.LandArea;
    }
    return info;
  }, [parcel, building]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInformationDialog, setOpenInformationDialog] = useState(false);
  const [openNetBookDialog, setOpenNetBookDialog] = useState(false);
  const [openAssessedValueDialog, setOpenAssessedValueDialog] = useState(false);

  const sideBarItems = [
    { title: `${buildingOrParcel} Information` },
    { title: `${buildingOrParcel} Net Book Value` },
    { title: 'Assessed Value' },
  ];

  if (buildingOrParcel === 'Parcel') sideBarItems.splice(1, 0, { title: 'LTSA Information' });

  return (
    <CollapsibleSidebar items={sideBarItems}>
      <Box
        display={'flex'}
        gap={'1rem'}
        mt={'2rem'}
        mb={'2rem'}
        flexDirection={'column'}
        width={'60rem'}
        marginX={'auto'}
      >
        <DetailViewNavigation
          navigateBackTitle={'Back to Property Overview'}
          disableDelete={isAuditor}
          deleteTitle={`Delete ${buildingOrParcel}`}
          onDeleteClick={() => setOpenDeleteDialog(true)}
          onBackClick={() => props.onClose()}
        />
        <DataCard
          loading={propertyLoading}
          id={`${buildingOrParcel} Information`}
          customFormatter={customFormatter}
          values={mainInformation}
          title={`${buildingOrParcel} Information`}
          onEdit={() => setOpenInformationDialog(true)}
          disableEdit={isAuditor}
        />
        {buildingOrParcel === 'Parcel' && (
          <DataCard
            loading={propertyLoading}
            id={'LTSA Information'}
            values={undefined}
            title={'LTSA Information'}
            disableEdit={true}
            onEdit={undefined}
          >
            <TitleOwnership
              pid={parcel?.parsedBody?.PID ? zeroPadPID(Number(parcel?.parsedBody?.PID)) : null}
            />{' '}
            <></>
          </DataCard>
        )}
        <DataCard
          id={`${buildingOrParcel} Net Book Value`}
          values={undefined}
          title={`${buildingOrParcel} Net Book Value`}
          onEdit={() => setOpenNetBookDialog(true)}
          disableEdit={isAuditor}
        >
          <PropertyNetValueTable rows={netBookValues} />
        </DataCard>
        <DataCard
          loading={propertyLoading}
          id={'Assessed Value'}
          values={undefined}
          title={'Assessed Value'}
          onEdit={() => setOpenAssessedValueDialog(true)}
          disableEdit={isAuditor}
        >
          <PropertyAssessedValueTable
            rows={assessedValues}
            isBuilding={!!buildingId}
            parcelRelatedBuildingsNum={relatedBuildings?.length ?? 0}
          />
        </DataCard>
        <ParcelMap
          height={'500px'}
          mapRef={map}
          movable={false}
          zoomable={false}
          zoomOnScroll={false}
          popupSize="small"
          hideControls
        >
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
            initialValues={parcel?.parsedBody}
            postSubmit={() => {
              refreshEither();
              setOpenInformationDialog(false);
            }}
          />
        ) : (
          <BuildingInformationEditDialog
            initialValues={building?.parsedBody}
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
        initialRelatedBuildings={
          !relatedBuildings
            ? []
            : relatedBuildings?.map((a) => ({
                ...a,
                Evaluations: a.Evaluations.sort((a, b) => b.Year - a.Year),
              }))
        }
        propertyType={buildingOrParcel}
        initialValues={buildingOrParcel === 'Building' ? building?.parsedBody : parcel?.parsedBody}
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
        initialValues={buildingOrParcel === 'Building' ? building?.parsedBody : parcel?.parsedBody}
        propertyType={buildingOrParcel}
      />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete property'}
        message={'Are you sure you want to delete this property?'}
        confirmButtonProps={{ loading: deletingProperty }}
        onDelete={async () => deleteProperty().then(() => navigate('/properties'))}
        onClose={async () => setOpenDeleteDialog(false)}
      />
    </CollapsibleSidebar>
  );
};

export default PropertyDetail;
